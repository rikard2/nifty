<template>
<div class="around">
  <div class="wrapper">
    <div class="treeview">Treeview</div>
    <div class="editor">
        <div class="middle">
            <div class="first">
                <editor></editor>
            </div>
            <div class="second">
                second
            </div>
        </div>
    </div>
  </div>
  <div class="bottom">{{ filename }}</div>
  </div>
</template>

<script>
import TreeView from './TreeView';
import Editor from './Editor';

export default {
    name: 'main-page',
    data() {
        return {
            filename: '/var/log/hej.sql'
        };
    },
    components: {
        editor: Editor,
        treeView: TreeView
    },
    methods: {
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
    width: 200px;
    background: #f4f4f4;
    border-right: 1px solid #e0e0e0;
}
.editor {
    flex: 3 auto;
    background: red;
}
.middle {
    display: flex;
    flex-flow: column;
    height: 100%;
}
.first {
    position: relative;
    flex: 1 auto;
    background: blue;
}
.second {
    height: 150px;
    background: yellow;
}
</style>