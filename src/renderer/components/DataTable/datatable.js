export class DataTable {
    config = require('./config.js').default
    helper = require('./helper.js').default

    constructor(rootElement) {
        this.rootElement = rootElement;
        this.holders = this.createHolders()
        this.rootElement.append(this.holders.outerContainer);
    }

    setData(data) {
        this.data = data;
    }

    createHolders() {
        var holders = {};
        holders.outerContainer = document.createElement('div')
        holders.outerContainer.style.width = holders.outerContainer.style.height = '100%';
        holders.outerContainer.style.padding = '5px';

        holders.innerContainer = document.createElement('div')
        holders.innerContainer.style.display = 'flex';
        holders.innerContainer.style['flex-direction'] = 'column';
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
        holders.columns_inner.style['width'] = '100%';
        holders.columns_inner.style['height'] = '100%';
        holders.columns.appendChild(holders.columns_inner);

        holders.innerContainer.appendChild(holders.columns);

        holders.belowcolumns = document.createElement('div')
        holders.belowcolumns.style.flex = '1 auto';
        holders.belowcolumns.style.display = 'flex';
        holders.belowcolumns.style['flex-direction'] = 'row';
        holders.belowcolumns.style['margin-top'] = this.helper.px(this.config.numbers.distance)
        holders.belowcolumns.style.height = '100%';
        //holders.belowcolumns.style.border = '1px solid red';
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
        holders.numbers_inner.style.position = 'absolute';
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
        holders.viewport_content.style.height = '5000px';
        holders.viewport_content.style.width = '2000px';

        holders.viewport.appendChild(holders.viewport_content);

        var dis = this;
        holders.viewport.onscroll = function(e) {
            dis.onViewportScroll.apply(dis, e);
        };
        holders.belowcolumns.appendChild(holders.viewport);

        return holders;
    }

    renderColumns() {
        this.data.columns.forEach(c => {
            var el = this.createColumn(c);

            this.holders.columns_inner.appendChild(el);
        });
    }

    getColumn(n) {
        return this.data.columns[n];
    }

    onViewportScroll(e) {
        this.holders.columns_inner.style.left = this.helper.px(this.holders.viewport.scrollLeft * -1);
        this.holders.numbers_inner.style.top = this.helper.px(this.holders.viewport.scrollTop * -1);
        //this.$refs.columns.childNodes[0].style.left = this.px(this.$refs.viewport.scrollLeft * -1);
    }

    renderNumber(rowIndex) {
        var rowContainer = document.createElement('div');
        rowContainer.style.top     = (rowIndex * this.config.row.height) + 'px';
        rowContainer.style.height  = this.helper.px(this.config.row.height);
        rowContainer.style['border-bottom'] = '1px solid #f0f0f0';

        var inside_div = document.createElement('div');
        inside_div.innerText = rowIndex + 1;
        inside_div.style['text-align'] = 'left';
        inside_div.style['font-family'] = 'helvetica';
        inside_div.style['font-weight'] = 'normal';
        inside_div.style['padding-left'] = '6px';
        inside_div.style['padding-top'] = '4px';
        inside_div.style['color'] = 'rgb(160, 160, 160)';
        inside_div.style['font-size'] = '12px';

        rowContainer.appendChild(inside_div);

        this.holders.numbers_inner.appendChild(rowContainer);
    }
    renderRow(row, rowIndex) {
        var rowContainer = document.createElement('div');
        rowContainer.className     = 'grid-column';
        rowContainer.style.top     = (rowIndex * this.config.row.height) + 'px';
        rowContainer.style.height  = this.helper.px(this.config.row.height);
        rowContainer.style['border-bottom'] = '1px solid #f0f0f0';
        //this.status(this.getTotalWidth());
        rowContainer.style.width   = this.helper.px(2000);
        rowContainer.style.height  = this.config.row.height + 'px';

        row.map((value, colIndex) => {
            var column = this.getColumn(colIndex);
            var outer_div           = document.createElement('div');
            //outer_div.className     = column.class;
            outer_div.style.top     = (rowIndex * this.config.row.height) + 'px';
            outer_div.style.height  = this.helper.px(this.config.row.height);
            outer_div.style.float   = 'left';
            outer_div.style.overflow   = 'hidden';
            outer_div.style['border-right']   = '1px solid #f0f0f0';
            outer_div.style['text-align']   = 'left';
            outer_div.style.width   = this.helper.px(column.width);

            var inside_div = document.createElement('div');
            inside_div.innerText = row[colIndex];
            inside_div.style['font-family'] = 'helvetica';
            inside_div.style['font-weight'] = 'normal';
            inside_div.style['padding-left'] = '4px';
            inside_div.style['padding-top'] = '4px';
            inside_div.style['font-size'] = '12px';

            outer_div.appendChild(inside_div);

            return outer_div;
        }).forEach(el => {
            rowContainer.appendChild(el);
        });
        var clear = document.createElement('div');
        clear.style.clear = 'both';
        rowContainer.appendChild(clear);

        this.holders.viewport_content.appendChild(rowContainer);
    }

    createColumn(c) {
        var div = document.createElement('div');
        var e = document.createElement('div');
        var inside = document.createElement('div');

        inside.innerText = c.label;
        inside.style['padding-left'] = this.helper.px(this.config.column.padding_left);
        inside.style['padding-top'] = this.helper.px(this.config.column.padding_top);
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
        this.data.rows.forEach((row, rowIndex) => {
            this.renderNumber(rowIndex);
            this.renderRow(row, rowIndex);
        })
    }
}