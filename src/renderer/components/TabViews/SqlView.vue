<template>
    <div class="sql-view-flex-container">
        <div class="sql-view-editor">
            <div style="">
                <toolbar>
                    <toolbar-item icon="play" size="14"></toolbar-item>
                    <toolbar-item icon="stop" size="12"></toolbar-item>
                </toolbar>
            </div>
            <div style="flex: 1 auto;width: 100%;height: 100%;">
                <editor v-model="value.viewstate.content"></editor>
            </div>
        </div>
        <div v-resize="{ direction: 'vertical' }" style="flex-basis: 250px;" class="sql-view-resultset" :key="value.name">
            <!--<div v-if="value.viewstate.resultsets.length > 0" style="width: 100%; height: 100%;">
                <grid v-model="value.viewstate.resultsets[0]"></grid>
            </div>-->
            <data-table></data-table>
        </div>
    </div>
</template>

<script>
import Editor from '../Editor';
import Grid from '../LeGrid/Grid';
import ResizeDirective from '../ResizeDirective';
import BlazingGrid from '../BlazingGrid';
import Toolbar from '../Toolbar';
import DataTable from '../DataTable';
import ToolbarItem from '../ToolbarItem';

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
        dataTable: DataTable,
        toolbar: Toolbar,
        toolbarItem: ToolbarItem,
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
    display: flex;
    flex-direction: column;
    flex: 1 auto;
    overflow-y: scroll;
    position: relative;
    width: 100%;
    height: 100%;
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