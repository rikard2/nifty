import Vue from 'vue'
const ipc = require('electron').ipcRenderer
import { Modal } from './nifty/modal.js';
export class Nifty {
    listeners = [];
    zeroRPCClient = null;
    activeEditor = null;
    activeDataTable = null;
    vm = null;

    getActiveTab() {
        return this.vm.$store.state.tabs[this.vm.$store.state.activeTab.index];
    }

    constructor(vm) {
        this.vm = vm;
        var state = this.vm.$store.state;
        console.info('Load of nifty');

        const dirTree = require('directory-tree');
        var ignoreDirectories = ['.git', '.idea'];
        var ignoreFiles = ['.git', '.idea'];
        const tree = dirTree('/users/rikard/git/trustly/schema');
        var index = [];
        var regexes = [
            { points: 9, re: new RegExp('/([a-z0-9_]+)[.]') }
        ];
        var flatten = function(directory) {
            directory.forEach(function(d) {
                if (d.type == 'file') {
                    var filename = d.path.toLowerCase();
                    index.push({
                        filename: filename,
                        matches: regexes.map(function(re) {
                            var x = re.re.exec(filename);
                            return x ? x[1] : null;
                        })
                    });
                }
                else if (d.type == 'directory' && ignoreDirectories.indexOf(d.name) === -1) {
                    flatten(d.children);
                }
            });
        };
        flatten(tree.children);
        console.log(index);

        if (tree) {
            vm.$store.state.folders = [
                {
                    "name": "schema",
                    "tree": tree
                }
            ];
        }
        vm.$store.state.index = index;

        this.db = new (require('./nifty/db').DB)(vm);
        var dis = this;
        ipc.on('command', function(event, msg) {
            dis.send.apply(dis, [ msg.command, msg.payload ]);
        });
        this.on('new', () => {
            var key = state.newTab({
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
            state.selectTab(key);
        });
        this.on('settings', () => {
            var key = state.newTab({
                name: 'Settings',
                type: 'settings'
            });
            state.selectTab(key);
        });
        this.on('lookup', async () => await this.lookup.apply(dis));
        this.on('find', async () => await this.find.apply(dis));
        this.on('previous-tab', () => {
            state.selectPreviousTab();
        });
        this.on('next-tab', () => {
            state.selectNextTab();
        });
        this.on('close-tab', () => {
            state.closeTab(state.selectedTabKey);
        });
        this.on('execute-selected-query', async () => {
            var index = vm.$store.state.activeTab.index;
            var content2 = vm.$store.state.tabs[vm.$store.state.activeTab.index].viewstate.content;
            console.log('contents', content2);
            if (dis.activeEditor) {
                var index = vm.$store.state.activeTab.index;
                var content = dis.activeEditor.getSelectedText();
                var content2 = vm.$store.state.tabs[vm.$store.state.activeTab.index].viewstate.content;
                console.log('contents', content, content2);

                await this.executeQuery(this.vm, content);
            }
        });
        this.on('execute-query', async () => {
            console.log('EXECUTE QUERY');
            var state = vm.$store.state;
            var content = state.tab[state.selectedTabKey].viewstate.content;
            await this.executeQuery(this.vm, content);
        });
    }

    async executeQuery(vm, content) {
        var connection = await this.getTabConnection(vm);
        var state = vm.$store.state;

        var key = state.selectedTabKey;
        var queryKey = state.newQuery(connection);
        Vue.set(state.tab[key], 'connection', connection);
        Vue.set(state.tab[key].viewstate, 'queryKey', queryKey);
        Vue.set(state.query, queryKey, {
            executing: true,
            result: {
                hide: false
            },
            resultsets: {}
        });
        Vue.set(state.tab[key], 'queryKey', queryKey);
        var query = state.query[queryKey];
        console.log('QQ', queryKey, query);
        Vue.set(query.result, 'resultsets', {});
        await vm.nifty.db.queryAsync(connection, content)
        .then(function(result) {
            if (result.notices && result.notices.length) {
                var resultsetKey = require('uniqid')();
                query.result.resultsets[resultsetKey] = {
                    label: 'Notices',
                    notices: result.notices
                };
            }
            result.resultsets.forEach((r, i) => {
                var resultsetKey = require('uniqid')();
                if (r.rowCount == undefined) return;
                r.label = 'Result #' + (i + 1);
                r.resultset = true;
                Vue.set(query.result.resultsets, resultsetKey, r);

            });

            if (Object.keys(query.result.resultsets).length == 1) {
                Vue.set(query.result, 'selectedResultsetKey', Object.keys(query.result.resultsets)[0]);
            } else {
                if (Object.keys(query.result.resultsets).length > 1) {
                    Vue.set(query.result, 'selectedResultsetKey', Object.keys(query.result.resultsets)[1]);
                }
            }

            var resultsetCount = Object.keys(query.result.resultsets).length;
            if (resultsetCount == 1) {
                Vue.set(query, 'msg', 'Statement run successfully.');
                Vue.set(query, 'selected', 0);
            } else if (resultsetCount > 1) {
                Vue.set(query, 'msg', 'Query run successfully.');
                Vue.set(query, 'selected', 1);
            }
        })
        .catch(function(err) {
            query.error = err.message;
            query.msg = 'Statement failed with errors.';
        })
        .finally(function() {
            Vue.set(query, 'executing', false);
            Vue.set(query.result, 'hide', false);
            console.log(query);
        });
    }

    async getTabConnection(vm) {
        var state = vm.$store.state;
        var connection = (state.tab[state.selectedTabKey] || {}).connection;

        if (!connection) {
            connection = await Modal.choices(Object.keys(state.config.connections).map(function(alias) {
                return {
                    label: state.config.connections[alias].name,
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

    async find() {
        var vm = this.vm;
        var openFile = function(path) {
            var fs = require('fs');

            fs.readFile(path, 'utf8', function(err, contents) {
                if (!err) {
                    var filename = path.replace(/^.*[\\\/]/, '');
                    vm.$store.state.tabs.push({
                        name: filename,
                        type: 'sql',
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
                    vm.$store.state.filename = path;
                    vm.$store.state.activeTab.index = vm.$store.state.tabs.length - 1;
                }
            });
        }

        var index = this.vm.$store.state.index;
        var lookup = await Modal.show('Find', { index: index }).
        then(function(selected) {
            openFile(selected.title);
        });
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
