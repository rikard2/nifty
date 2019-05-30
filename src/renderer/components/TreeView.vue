<template>
    <div class="tree-view" style="overflow-x: hidden; overflow-y: scroll">
        <ul id="demo">
          <tree-view-item v-for="(model, index) in this.folders"
            class="item"
            :model="model.tree">
          </tree-view-item>
        </ul>
    </div>
</template>

<script>
import TreeViewItem from './TreeviewItem';

export default {
    name: 'tree-view',
    data() {
        return {
            folders: this.$store.state.folders
        }
    },
    components: {
        treeViewItem: TreeViewItem
    },
    methods: {
    }
}
</script>
<style scoped>
    .tree-view {
        font-size: 14px;
        text-align: left;
        padding: 5px;
        padding-left: 10px;
        width: 100%;
        height: 100%;
        font-family: "Source Sans Pro";
        font-size: 15px;
    }
    ul {
      list-style: none;
    }

    ul li:before{
       content: '';
       position: absolute;
       border-right:2px solid black;
       border-bottom:2px solid black;
       width:10px;
       height:10px;
       top: calc(50% - 4px);
       left: -20px;
       transform: translateY(-50%) rotate(-45deg);
    }
</style>
