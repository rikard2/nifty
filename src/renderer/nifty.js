import Vue from 'vue'
const ipc = require('electron').ipcRenderer

export class Nifty {
    listeners = [];
    activeEditor = null;
    vm = null;


    constructor(vm) {
        this.vm = vm;
        console.log('Load of nifty');

        var dis = this;
        ipc.on('command', function(event, msg) {
            dis.send.apply(dis, [ msg.command, msg.payload ]);
        });

        this.on('execute-query', () => {
            if (dis.activeEditor) {
                //vm.$store.state.tabs[0]
                console.log('vm.$store.state', vm.$store.state);
                vm.$store.state.tabs[0].viewstate.result.resultsets.push(
                    {
                        label: 'Result #2',
                        resultset: true,
                        columns: [{
                            label: 'Nr',
                            width: 60
                        },
                        {
                            label: 'Name',
                            width: 300
                        }],
                        rows:
                        Array.apply(null, {length: 59000}).map(Number.call, Number).map(i => {
                            return [i, 'Jeff Brown']
                        })
                    }
                );
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
        console.log('SEND', this.$root);
        this.listeners.forEach(l => {
            if (l.name == name) {
                l.callback.apply(this, [ payload ]);
            }
        });
    }
}