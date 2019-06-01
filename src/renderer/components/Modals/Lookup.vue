<template>
    <div style="height: 400px;">
        <data-table v-model="value" v-on:onescape="onEscape"></data-table>
    </div>
</template>

<script>
import DataTable from '../DataTable';
export default {
    name: 'Lookup',
    events: ['onescape'],
    props: ['value'],
    components: {
        dataTable: DataTable
    },
    beforeMount() {
        console.log('Lookup BEFORE mount?');
    },
    methods: {
        onEscape: function() {
            this.$emit('onescape');
        }
    }
}
</script>

<style scoped>
</style>
