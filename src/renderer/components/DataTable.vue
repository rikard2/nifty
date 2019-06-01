<template>
    <div class="dt" ref="datatable"></div>
</template>

<script>
var nifty = require('../nifty');
export default {
    name: 'dataTable',
    props: ['value'],
    events: ['onescape'],
    mounted() {
        var dis = this;

        var DataTable = require('./DataTable/datatable.js').DataTable;
        var dt = new DataTable(this.$refs.datatable);
        this.dt = dt;
        dt.onFocus = function() {
            window.nifty.setActiveDataTable(dt);
        };
        dt.onFocus();
        var data = require('./DataTable/data.js').default;
        //console.log('MOUNTED', Object.keys(this.$props.value));
        this.dt.setData(this.$props.value);
        this.dt.escape = function() {
            dis.$emit('onescape');
            if (dis.$root.nifty) {
                dis.$root.nifty.activeEditor.focus();
            }
        };
        if (this.$root.nifty) {
            this.$root.nifty.on('resize', () => {
                this.dt.invalidate();
            });
        }
    },
    beforeDestroy() {
        window.nifty.removeDataTable(this.dt);
        this.dt.destroy();
    },
    components: {
    },
    methods: {
    },
    watch: {
        value: function(n, o) {
            window.nifty.setActiveDataTable(this.dt);
            this.dt.setData(n);
            //this.dt.focus();
        }
    }
}
</script>

<style scoped>
    .dt {
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
    }
</style>
