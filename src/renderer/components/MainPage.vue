<template>
<div class="around">
  <div class="wrapper">
    <div class="treeview">Treeview</div>
    <div class="editor">
        <div class="middle">
            <div class="tabs">
                <tabs></tabs>
            </div>
            <div class="first">
                <editor></editor>
            </div>
            <div class="second">
                <grid v-model="data"></grid>
            </div>
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
import Editor from './Editor';
import Resultset from './Resultset';
import Grid from './LeGrid/Grid';
import Tabs from './Tabs';

var nifty = require('../nifty');

export default {
    name: 'main-page',
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
                    Array.apply(null, {length: 5}).map(Number.call, Number).map(i => {
                        return [i, 'Jeff Brown', 'Tomte', 'asddasdsa iadsjdklsaj adsljk ads', 'asdlhdaslk asdlk daslkjadsk ljadsk alsd']
                    })
            }
        };
    },
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
.bottom {
    display: flex;
    height: 25px;
    font-size: 14px;
    border-top: 1px solid #e0e0e0;
    padding-top: 2px;
}
.filename {
    margin-left: 5px;
}
.wrapper {
  display: flex;
  flex-flow: row wrap;
  font-weight: bold;
  text-align: center;
  height: 100%;
}
.top {
    width: 100%;
    height: 30px;
    padding: 7px;
    background: #f4f4f4;
    border-bottom: 1px solid #e0e0e0;
} {
    width: 100%;
    height: 30px;
    padding: 7px;
    background: #f4f4f4;
    border-bottom: 1px solid #e0e0e0;
}
.treeview {
    width: 275px;
    background: #f4f4f4;
    border-right: 1px solid #e0e0e0;
}
.editor {
    flex: 3 auto;
}
.middle {
    display: flex;
    flex-flow: column;
    height: 100%;
}
.tabs {
    height: 40px;
}
.first {
    position: relative;
    flex: 1 auto;
    background: blue;
}
.second {
    height: 250px;
}
</style>