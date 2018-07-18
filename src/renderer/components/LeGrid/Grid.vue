<script>
var nifty = require('../../nifty');
var elementResizeEvent = require('element-resize-event');

export default {
    name: 'grid',
    props: ['value'],
    template: `
        <div style="width: 100%;height: 100%;">
            <div class="container" ref="container">
                <div class="status" ref="status"></div>
                <div class="columns" ref="columns">
                    <div class="cols"></div>
                </div>
                <div @onscroll="onscroll()" ref="viewport" class="viewport">
                    <div ref="scroll" class="scroll">
                    </div>
                </div>
            </div>
        </div>
    `,
    data: function() {
        return {
            debug: false,
            show_row_number: true,
            status_height: 25,
            scroll_timer: -1,

            container_max_height: 450,
            column_height: 23,
            column_padding_top: 4,
            column_padding_left: 5,

            row_height: 23,
            row_padding_top: 4,
            row_padding_left: 5,
            total_row_height: null,
            visible_box: {}
        }
    },
    created: function() {},
    update: function() {},
    mounted: function() {
        console.log('mounted');
        var dis = this;
        nifty.commands.listen('resize', () => {
            this.resize.apply(dis);
        });
        this.resize.apply(dis);
    },
    methods: {
        resize(dis) {
            var subtract = 0;
            var actualHeight = this.$refs.container.offsetHeight;
            var containerHeight = this.value.rows.length * this.row_height + this.column_height + 10;
            if (containerHeight > this.container_max_height) containerHeight = this.container_max_height;

            nifty.commands.listen('execute-query', () => {
                dis.$store.state.filename = 'men LOOL';
            });
            if (this.debug) {
                this.$refs.status.style.height = this.px(this.status_height);
                subtract += this.status_height;
            } else {
                this.$refs.status.style.display = 'none';
            }
            var containerSize = this.getContainerSize();

            var columns = this.renderColumns();
            subtract += this.column_height;
            this.$refs.columns.style.height = this.px(this.column_height);


            this.$refs.columns.style.width = this.px(containerSize.width);
            this.$refs.viewport.style.height = this.px(containerSize.height - subtract);
            this.$refs.viewport.style.width = '100%';
            var vs = this.getViewPortSize();

            this.$refs.scroll.style.height = this.total_row_size + 'px';
            this.$refs.viewport.addEventListener('scroll', this.onScroll);

            this.visible_box.width = vs.width;
            this.visible_box.height = vs.height;
            this.visible_box.top = 0;
            this.visible_box.left = 0;
            //this.status(this.visible_box);
            this.render();
        },
        status(o) {
            var s;
            if (typeof(o) === 'object' || typeof(o) === 'array') {
                s = JSON.stringify(o);
            } else {
                s = (o || '?').toString();
            }
            this.$refs.status.innerHTML = s;
        },
        onScrollOver(s) {
            // Now when scrolling is over, we need to check
            // what is visible inside the viewport and
            // render what can't be seen
            this.visible_box.top = this.$refs.viewport.scrollTop;
            var range = this.getVisibleRange();
            this.render(range);
        },
        onScroll(s) {
            this.$refs.columns.childNodes[0].style.left = this.px(this.$refs.viewport.scrollLeft * -1);
            this.status(this.$refs.viewport.scrollLeft);
            this.onScrollOver();
            //if (this.scroll_timer != -1) clearTimeout(this.scroll_timer);
            //this.scroll_timer = setTimeout(this.onScrollOver, 100);
        },
        getVisibleRange() {
            var buffer = 2;
            var arr = [];
            var first = Math.floor(this.visible_box.top / this.row_height);
            var last = Math.ceil((this.visible_box.top + this.visible_box.height) / this.row_height);
            arr = [first, last];
            arr.push(first - 1);
            arr.push(last + 1);
            arr.push(first - 2);
            arr.push(last + 2);
            if (first < 0) first = 0;
            if (last >= this.value.rows.length) last = this.value.rows.length;
            //this.status([first, last]);
            //return this.range(first, last);
            return this.range(first - 2, last + 2);
        },
        getContainerSize() {
            //var rect = this.$refs.container.getBoundingClientRect();
            return {
                width: this.$refs.container.clientWidth,
                height: this.$refs.container.clientHeight
            };
        },
        getTotalWidth() {
            var width = 0;
            this.getColumns().forEach(c => {
                width += c.width;
            });
            return width;
        },
        getViewPortSize(dis) {
            var rect = (this || dis).$refs.viewport.getBoundingClientRect();
            return {
                width: rect.width,
                height: rect.height
            };
        },
        render(range) {
            var scroll = this.$refs.scroll;
            scroll.innerHTML = '';
            scroll.style.width = this.px(200);
            scroll.style.height = (this.row_height * this.value.rows.length) + 'px';
            var renderRows = range || this.range(0, 25);
            renderRows.forEach(ix => {
                //var c = document.createE
                var r = this.value.rows[ix];
                if (r) {
                    scroll.appendChild(this.renderRow(r, ix));
                }
            });
        },
        getColumn(i) {
            return Object.assign(
                {
                    show_border: true,
                    font_size: 12,
                    class: 'grid-column-cell'
                },
                (this.getColumns())[i]
            );
        },
        getColumns() {
            if (this.show_row_number) {
                return [ { label: '', width: 40, class: 'grid-column-cell grid-column-cell-row-number', show_border: false } ].concat(this.value.columns);
            } else {
                return this.value.columns;
            }
        },
        renderColumns() {
            this.$refs.columns.innerHTML = '';
            this.$refs.columns.style.position = 'relative';
            this.$refs.columns.style['border-bottom'] = '1px solid #e0e0e0';
            this.$refs.columns.style['border-top'] = '1px solid #e0e0e0';
            this.$refs.columns.style.overflow = 'hidden';
            this.$refs.columns.style.background = '#fafafa';
            this.$refs.columns.style.height = this.px(this.column_height - 3);
            var ci = document.createElement('div');
            ci.style.position = 'absolute';
            ci.style.width = this.px(this.getTotalWidth());
            var columns = this.getColumns().map(x => {
                var e = document.createElement('div');
                var inside = document.createElement('div');
                inside.innerText = x.label;
                inside.style['padding-left'] = this.px(this.column_padding_left);
                inside.style['padding-top'] = this.px(this.column_padding_top);

                e.style.float = 'left';
                e.style['font-family'] = 'menlo';
                e.style['font-size'] = '12px';
                e.style['text-align'] = 'left';
                e.style['overflow'] = 'hidden';
                e.style['border-right'] = '1px solid #dbdbbc';
                e.style['border-bottom'] = '1px solid #dbdbdb';
                e.style.width = this.px(x.width);
                e.style.height = this.px(this.column_height);
                e.appendChild(inside);
                return e;
            }).forEach(x => {
                ci.appendChild(x);
            });
            this.$refs.columns.appendChild(ci);
        },
        renderRow(r, ix) {
            var column_row_div = document.createElement('div');
            column_row_div.innerText     = '';
            column_row_div.className     = 'grid-column';
            column_row_div.style.top     = (ix * this.row_height) + 'px';
            column_row_div.style.height  = this.px(this.row_height);
            //this.status(this.getTotalWidth());
            column_row_div.style.width   = this.px(this.getTotalWidth());
            column_row_div.style.height  = this.row_height + 'px';

            (this.show_row_number ? [ ix + 1 ].concat(r) : r).map((x, ix) => {
                var column = this.getColumn(ix);
                var outer_div           = document.createElement('div');
                outer_div.className     = column.class;
                outer_div.style.height  = this.px(this.row_height);
                outer_div.style.float   = 'left';
                outer_div.style.width   = this.px(column.width); // dont forget the padding

                var inside_div = document.createElement('div');
                inside_div.innerText = x;
                inside_div.className = 'grid-column-cell-inside';

                outer_div.appendChild(inside_div);

                return outer_div;
            }).forEach(outer_div => {
                column_row_div.appendChild(outer_div);
            });
            var clear = document.createElement('div');
            clear.style.clear = 'both';
            column_row_div.appendChild(clear);

            return column_row_div;
        },
        range(offset, n) { return Array.apply(null, {length: (n - offset)}).map(Number.call, Number).map(i => { return i + offset }) },
        px(n) { return n + 'px' },
        getColumnWidth(ix) { return (this.getColumns())[ix].width }
    }
}
</script>
<style>
.grid-column {
    font-weight: normal;
    position: absolute;
    overflow-y: hidden;
}
.grid-column-cell {
    text-align: left;
    float: left;
    border-bottom: 1px solid #e0e0e0;
    border-right: 1px solid #e0e0e0;
    font-weight: 100;
    font-size: 12px;
    white-space: nowrap;
    overflow: hidden;
}
.grid-column-cell-row-number {
    background: rgb(250, 250, 250);
    font-size: 11px;
    color: #a9a9a9;
    border-bottom: none !important;
}
.grid-column-cell-row-number .grid-column-cell-inside {
    padding-top: 6px;
    padding-left: 5px;
}
.grid-column-cell-inside {
    padding-top: 4px;
    padding-left: 5px;
}
</style>
<style scoped>
    ::-webkit-scrollbar {
        -webkit-appearance: none;
        width: 5px;
        height: 5px;
    }

    ::-webkit-scrollbar-thumb {
        border-radius: 2px;
        background-color: rgba(12, 38, 63,.7);
        -webkit-box-shadow: 0 0 0.5px rgba(255,255,255, .5);
    }
    .container {
        width: 100%;
        height: 100%;
        padding: 0;
        overflow-y: scroll;
        /*border: 1px solid green;*/
    }
    .viewport {
        overflow: scroll;
        font-family: menlo;
        font-size: 12px;
    }
    .scroll {
        position: relative;
    }
    .row_number {
        font-size: 10px;
        border-bottom: none;
    }
    .status {
        height: 10%;
        border: 1px solid blue;
    }
</style>