<template>
    <div>
        <data-table v-model="value"></data-table>
    </div>
</template>

<script>
import DataTable from '../DataTable';
export default {
    name: 'Lookup',
    props: ['value'],
    components: {
        dataTable: DataTable
    },
    beforeMount() {
        console.log('Lookup BEFORE mount?');
    },
    methods: {
    }
}
</script>

<style scoped>
</style>