<template>
    <div class="dt" ref="datatable"></div>
</template>

<script>
var nifty = require('../nifty');
export default {
    name: 'dataTable',
    mounted() {
        var DataTable = require('./DataTable/datatable.js').DataTable;
        var dt = new DataTable(this.$refs.datatable);
        var data = require('./DataTable/data.js').default;
        dt.setData(data.one);
        dt.render();
        this.$root.nifty.on('resize', () => {
            dt.invalidate();
        });
    },
    components: {
    },
    methods: {
    }
}
</script>

<style scoped>
    .dt {
        width: 100%;
        height: 100%;
    }
</style>