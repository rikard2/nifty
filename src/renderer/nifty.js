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
        //if (selected.)
        //var lookup = (config.lookups || {})[]
        console.log('range', selected);
        if (selected.length > 0) {
            var x = selected[0][0];
            var y = selected[0][1];
            var column = this.activeDataTable.getColumn(x);
            console.log('column.name', column.name, config.lookups);
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
                    console.log('THEN!!!');
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

        this.db = new (require('./nifty/db').DB)();
        var dis = this;
        ipc.on('command', function(event, msg) {
            dis.send.apply(dis, [ msg.command, msg.payload ]);
        });
        this.on('lookup', () => {
            dis.lookup.apply(dis);
        });
        this.on('execute-selected-query', () => {
            if (dis.activeEditor) {
                vm.$store.state.tabs[0].viewstate.result.selected = -1;
                vm.$store.state.tabs[0].viewstate.result.resultsets = [];
                vm.$store.state.tabs[0].viewstate.executing = true;
                vm.nifty.db.query('Vagrant', dis.activeEditor.getSelectedText())
                .then(function(response) {
                    vm.$store.state.tabs[0].viewstate.error = false;
                    vm.$store.state.tabs[0].viewstate.executing = false;
                    response.resultsets.forEach((r, i) => {
                        r.label = 'Result #' + (i + 1);
                        r.resultset = true;
                        vm.$store.state.tabs[0].viewstate.msg = 'Query run successfully.';
                        vm.$store.state.tabs[0].viewstate.result.resultsets.push(r);
                        vm.$store.state.tabs[0].viewstate.result.selected = 0;
                    });
                }, function(err) {
                    console.log('err', err);
                    Vue.set(vm.$store.state.tabs[0].viewstate, 'executing', false);
                    vm.$store.state.tabs[0].viewstate.error = true;
                    vm.$store.state.tabs[0].viewstate.msg = err;
                })
                .finally(function() {
                });
            }
        });
        this.on('execute-query', () => {
            if (dis.activeEditor) {
                vm.$store.state.tabs[0].viewstate.result.selected = -1;
                vm.$store.state.tabs[0].viewstate.result.resultsets = [];
                vm.$store.state.tabs[0].viewstate.executing = true;
                vm.nifty.db.query('Vagrant', dis.activeEditor.getValue())
                .then(function(response) {
                    vm.$store.state.tabs[0].viewstate.error = false;
                    vm.$store.state.tabs[0].viewstate.executing = false;
                    response.resultsets.forEach((r, i) => {
                        r.label = 'Result #' + (i + 1);
                        r.resultset = true;
                        vm.$store.state.tabs[0].viewstate.msg = 'Query run successfully.';
                        vm.$store.state.tabs[0].viewstate.result.resultsets.push(r);
                        vm.$store.state.tabs[0].viewstate.result.selected = 0;
                    });
                }, function(err) {
                    console.log('err', err);
                    Vue.set(vm.$store.state.tabs[0].viewstate, 'executing', false);
                    vm.$store.state.tabs[0].viewstate.error = true;
                    vm.$store.state.tabs[0].viewstate.msg = err;
                })
                .finally(function() {
                });
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