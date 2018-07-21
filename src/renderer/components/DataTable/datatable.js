export class DataTable {
    config = require('./config.js').default
    helper = require('./helper.js').default
    selection = new (require('./selection.js').SelectionManager)();
    keyDownListener = null;

    constructor(rootElement) {
        this.rootElement = rootElement;
        this.create();
        var dis = this;
        this.keyDownListener = function(e) {
            dis.selection.onKeyDown.apply(dis.selection, [e]);
        };
        document.addEventListener("keydown", this.keyDownListener);
        this.selection.onSelectedRangesChanged = function(ranges) {
            dis.invalidateSoft(ranges);

            if (dis.selection.lastCell) {
                dis.onCellActive.apply(dis, [dis.selection.lastCell.x, dis.selection.lastCell.y]);
            }
        }
    }

    destroy() {
        document.removeEventListener("keydown", this.keyDownListener);
    }

    create() {
        this.rootElement.innerHTML = '';
        this.holders = this.createHolders()
        this.rootElement.append(this.holders.outerContainer);
        var dis = this;
    }

    onCellActive(x, y) {
        var w = 0;
        for (var i = 0; i < x + 1; i++) {
            w += this.getColumn(i).width;
        }
        var h = (y + 1) * this.config.row.height;
        if (w >= (this.holders.viewport.clientWidth + this.holders.viewport.scrollLeft)) {
            this.holders.viewport.scrollLeft = w - this.holders.viewport.clientWidth;
        } else {
            var l = w - this.getColumn(x).width;
            if (this.holders.viewport.scrollLeft > l) {
                this.holders.viewport.scrollLeft = l;
            }
        }
        if (h >= (this.holders.viewport.clientHeight + this.holders.viewport.scrollTop)) {
            this.holders.viewport.scrollTop = h - this.holders.viewport.clientHeight;
        }
        h -= this.config.row.height;

        if (h <= (this.holders.viewport.scrollTop)) {
            this.holders.viewport.scrollTop = h;
        }
    }

    onKeyDown(e) {
        //console.log('keydown', e);
    }
    onMouseEnter(e) {
    }

    setData(data) {
        this.create();
        this.data = data;
        this.selection.columns = this.data.columns.length;
        this.selection.rows = this.data.rows.length;
        this.holders.numbers_inner.style.height = this.helper.px(this.config.row.height * this.data.rows.length);
        this.holders.viewport_content.style.height = this.helper.px(this.config.row.height * this.data.rows.length);
        this.invalidate();
    }

    invalidateSoft(selectionRanges) {
        this.renderVisible(selectionRanges);
        this.renderColumns();
        if (this.selection.lastCell) {
            this.onViewportScroll();
        }
    }

    invalidate(selectionRanges) {
        this.holders.numbers_inner.innerHTML = '';
        this.holders.viewport_content.innerHTML = '';
        this.rowCache = {};
        this.renderVisible(selectionRanges);
        this.renderColumns();
    }

    createHolders() {
        var holders = {};
        holders.outerContainer = document.createElement('div')
        holders.outerContainer.style.width = holders.outerContainer.style.height = '100%';
        holders.outerContainer.style.padding = '5px';
        holders.outerContainer.style['user-select'] = 'none';

        var css = `.col-resize:hover { cursor: col-resize; }
        .flashcell {
            background: #007a99;
            color: #333333;
            border: 5px solid #FFF;
        }
        .copyFlash {
            animation: fadeinout 200ms linear forwards;
        }
        @keyframes fadeinout {
          0% { background: #007a99; opacity: 0.7; }
          100% { opacity: 1;  }
          50% { opacity: 1; }
        }
        `;
        var style = document.createElement('style');
        style.appendChild(document.createTextNode(css));
        document.getElementsByTagName('head')[0].appendChild(style);


        holders.innerContainer = document.createElement('div')
        holders.innerContainer.style.display = 'flex';
        holders.innerContainer.style['flex-direction'] = 'column';
        holders.innerContainer.style['cursor'] = 'default';
        holders.innerContainer.style.width = holders.innerContainer.style.height = '100%';
        holders.outerContainer.appendChild(holders.innerContainer);

        holders.columns = document.createElement('div')
        holders.columns.style['flex-basis'] = this.helper.px(this.config.column.height)
        holders.columns.style['position'] = 'relative';
        holders.columns.style['flex-grow'] = holders.columns.style['flex-shrink'] = '0'
        holders.columns.style['margin-left'] = this.helper.px(this.config.numbers.width + this.config.numbers.distance)
        this.helper.apply(holders.columns.style, this.config.column.style);

        holders.columns_inner = document.createElement('div')
        holders.columns_inner.style['position'] = 'absolute';
        holders.columns_inner.style['top'] = '0px';
        holders.columns_inner.style['left'] = '0px';
        holders.columns_inner.style['width'] = '10000px';
        holders.columns_inner.style['height'] = '100%';
        holders.columns.appendChild(holders.columns_inner);

        holders.innerContainer.appendChild(holders.columns);

        holders.belowcolumns = document.createElement('div')
        holders.belowcolumns.style.flex = '1 auto';
        holders.belowcolumns.style.display = 'flex';
        holders.belowcolumns.style['flex-direction'] = 'row';
        holders.belowcolumns.style['margin-top'] = this.helper.px(this.config.numbers.distance)
        holders.belowcolumns.style.height = '100%';
        holders.innerContainer.appendChild(holders.belowcolumns);

        holders.numbers = document.createElement('div')
        holders.numbers.style.height = '100%';
        holders.numbers.style.overflow = 'hidden';
        holders.numbers.style['flex-basis'] = this.helper.px(this.config.numbers.width);
        holders.numbers.style['flex-grow'] = holders.numbers.style['flex-shrink'] = '0'
        holders.numbers.style.float = 'left';
        holders.numbers.style['margin-right'] = 'left';
        holders.numbers.style['position'] = 'relative';
        this.helper.apply(holders.numbers.style, this.config.numbers.style);
        holders.belowcolumns.appendChild(holders.numbers);

        holders.numbers_inner = document.createElement('div')
        //holders.numbers_inner.style.width = holders.numbers_inner.style.height = '100%';
        holders.numbers_inner.style.position = 'relative';
        holders.numbers_inner.style.width = '100%';
        holders.numbers_inner.style.top = holders.numbers_inner.style.left = '0px';

        holders.numbers.appendChild(holders.numbers_inner);

        holders.viewport = document.createElement('div')
        holders.viewport.style.width = '50px';
        holders.viewport.style.height = '100%';
        holders.viewport.style['margin-left'] = this.helper.px(this.config.numbers.distance);
        holders.viewport.style.flex = '1 auto';
        holders.viewport.style.overflow = 'scroll';
        holders.viewport.style.border = '1px solid #f3f3f3';

        holders.viewport_content = document.createElement('div')
        holders.viewport_content.style.position = 'relative';

        holders.viewport.appendChild(holders.viewport_content);

        var dis = this;
        holders.viewport.onscroll = function(e) {
            dis.onViewportScroll.apply(dis);
        };
        holders.belowcolumns.appendChild(holders.viewport);

        return holders;
    }

    renderColumns() {
        this.holders.columns_inner.innerHTML = '';
        this.data.columns.forEach((c, i) => {
            c.index = i;
            var el = this.createColumn(c);

            this.holders.columns_inner.appendChild(el);
        });
    }

    getColumn(n) {
        return this.data.columns[n];
    }

    onViewportScroll() {
        this.scrolls = this.scrolls || 0;
        var left = this.helper.px(this.holders.viewport.scrollLeft * -1);
        var top = this.helper.px(this.holders.viewport.scrollTop * -1);

        this.holders.columns.scrollLeft = this.holders.viewport.scrollLeft;
        this.holders.numbers.scrollTop = this.holders.viewport.scrollTop;

        if (!this.renderTimer) {
            this.renderTimer = setTimeout(() => {
                this.renderVisible();
                this.renderTimer = null;
            }, 10);
        }
    }

    renderNumber(rowIndex) {
        var rowContainer = document.createElement('div');
        rowContainer.style.top      = (rowIndex * this.config.row.height) + 'px';
        rowContainer.style.position = 'absolute';
        rowContainer.style.height   = this.helper.px(this.config.row.height);
        rowContainer.style['border-bottom'] = '1px solid #f0f0f0';
        rowContainer.style['width'] = '100%';

        var inside_div = document.createElement('div');
        inside_div.innerText = rowIndex + 1;
        inside_div.style['text-align'] = 'left';
        inside_div.style['font-family'] = 'menlo';
        inside_div.style['font-weight'] = 'normal';
        inside_div.style['padding-left'] = '6px';
        inside_div.style['padding-top'] = '4px';
        inside_div.style['color'] = 'rgb(160, 160, 160)';
        inside_div.style['font-size'] = '12px';

        rowContainer.appendChild(inside_div);

        this.holders.numbers_inner.appendChild(rowContainer);
        return rowContainer;
    }

    getVisibleRange() {
        var visibleBox = {};
        visibleBox.top = 0;
        visibleBox.width = this.holders.viewport.clientWidth;

        return visibleBox;
    }

    renderVisible(selectionRanges) {
        var visbleBox = {
            top: this.holders.viewport.scrollTop,
            left: this.holders.viewport.scrollLeft,
            width: this.holders.viewport.clientWidth,
            height: this.holders.viewport.clientHeight
        };
        var buffer = 100;
        var first = Math.floor(visbleBox.top / this.config.row.height) - 5;
        var last = Math.ceil((visbleBox.top + visbleBox.height) / this.config.row.height) + 5;
        if (first < 0) first = 0;
        if (last >= this.data.rows.length) last = this.data.rows.length;

        this.rowCache = this.rowCache || {};
        this.numbersCache = this.numbersCache || {};

        var range = this.helper.range(first, last);
        for (var x in this.rowCache) {
            if (x < first || x > last || this.selection.isAnyYCellSelected(x)) {
                this.holders.viewport_content.removeChild(this.rowCache[x]);
                this.holders.numbers_inner.removeChild(this.numbersCache[x]);
                delete this.rowCache[x];
                delete this.numbersCache[x];
            } else {
                for (var i = 0; i < this.rowCache[x].children.length; i++) {
                    this.rowCache[x].children[i].style.background = 'none';
                }
            }
        }
        range.forEach(n => {
            if (!this.rowCache[n]) {
                var nel = this.renderNumber(n);
                this.numbersCache[n] = nel;
                var el = this.renderRow(this.data.rows[n], n, selectionRanges);
                this.rowCache[n] = el;
            }
        });
    }

    createResizeHandle(index) {
        var handle = document.createElement('div');
        handle.className = 'handle';
        handle.style.position = 'absolute';
        handle.style.right = '0px';
        handle.style.top = '0px';
        handle.style.width = '4px';
        handle.style.height = '100%';
        handle.className = 'col-resize';

        var columns = this.data.columns;

        var offsetLeft = null;
        var initialClientX = null;
        var initalWidth = null;
        var dis = this;
        var mouseDown = function(e) {
            if (e.buttons == 1) {
                dis.holders.viewport.onscroll = null;
                offsetLeft = handle.offsetLeft;
                initialClientX = e.clientX;
                initalWidth = columns[index].width;
                document.onmousemove = mouseMove;
            }
        };

        var mouseMove = function(e) {
            var c = columns[index];
            var change = e.clientX - initialClientX;
            e.preventDefault();
            dis.data.columns[index].width = initalWidth + change;

            if (e.buttons !== 1) {
                document.onmousemove = null;
                dis.holders.viewport.onscroll = function(e) {
                    dis.onViewportScroll.apply(dis);
                };
            }
            dis.renderColumns();
            dis.rowCache = {};
            var b = dis.holders.viewport.scrollLeft;
            dis.holders.viewport_content.innerHTML = '';
            dis.renderVisible();
            console.log('b', b);
            dis.holders.viewport.scrollLeft = b;
        };
        handle.onmousedown = mouseDown;

        return handle;
    }

    renderRow(row, rowIndex, selectionRanges) {
        var rowContainer = document.createElement('div');
        rowContainer.style.top     = (rowIndex * this.config.row.height) + 'px';
        rowContainer.style.height  = this.helper.px(this.config.row.height);
        rowContainer.style['border-bottom'] = '1px solid #f0f0f0';
        rowContainer.style['position'] = 'absolute';
        rowContainer.style.width   = this.helper.px(5000);
        rowContainer.style.height  = this.config.row.height + 'px';
        var dis = this;
        row.map((value, colIndex) => {
            var column = this.getColumn(colIndex);
            var outer_div           = document.createElement('div');
            outer_div.onmousedown = function(e) {
                dis.selection.onMouseDown.apply(dis.selection, [colIndex, rowIndex, e]);
                dis.invalidateSoft();
            };
            outer_div.addEventListener("mouseenter", function(e) {
                dis.selection.onMouseEnter.apply(dis.selection, [colIndex, rowIndex, e]);
            }, false);
            outer_div.style.top     = (rowIndex * this.config.row.height) + 'px';
            outer_div.style.height  = this.helper.px(this.config.row.height);
            outer_div.style.float   = 'left';
            outer_div.style.overflow   = 'hidden';
            outer_div.style['border-right']   = '1px solid #f0f0f0';
            outer_div.style['text-align']   = 'left';
            var selected = dis.selection.isCellSelected(colIndex, rowIndex, selectionRanges);
            if (selected) {
                if (dis.selection.copy) {
                    outer_div.className = 'copyFlash';
                } else {
                    outer_div.className = '';
                }
                outer_div.style['background'] = 'rgb(210, 236, 255)';
            } else {
            }
            outer_div.style.width   = this.helper.px(this.data.columns[colIndex].width);

            var inside_div = document.createElement('div');
            inside_div.innerText = row[colIndex];
            inside_div.style['font-family'] = 'menlo';
            inside_div.style['font-weight'] = 'normal';
            inside_div.style['padding-left'] = '4px';
            inside_div.style['padding-top'] = '4px';
            inside_div.style['font-size'] = '12px';
            inside_div.style['overflow'] = 'hidden';
            inside_div.style['white-space'] = 'nowrap';

            outer_div.appendChild(inside_div);

            return outer_div;
        }).forEach(el => {
            rowContainer.appendChild(el);
        });
        var clear = document.createElement('div');
        clear.style.clear = 'both';
        rowContainer.appendChild(clear);

        this.holders.viewport_content.appendChild(rowContainer);
        return rowContainer;
    }

    createColumn(c) {
        var div = document.createElement('div');
        var e = document.createElement('div');
        e.style.position = 'relative';
        var inside = document.createElement('div');

        var handle = this.createResizeHandle(c.index);
        e.appendChild(handle);

        inside.innerText = c.label;
        inside.style['padding-left'] = this.helper.px(this.config.column.padding_left);
        inside.style['padding-top'] = this.helper.px(this.config.column.padding_top);
        inside.style['overflow'] = 'hidden';
        inside.style['white-space'] = 'nowrap';
        e.style.position = 'relative';
        e.style.float = 'left';
        this.helper.apply(e.style, this.config.column.cell.style);
        e.style.width = this.helper.px(c.width);
        e.style.height = this.helper.px(this.config.column.height);
        e.appendChild(inside);

        return e;
    }

    render() {
        this.renderColumns();
        this.holders.numbers_inner.style.height = this.helper.px(this.config.row.height * this.data.rows.length);
        this.holders.viewport_content.style.height = this.helper.px(this.config.row.height * this.data.rows.length);
        this.renderVisible();
    }
}