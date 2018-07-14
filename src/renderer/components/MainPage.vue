<template>
<div class="around">
    <div class="main-wrapper">
        <div class="left-side">
        </div>
        <div class="main-side">
            <div class="main-tabs">
                <tabs></tabs>
            </div>
            <div class="main-tab-view">
                <sqlview></sqlview>
            </div>
        </div>
    </div>
    <div class="bottom">
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
import Tabs from './Tabs';

var nifty = require('../nifty');

export default {
    name: 'main-page',
    mounted: function() {
        var dis = this;
        nifty.commands.listen('execute-query', function() {

        });
        nifty.commands.listen('new', function() {
            dis.$store.state.tabs.push({
                name: 'Untitled'
            });
        });
    },
    components: {
        editor: Editor,
        sqlview: SqlView,
        treeView: TreeView,
        resultset: Resultset,
        grid: Grid,
        tabs: Tabs
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
    width: 275px;
    background: #f4f4f4;
    border-right: 1px solid #e0e0e0;
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
    flex: 1 auto;
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
</style>