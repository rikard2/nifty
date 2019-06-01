<template>
    <div class="sql-view-flex-container">
        <div class="sql-view-editor">
            <div>
                <toolbar>
                    <toolbar-item icon="play" command="execute-query" size="12" :disabled="query && query.executing"></toolbar-item>
                    <toolbar-item icon="stop" command="stop-query" size="10" :disabled="!query || !query.executing"></toolbar-item>
                </toolbar>
            </div>
            <div style="flex: 1 auto;width: 100%;height: 100%;">
                <editor :content="value.viewstate.content" v-on:change="editorchange" v-on:selection="selectionchange"></editor>
            </div>
        </div>
        <div v-if="query && !query.result.hide" v-resize="{ direction: 'vertical' }" style="flex-basis: 250px; display:flex; flex-direction: column" class="sql-view-resultset" :key="value.name">
            <div v-if="query.executing" style="font-size: 12px;margin-top: 30px;font-weight: normal;">
                Loading...
            </div>
            <div class="resultset-tab" v-if="!query.executing && Object.keys(query.result.resultsets).length > 0">
                <ul v-for="(key, i) in Object.keys(query.result.resultsets)">
                    <li @click="tabClick(key)" :class="{ active: key == query.result.selectedResultsetKey }">{{ query.result.resultsets[key].label }}</li>
                </ul>
            </div>
            <div style="flex: 1 auto;position: relative;" v-if="query.result.selectedResultsetKey && query.result.resultsets[query.result.selectedResultsetKey] && !query.result.resultsets[query.result.selectedResultsetKey].notices">
                <data-table v-model="query.result.resultsets[query.result.selectedResultsetKey]"></data-table>
            </div>
            <div style="flex: 1 auto;position: relative;overflow: scroll;margin-bottom: 10px;" v-if="query.result.resultsets[query.result.selectedResultsetKey] && query.result.resultsets[query.result.selectedResultsetKey].notices">
                <div v-for="n in query.result.resultsets[query.result.selectedResultsetKey].notices" class="messages">
                    <pre class="statusmessage">
                        <span class="runtime_instant">{{ n.severity }}</span>
                        <span class="message">{{ n.text || n.count }}</span>
                    </pre>
                </div>
            </div>
            <div style="flex: 1 auto;position: relative;" v-if="query.error">
                <pre class="errormessage">{{query.error }}</pre>
            </div>
            <div class="resultset-toolbar" v-if="!query.executing">
                <div class="sql-view-status">
                    <div v-if="!query.error">
                        <img style="float: left;padding-top: 3px;height: 16px;width: 16px;" :width="24" :height="24" ref="logo" :src="require(`@/assets/icons/checked.svg`)" alt="electron-vue">
                        <div class="msg">{{ query.msg }}</div>
                        <div style="clear:both"></div>
                    </div>
                    <div v-if="query.error">
                        <img style="float: left;padding-top: 3px;height: 16px;width: 16px;" :width="24" :height="24" ref="logo" :src="require(`@/assets/icons/error.svg`)" alt="electron-vue">
                        <div class="msg">{{ query.msg }}</div>
                        <div style="clear:both"></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
var nifty = require('../../nifty');
import Vue from 'vue'
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
    events: ['editorchange'],
    computed: {
        viewstate: function() {
            return this.$store.state.tab[this.$store.state.selectedTabKey].viewstate;
        },
        queryResultsets: function() {
            var queryKey = this.$store.state.tab[this.$store.state.selectedTabKey].viewstate.queryKey;

            return Object.keys(this.$store.state.query[queryKey].result.resultsets).map(function(key) {
                return {
                    key: key,
                    name: 'asd'
                };
            });
        },
        query: function() {
            var queryKey = this.$store.state.tab[this.$store.state.selectedTabKey].viewstate.queryKey;
            return this.$store.state.query[queryKey]
        },
    },
    filters: {
        pretty: function(value) {
            return JSON.stringify(value, '  ', 2);
        }
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
        tabClick: function(key) {
            Vue.set(this.query.result, 'selectedResultsetKey', key);
        },
        editorchange: function(c) {
            this.value.viewstate.content = c;
        },
        selectionchange: function(c) {
            console.log('SELECTION CHANGE !!!', c);
            this.value.viewstate.selection = c;
        }
    }
}
</script>

<style>
.sql-view-status {
    width: 100%;
    text-align: left;
    padding: 5px;
    background: #fafafa;
}
.disabled {
    filter: grayscale(100%);
    opacity: 0.3;
}
.sql-view-status .msg {
    float: left;
    font-size: 12px;
    padding-top: 1px;
    font-weight: normal;
    margin-left: 5px;
}
.sql-view-status .icon {
    float: left;
    height: 30px;
    width: 22px;
    height: 24px;
    border-radius: 3px;
    padding-right: 1px;
    margin-left: 2px;
    margin-top: -2px;
    text-align: center;
}
sql-view-status div.sep {
    float: left;
    width: 1px;
    height: 24px;
    background: #efefef;
    margin-left: 3px;
    margin-right: 3px;
}
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
.errormessage {
    padding: 10px;
    font-size: 12px;
    font-family: menlo;
    text-align: left;
    font-weight: normal;
}
.statusmessage {
    border-top-left-radius: 0px;
    border-radius: 0px;
    padding: 0px;
    vertical-align: middle;
    margin-bottom: 2px;
    font-size: 12px;
    font-family: menlo;
    display: flex;
    font-weight: normal;
    color: #333;
}
.runtime_instant {
    border-right: 2px solid #1f96ff;
    background: #ebebeb;
    letter-spacing: 0px;
    font-size: 10px;
    vertical-align: middle;
    padding-left: 5px;
    padding-top: 8px;
    padding-bottom: 8px;
    display: inline-flex;
    min-width: 58px;
}
.message {
    margin-right: 80px;
    display: inline-flex;
    padding-top: 7px;
    padding-left: 8px;
    padding-right: 8px;
    background: #fafafa;
}
.error {
    padding-left: 10px;
    padding-top: 10px;
    padding-right: 10px;
}
.messages {
    padding-left: 10px;
    padding-top: 10px;
    padding-right: 10px;
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
.resultset-toolbar {
    border-top: 1px solid #e0e0e0;
    flex-grow: 0;
    flex-shrink: 0;
}
.resultset-tab ul {
    font-size: 14px;
    list-style: none;
    font-weight: normal;
}
.resultset-tab ul li {
    float: left;
    cursor: pointer;
    padding-left: 10px;
    padding-right: 10px;
    height: 30px;
    padding-top: 7px;
    border-bottom: 1px solid #e0e0e0;
    border-right: 1px solid #e0e0e0;
}
.resultset-tab ul li.active {
    background: #fff;
    border-bottom: none;
}
</style>
