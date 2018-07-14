<template>
    <div class="sql-view-flex-container">
        <div class="sql-view-editor">
            <editor></editor>
        </div>
        <div class="sql-view-resultset">
            <grid v-model="data"></grid>
        </div>
    </div>
</template>

<script>
import Editor from '../Editor';
import Grid from '../LeGrid/Grid';

export default {
    name: 'sqlview',
    data() {
        return {
            filename: this.$store.state.filename,
            data: {
                columns: [
                    {
                        label: 'Nr',
                        width: 60
                    },
                    {
                        label: 'First Name',
                        width: 200
                    },
                    {
                        label: 'Last Name',
                        width: 200
                    },
                    {
                        label: 'Mark zuckerberg is a bitch',
                        width: 200
                    },
                    {
                        label: 'Weeeeeeeeeoooo',
                        width: 200
                    }
                ],
                rows:
                    Array.apply(null, {length: 10}).map(Number.call, Number).map(i => {
                        return [i, 'Jeff Brown', 'Tomte', 'asddasdsa iadsjdklsaj adsljk ads', 'asdlhdaslk asdlk daslkjadsk ljadsk alsd']
                    })
            }
        };
    },
    components: {
        editor: Editor,
        grid: Grid
    },
    methods: {
    }
}
</script>

<style>
.sql-view-flex-container {
    height: 100%;
    width: 100%;
    flex-direction: column;
    display: flex;
}
.sql-view-editor {
    flex: 1 auto;
    position: relative;
}
.sql-view-resultset {
    height: 150px;
}
</style>