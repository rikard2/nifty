<template>
    <li @click="openFile()">
        <img v-if="open" :class="{ hide: !isFolder}" style="float: left; margin-right: 5px; margin-top: 3px;" id="logo" width="12" height="12" :src="require(`@/assets/icons/arrow_down.svg`)">
        <img v-if="!open" :class="{ hide: !isFolder}" style="float: left; margin-right: 5px; margin-top: 3px;" id="logo" width="12" height="12" :src="require(`@/assets/icons/arrow_right.svg`)">
        <img v-if="isFolder" style="float: left; margin-right: 5px; margin-top: 3px;" id="logo" width="12" height="12" :src="require(`@/assets/icons/folder.svg`)">
        <img v-if="!isFolder" style="float: left; margin-right: 5px; margin-top: 3px;" id="logo" width="12" height="12" :src="require(`@/assets/icons/treeview_file.svg`)">
        <div
        style="overflow: hidden; font-weight: normal;height: 20px; cursor: default;"
        :class="{folder: isFolder, file: !isFolder }"
        @click="toggle"
        @dblclick="changeType">
        {{ model.name }}
    </div>
    <ul v-show="open" v-if="open && isFolder">
        <tree-view-item
        class="item"
        v-for="(model, index) in this.children"
        :key="index"
        :model="model">
    </tree-view-item>
</ul>
</li>
</template>

<script>
import TreeViewItem from './TreeviewItem';
export default {
    name: 'treeViewItem',
    props: {
        model: Object
    },
    components: {
        treeViewItem: TreeViewItem
    },
    data: function() {
        return {
            open: false
        };
    },
    computed: {
        children: function() {
            var sortfnc = function(a, b) {
                if (a.children && b.children) {
                    return a.name > b.name ? 1 : -1
                }
                else if (a.children && !b.children) {
                    return -1;
                }
                else if (!a.children && b.children) {
                    return 1;
                } else {
                    return a.name > b.name ? 1 : -1;
                }
            };
            return this.model.children.concat().sort(sortfnc);
        },
        isFolder: function() {
            return this.model.children && this.model.children.length
        }
    },
    components: {
    },
    methods: {
        toggle: function () {
            if (this.isFolder) {
                this.open = !this.open
            }
        },
        changeType: function () {
            if (!this.isFolder) {
                Vue.set(this.model, 'children', [])
                this.addChild()
                this.open = true
            }
        },
        addChild: function () {
            this.model.children.push({
                name: 'new stuff'
            })
        },
        openFile() {
            var state = this.$store.state;
            if (!this.model.children) {
                var path = this.model.path;
                var fs = require('fs');

                fs.readFile(path, 'utf8', function(err, contents) {
                    if (!err) {
                        var filename = path.replace(/^.*[\\\/]/, '');
                        var key = state.newTab({
                            name: filename,
                            path: path,
                            viewstate: {
                                content: contents,
                                selected: -1,
                                executing: false,
                                result: {
                                    hide: true,
                                    resultsets: []
                                }
                            }
                        });
                        state.selectTab(key);
                    }
                });
            }
        }
    }
}
</script>
<style>
li.item {
    margin-left: 10px;
}
ul {
    list-style: none;
}

.hide {
    background: red;
    opacity: 0;
}
.file {
}
.folder {

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
