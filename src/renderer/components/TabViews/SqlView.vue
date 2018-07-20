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
        <div v-if="value.viewstate.result" v-resize="{ direction: 'vertical' }" style="flex-basis: 250px; display:flex; flex-direction: column" class="sql-view-resultset" :key="value.name">
            <div class="resultset-tab">
                <ul v-for="(r, i) in value.viewstate.result.resultsets">
                    <li @click="tabClick(i)" :class="{ active: i == value.viewstate.result.selected }">{{ r.label }}</li>
                </ul>
            </div>
            <div style="flex: 1 auto;position: relative;" v-if="value.viewstate.result.resultsets[value.viewstate.result.selected].resultset">
                <data-table v-model="value.viewstate.result.resultsets[value.viewstate.result.selected]"></data-table>
            </div>
            <div style="flex: 1 auto;position: relative;" v-else="value.viewstate.result.resultsets[value.viewstate.result.selected].resultset">
                <div v-for="m in value.viewstate.result.resultsets[value.viewstate.result.selected].messages" class="messages">
                    <pre class="statusmessage">
                        <span class="runtime_instant">instant</span>
                        <span class="message">{{ m.text }}</span>
                    </pre>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
var nifty = require('../../nifty');
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
    mounted() {
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
        tabClick: function(i) {
            this.$props.value.viewstate.result.selected = i;
        }
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
.statusmessage {
    border-top-left-radius: 0px;
    border-radius: 0px;
    padding: 0px;
    vertical-align: middle;
    margin-bottom: 2px;
    font-size: 12px;
    display: flex;
}
.runtime_instant {
    border-right: #1f96ff;
    background: #ebebeb;
    color: #fff;
    letter-spacing: 0px;
    font-size: 10px;
    vertical-align: middle;
    padding-left: 5px;
    padding-top: 8px;
    padding-bottom: 8px;
    display: inline-flex;
    min-width: 58px;
    margin-right: 5px;
}
.message {
    margin-right: 80px;
    display: inline-flex;
    margin-top: 7px;
}
.messages {
    padding: 10px;
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
.resultset-tab {
    background: #f3f3f3;
    flex-grow: 0;
    flex-shrink: 0;
    flex-basis: 30px;
}
.resultset-tab ul {
    list-style: none;
    font-weight: normal;
}
.resultset-tab ul li {
    float: left;
    cursor: pointer;
    padding-left: 10px;
    padding-right: 10px;
    height: 35px;
    padding-top: 7px;
    border-bottom: 1px solid #e0e0e0;
    border-right: 1px solid #e0e0e0;
}
.resultset-tab ul li.active {
    background: #fff;
    border-bottom: none;
}
</style>