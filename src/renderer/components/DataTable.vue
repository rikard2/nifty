<template>
    <div class="dt" ref="datatable"></div>
</template>

<script>
export default {
    name: 'dataTable',
    mounted() {
        var DataTable = require('./DataTable/datatable.js').DataTable;
        var dt = new DataTable(this.$refs.datatable);
        var data = require('./DataTable/data.js').default;
        dt.setData(data.one);
        dt.render();
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