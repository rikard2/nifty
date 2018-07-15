<template>
    <div class="sql-view-flex-container">
        <div class="sql-view-editor">
            <editor v-model="value.viewstate.content"></editor>
        </div>
        <div class="sql-view-resultset" :key="value.name">
            <div v-for="(r, index) in value.viewstate.resultsets">
                <grid v-model="value.viewstate.resultsets[index]"></grid>
            </div>
        </div>
    </div>
</template>

<script>
import Editor from '../Editor';
import Grid from '../LeGrid/Grid';

export default {
    name: 'sqlview',
    props: ['value'],
    data() {
        return {
            filename: this.$store.state.filename
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
.fill {
    height: 100%;
    width: 100%;
}
.sql-view-flex-container {
    height: 100%;
    width: 100%;
    flex-direction: column;
    display: flex;
}
.sql-view-editor {
    flex: 1 auto;
    overflow-y: scroll;
    position: relative;
}
.sql-view-resultset {
    height: 250px;
    overflow-y: scroll;
}
</style>