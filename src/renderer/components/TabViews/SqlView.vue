<template>
    <div class="sql-view-flex-container">
        <div class="sql-view-editor">
            <!-- <editor v-model="value.viewstate.content"></editor> -->
        </div>
        <div v-resize="{ direction: 'vertical' }" style="flex-basis: 350px;" class="sql-view-resultset" :key="value.name">
            <div v-if="value.viewstate.resultsets.length > 0" style="width: 100%; height: 100%;">
                <grid v-model="value.viewstate.resultsets[0]"></grid>
            </div>
        </div>
    </div>
</template>

<script>
import Editor from '../Editor';
import Grid from '../LeGrid/Grid';
import ResizeDirective from '../ResizeDirective';
import BlazingGrid from '../BlazingGrid';

export default {
    name: 'sqlview',
    props: ['value'],
    directives: {
        resize: ResizeDirective
    },
    data() {
        return {
            filename: this.$store.state.filename
        };
    },
    components: {
        editor: Editor,
        grid: Grid,
        blazingGrid: BlazingGrid
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
.sql-view-resultset::-webkit-scrollbar {
    display: none;
}
.sql-view-resultset {
    flex-grow: 0;
    flex-shrink: 0;
    overflow: hidden;
}
</style>