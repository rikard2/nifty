import Vue from 'vue'
const ipc = require('electron').ipcRenderer
import { Modal } from './nifty/modal.js';
export class Nifty {
    listeners = [];
    zeroRPCClient = null;
    activeEditor = null;
    activeDataTable = null;
    vm = null;

    async asyncFun () {
      var value = await Promise
        .resolve(1)
        .then(x => x * 3)
        .then(x => x + 5)
        .then(x => x / 2);
      return value;
    }

    getActiveTab() {
        return this.vm.$store.state.tabs[this.vm.$store.state.activeTab.index];
    }

    constructor(vm) {
        this.vm = vm;
        console.info('Load of nifty');

        this.db = new (require('./nifty/db').DB)(vm);
        var dis = this;
        ipc.on('command', function(event, msg) {
            dis.send.apply(dis, [ msg.command, msg.payload ]);
        });
        this.on('new', () => {
            vm.$store.state.tabs.push({
                name: 'Untitled',
                type: 'sql',
                viewstate: {
                    content: '',
                    selected: -1,
                    executing: false,
                    result: {
                        hide: true,
                        resultsets: []
                    }
                }
            });
            vm.$store.state.activeTab.index = vm.$store.state.tabs.length - 1;
        });
        this.on('lookup', async () => await this.lookup.apply(dis));
        this.on('previous-tab', () => {
            var newIndex = vm.$store.state.activeTab.index - 1;
            if (newIndex < 0) {
                newIndex = 0;
            }
            if (vm.$store.state.tabs.length == 0) {
                newIndex = -1;
            }
            vm.$store.state.activeTab.index = newIndex;
        });
        this.on('next-tab', () => {
            var newIndex = vm.$store.state.activeTab.index + 1;
            if (newIndex >= vm.$store.state.tabs.length) {
                newIndex = vm.$store.state.tabs.length - 1;
            }
            if (vm.$store.state.tabs.length == 0) {
                newIndex = -1;
            }
            vm.$store.state.activeTab.index = newIndex;
        });
        this.on('close-tab', () => {
            var index = vm.$store.state.activeTab.index;
            vm.$store.state.tabs.splice(index, 1);
            var newIndex = vm.$store.state.activeTab.index - 1;
            if (newIndex < 0) newIndex = 0;
            if (vm.$store.state.tabs.length == 0) {
                newIndex = -1;
            }
            Vue.set(vm.$store.state.activeTab, 'index', newIndex);
        });
        this.on('execute-selected-query', async () => {
            if (dis.activeEditor) {
                var content = dis.activeEditor.getSelectedText();
                await this.executeQuery(this.vm, content);
            }
        });
        this.on('execute-query', async () => {
            var content = dis.activeEditor.getValue();
            await this.executeQuery(this.vm, content);
        });
    }

    async executeQuery(vm, content) {
        var connection = await this.getTabConnection(vm);
        vm.$store.state.tabs[vm.$store.state.activeTab.index].connection = connection;
        vm.$store.state.tabs[vm.$store.state.activeTab.index].viewstate.result.selected = -1;
        vm.$store.state.tabs[vm.$store.state.activeTab.index].viewstate.result.resultsets = [];
        vm.$store.state.tabs[vm.$store.state.activeTab.index].viewstate.executing = true;

        var result = await vm.nifty.db.queryAsync(connection, content);
        vm.$store.state.tabs[vm.$store.state.activeTab.index].viewstate.error = false;
        vm.$store.state.tabs[vm.$store.state.activeTab.index].viewstate.executing = false;
        result.resultsets.forEach((r, i) => {
            r.label = 'Result #' + (i + 1);
            r.resultset = true;
            vm.$store.state.tabs[vm.$store.state.activeTab.index].viewstate.msg = 'Query run successfully.';
            vm.$store.state.tabs[vm.$store.state.activeTab.index].viewstate.result.resultsets.push(r);
            vm.$store.state.tabs[vm.$store.state.activeTab.index].viewstate.selected = 0;
        });
        Vue.set(vm.$store.state.tabs[vm.$store.state.activeTab.index].viewstate.result, 'hide', false);
    }

    async getTabConnection(vm) {
        var connection = (this.getActiveTab() || {}).connection;
        var config = vm.$store.state.config;

        if (!connection) {
            connection = await Modal.choices(Object.keys(config.connections).map(function(alias) {
                return {
                    label: config.connections[alias].name,
                    value: alias
                };
            }));
        }
        return connection;
    }

    async getLookup(columnName) {
        var lookups = this.vm.$store.state.config.lookups[columnName];
        if (lookups.length == 1) return lookups[0]
        else if (lookups.length > 1) {
            return await Modal.choices(lookups.map(l => {
                return {
                    label: l.name,
                    value: l
                };
            }));
        };
        return null;
    }

    async lookup() {
        var connection = await this.getTabConnection(this.vm);
        var config = this.vm.$store.state.config;
        var selected = this.activeDataTable.selection.getSelectedRange();

        if (selected.length > 0) {
            var x = selected[0][0];
            var y = selected[0][1];
            var column = this.activeDataTable.getColumn(x);
            if (column.name && (config.lookups || {})[column.name]) {
                var lookup = await this.getLookup(column.name);
                if (!lookup) throw("No lookup found");

                var value = this.activeDataTable.getCellValue(x, y);
                var values = this.activeDataTable.getCellValues(selected);
                if (lookup.type == 'json') {
                    var json = {};
                    try { json = JSON.parse(value); } catch (e) { throw('Could not parse JSON'); }
                    await Modal.show('JSON', json);
                    this.vm.nifty.activeDataTable.focus();
                } else if (lookup.query) {
                    var query = lookup.query.replace('$ID$', value).replace('$IDS$', values);
                    var connection = await this.getTabConnection(this.vm);
                    var result = await this.vm.nifty.db.queryAsync(connection, query);
                    this.vm.$store.state.tabs[this.vm.$store.state.activeTab.index].connection = connection;

                    await Modal.show('Lookup', result.resultsets[0]);
                    this.vm.nifty.activeDataTable.focus();
                }
            };
        }
    }

    on(name, callback) {
        this.listeners.push({
            context: this,
            name: name,
            callback: callback
        });
    }

    send(name, payload) {
        this.listeners.forEach(l => {
            if (l.name == name) {
                l.callback.apply(l.context, [ payload ]);
            }
        });
    }
}
