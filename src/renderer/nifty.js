import Vue from 'vue'
const ipc = require('electron').ipcRenderer

export class Nifty {
    listeners = [];
    zeroRPCClient = null;
    activeEditor = null;
    vm = null;

    constructor(vm) {
        this.vm = vm;
        console.info('Load of nifty');

        this.db = new (require('./nifty/db').DB)();
        var dis = this;
        ipc.on('command', function(event, msg) {
            dis.send.apply(dis, [ msg.command, msg.payload ]);
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