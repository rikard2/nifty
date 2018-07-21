<template>
    <div class="dt" ref="datatable"></div>
</template>

<script>
var nifty = require('../nifty');
export default {
    name: 'dataTable',
    props: ['value'],
    mounted() {
        var DataTable = require('./DataTable/datatable.js').DataTable;
        this.dt = new DataTable(this.$refs.datatable);
        var data = require('./DataTable/data.js').default;
        //console.log('MOUNTED', Object.keys(this.$props.value));
        this.dt.setData(this.$props.value);
        this.$root.nifty.on('resize', () => {
            this.dt.invalidate();
        });
    },
    beforeDestroy() {
        this.dt.destroy();
    },
    components: {
    },
    methods: {
    },
    watch: {
        value: function(n, o) {
            this.dt.setData(n);
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