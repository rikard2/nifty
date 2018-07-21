<template>
    <div class="sql-view-flex-container">
        <div class="sql-view-editor">
            <div>
                <toolbar>
                    <toolbar-item icon="play" size="12" :disabled="value.viewstate.executing"></toolbar-item>
                    <toolbar-item icon="stop" size="10" :disabled="!value.viewstate.executing"></toolbar-item>
                </toolbar>
            </div>
            <div style="flex: 1 auto;width: 100%;height: 100%;">
                <editor v-model="value.viewstate.content"></editor>
            </div>
        </div>
        <div v-if="value.viewstate.result" v-resize="{ direction: 'vertical' }" style="flex-basis: 250px; display:flex; flex-direction: column" class="sql-view-resultset" :key="value.name">
            <div v-if="value.viewstate.executing" style="font-size: 12px;margin-top: 30px;font-weight: normal;">
                Loading...
            </div>
            <div class="resultset-tab" v-if="!value.viewstate.executing">
                <ul v-for="(r, i) in value.viewstate.result.resultsets">
                    <li @click="tabClick(i)" :class="{ active: i == value.viewstate.result.selected }">{{ r.label }}</li>
                </ul>
            </div>
            <div style="flex: 1 auto;position: relative;" v-if="value.viewstate.result.selected >= 0 && value.viewstate.result.resultsets[value.viewstate.result.selected].resultset">
                <data-table v-model="value.viewstate.result.resultsets[value.viewstate.result.selected]"></data-table>
            </div>
            <div style="flex: 1 auto;position: relative;" v-if="value.viewstate.result.selected >= 0 && !value.viewstate.result.resultsets[value.viewstate.result.selected].resultset">
                <div v-for="m in value.viewstate.result.resultsets[value.viewstate.result.selected].messages" class="messages">
                    <pre class="statusmessage">
                        <span class="runtime_instant">instant</span>
                        <span class="message">{{ m.text }}</span>
                    </pre>
                </div>
            </div>
            <div class="resultset-toolbar" v-if="!value.viewstate.executing">
                <div class="sql-view-status">
                    <div v-if="!value.viewstate.error">
                        <img style="float: left;padding-top: 3px;height: 16px;width: 16px;" :width="24" :height="24" ref="logo" :src="require(`@/assets/icons/checked.svg`)" alt="electron-vue">
                        <div class="msg">{{ value.viewstate.msg }}</div>
                        <div style="clear:both"></div>
                    </div>
                    <div v-if="value.viewstate.error">
                        <img style="float: left;padding-top: 3px;height: 16px;width: 16px;" :width="24" :height="24" ref="logo" :src="require(`@/assets/icons/error.svg`)" alt="electron-vue">
                        <div class="msg">{{ value.viewstate.msg }}</div>
                        <div style="clear:both"></div>
                    </div>
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
.sql-view-status {
    width: 100%;
    text-align: left;
    padding: 5px;
    border-bottom: 1px solid #e0e0e0;
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
.resultset-toolbar {
    border-top: 1px solid #e0e0e0;
    flex-grow: 0;
    flex-shrink: 0;
    flex-basis: 30px;
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