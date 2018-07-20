<template>
<div class="around">
<!--
    <dipv class="tool-bar">
        <toolbar>
            <toolbar-item icon="file" size="20" top="7"></toolbar-item>
            <toolbar-item icon="cogwheel" size="20" top="6"></toolbar-item>
        </toolbar>
    </div>
-->
    <div class="main-wrapper">
        <div class="left-side" style="flex-basis: 275px;" v-resize="{ direction: 'horizontal' }">
            <tree-view></tree-view>
        </div>
        <div class="main-side">
            <div class="main-tabs">
                <tabs></tabs>
            </div>
            <div class="main-tab-view" :key="$store.state.tabs[$store.state.activeTab.index].name">
                <div v-if="$store.state.tabs[$store.state.activeTab.index].type == 'sql'" class="fill">
                    <sqlview index="" v-model="$store.state.tabs[$store.state.activeTab.index]"></sqlview>
                </div>
                <div v-if="$store.state.tabs[$store.state.activeTab.index].type == 'settings'" class="fill">
                    <settingsview></settingsview>
                </div>
            </div>
        </div>
    </div>
    <div class="status-bar">
        <div class="filename">{{ $store.state.filename }}</div>
    </div>
</div>
</template>

<script>
import TreeView from './TreeView';
import Resultset from './Resultset';
import Grid from './LeGrid/Grid';
import Editor from './Editor';
import SqlView from './TabViews/SqlView';
import SettingsView from './TabViews/SettingsView';
import Tabs from './Tabs';
import ResizeDirective from './ResizeDirective';
import Toolbar from './Toolbar';
import ToolbarItem from './ToolbarItem';

var nifty = require('../nifty');

export default {
    name: 'main-page',
    mounted: function() {
        var dis = this;
        this.$root.nifty.on('execute-query', function() {

        });
        this.$root.nifty.on('new', function() {
            dis.$store.state.tabs.push({
                name: 'Untitled',
                type: 'settings'
            });
        });
    },
    directives: {
        resize: ResizeDirective
    },
    components: {
        editor: Editor,
        sqlview: SqlView,
        settingsview: SettingsView,
        treeView: TreeView,
        resultset: Resultset,
        grid: Grid,
        tabs: Tabs,
        toolbar: Toolbar,
        toolbarItem: ToolbarItem
    },
    methods: {
        fill: function() {
        }
    }
}
</script>

<style>
  @import url('https://fonts.googleapis.com/css?family=Source+Sans+Pro');

  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }
  html { height: 100%;}
  body { font-family: 'Source Sans Pro', sans-serif; height: 100%; }

.fill { width: 100%; height: 100%; }
.around {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
}
.main-wrapper {
    flex: 1 auto;
    display: flex;
    flex-flow: row;
    font-weight: bold;
    text-align: center;
    height: 100%;
}
.left-side {
    background: #f4f4f4;
    border-right: 1px solid #e0e0e0;
    flex-grow: 0;
    flex-shrink: 0;
}
.main-side {
    flex: 1 auto;
    display: flex;
    flex-direction: column;
}
.flex-container {
    display: flex;
    flex-flow: column;
    height: 100%;
    width: 100%;
}
.main-content {
    position: relative;
    flex: 2 auto;
    height: 100%;
    border: 1px solid red;
}
.main-tab {
    height: 30px;
    background: green;
}
.main-tab-view {
    height: 100%;
    flex: 1 auto;
}
.filename {
    margin-left: 5px;
}
.tool-bar {
    font-family: 'system-ui';
    font-size: 12px;
    border-bottom: 1px solid #e0e0e0;
    padding-top: 3px;
}
.status-bar {
    font-family: 'system-ui';
    font-size: 12px;
    height: 28px;
    border-top: 1px solid #e0e0e0;
    padding-top: 5px;
    padding-left: 2px;
}
</style>