import Vue from 'vue'
const ipc = require('electron').ipcRenderer

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
                if ((lookups || []).length == 1) {
                    var value = this.activeDataTable.getCellValue(x, y);
                    var values = this.activeDataTable.getCellValues(selected);
                    console.log('values', value, values);
                    var query = lookups[0].query.replace('$ID$', value);
                    query = query.replace('$IDS$', values);
                    this.vm.nifty.db.query('Vagrant', query)
                    .then(function(response) {
                        return dis.popup('Lookup', response.resultsets[0]);
                    }, function(err) {
                        console.log('err', err);
                    })
                    .then(function() {
                        console.log('POPUP opened');
                    }, function(err) {
                        dis.vm.nifty.activeDataTable.focus();
                    });
                }
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

    popup(component, model) {
        console.log('popup1!!!');
        var promise = new Promise(function(fulfill, reject) {
            var overlay = document.createElement('div');
            overlay.style.position = 'absolute';
            overlay.style.left = overlay.style.top = overlay.style.right = overlay.style.bottom = '0px';
            overlay.style.background = '#f0f0f0';
            overlay.style.opacity = '0.5';
            overlay.style['z-index'] = '500';

            var content = document.createElement('div');
            content.id = 'content';
            content.style.position = 'absolute';
            content.style.width = '800px';
            content.style.height = '400px';
            content.style.left = 'calc(50% - 400px)',
            content.style.top = '25px',
            content.style.margin = '0 auto';
            content.style.opacity = '1';
            content.style['margin-top'] = '50px';
            content.style['z-index'] = '9999';
            content.style.background = '#fff';
            content.style['box-shadow'] = '0px 0px 5px 1px rgba(0,0,0,0.64)';
            document.body.appendChild(content);
            document.body.appendChild(overlay);

            var compElement = document.createElement('div');
            content.appendChild(compElement);
            var ModalComponent = require('./components/Modals/' + component + '.vue').default;
            var components = {};
            components[component] = ModalComponent;
            var v = new Vue({
                name: component,
                data: function() {
                    return {
                        model: model
                    };
                },
                components: components,
                beforeMount: function() {
                    console.log('mount?', ModalComponent);
                },
                template: '<div><' + component + ' v-model="this.model"></' + component + '></div>'
            });
            v.$mount(compElement);
            var onKeyDown = function(e) {
                if (e.key == 'Escape') {
                    document.body.removeChild(content);
                    document.body.removeChild(overlay);
                    v.$destroy();
                    document.removeEventListener('keydown', onKeyDown);
                    reject();
                }
            };
            document.addEventListener('keydown', onKeyDown);
        });

        return promise;
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