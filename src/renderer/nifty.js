import Vue from 'vue'
const ipc = require('electron').ipcRenderer
import { Modal } from './nifty/modal.js';
export class Nifty {
    listeners = [];
    zeroRPCClient = null;
    activeEditor = null;
    activeDataTable = null;
    vm = null;

    lookup() {
        var dis = this;
        var config = this.vm.$store.state.config;
        var selected = this.activeDataTable.selection.getSelectedRange();

        if (selected.length > 0) {
            var x = selected[0][0];
            var y = selected[0][1];
            var column = this.activeDataTable.getColumn(x);
            if (column.name && (config.lookups || {})[column.name]) {
                var lookups = config.lookups[column.name];
                new Promise(function(fulfill, reject) {
                    if (lookups.length > 1) {
                        return Modal.choices(lookups.map(function(l) {
                            return {
                                label: l.name,
                                value: l
                            };
                        })).then(function(choice) {
                            fulfill(choice);
                        });
                    } else if (lookups.length == 1) {
                        fulfill(lookups[0]);
                    } else {
                        reject('');
                    }
                }).then(function(lookup) {
                    var value = dis.activeDataTable.getCellValue(x, y);
                    var values = dis.activeDataTable.getCellValues(selected);
                    if (lookup.type == 'json') {
                        var json = { };
                        try {
                            json = JSON.parse(value);
                        } catch (e) {

                        }
                        Modal.show('JSON', json)
                        .then(function() {
                            console.log('POPUP opened');
                        }, function(err) {
                            dis.vm.nifty.activeDataTable.focus();
                        });
                    } else {
                        var query = lookup.query.replace('$ID$', value);
                        query = query.replace('$IDS$', values);
                        dis.vm.nifty.db.query('Vagrant', query)
                        .then(function(response) {
                            return Modal.show('Lookup', response.resultsets[0]);
                        }, function(err) {
                            console.log('err', err);
                        })
                        .then(function() {
                            console.log('POPUP opened');
                        }, function(err) {
                            dis.vm.nifty.activeDataTable.focus();
                        });
                    }
                }, function(err) {
                    console.log('ERROR!!!', err);
                });
            }
            //this.popup('Lookup', )
        }
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
                    executing: false,
                    result: {
                        hide: true
                    }
                }
            });
            vm.$store.state.activeTab.index = vm.$store.state.tabs.length - 1;
        });
        this.on('lookup', () => {
            dis.lookup.apply(dis);
        });
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
        this.on('execute-selected-query', () => {
            if (dis.activeEditor) {
                var content = dis.activeEditor.getSelectedText();
                dis.executeQuery.apply(dis, [vm, content]);
            }
        });
        this.on('execute-query', () => {
            if (dis.activeEditor) {
                var content = dis.activeEditor.getValue();
                dis.executeQuery.apply(dis, [vm, content]);
            }
        });
    }

    executeQuery(vm, content) {
        this.getTabConnection(vm).then(function(connection) {
            vm.$store.state.tabs[vm.$store.state.activeTab.index].connection = connection;
            vm.$store.state.tabs[vm.$store.state.activeTab.index].viewstate.result.selected = -1;
            vm.$store.state.tabs[vm.$store.state.activeTab.index].viewstate.result.resultsets = [];
            vm.$store.state.tabs[vm.$store.state.activeTab.index].viewstate.executing = true;
            vm.nifty.db.query(connection, content)
            .then(function(response) {
                vm.$store.state.tabs[vm.$store.state.activeTab.index].viewstate.error = false;
                vm.$store.state.tabs[vm.$store.state.activeTab.index].viewstate.executing = false;
                response.resultsets.forEach((r, i) => {
                    r.label = 'Result #' + (i + 1);
                    r.resultset = true;
                    vm.$store.state.tabs[vm.$store.state.activeTab.index].viewstate.msg = 'Query run successfully.';
                    vm.$store.state.tabs[vm.$store.state.activeTab.index].viewstate.result.resultsets.push(r);
                    vm.$store.state.tabs[vm.$store.state.activeTab.index].viewstate.result.selected = 0;
                });
                Vue.set(vm.$store.state.tabs[vm.$store.state.activeTab.index].viewstate.result, 'hide', false);
            }, function(err) {
                console.log('err', err);
                Vue.set(vm.$store.state.tabs[vm.$store.state.activeTab.index].viewstate, 'executing', false);
                vm.$store.state.tabs[vm.$store.state.activeTab.index].viewstate.error = true;
                vm.$store.state.tabs[vm.$store.state.activeTab.index].viewstate.msg = err;
            });
        });
    }

    getTabConnection(vm) {
        var connection = vm.$store.state.tabs[vm.$store.state.activeTab.index].connection;
        return new Promise(function(fulfill, reject) {
            var config = vm.$store.state.config;
            if (!connection) {
                return Modal.choices(Object.keys(config.connections).map(function(alias) {
                    return {
                        label: config.connections[alias].name,
                        value: alias
                    };
                })).then(function(res) {
                    fulfill(res);
                }, function(err) {
                    reject(err);
                });
            } else {
                fulfill(connection);
            }
        });
    }

    on(name, callback) {
        this.listeners.push({
            name: name,
            callback: callback
        });
    }

    send(name, payload) {
        this.listeners.forEach(l => {
            if (l.name == name) {
                l.callback.apply(this, [ payload ]);
            }
        });
    }
}