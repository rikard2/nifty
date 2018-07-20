const ipc = require('electron').ipcRenderer

export class Nifty {
    listeners = [];
    activeEditor = null;

    constructor() {
        console.debug('Load of nifty');
        ipc.on('command', function(event, msg) {
            //console.log(commands.listeners);
            //commands.send(msg.command, msg.payload);
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
                l.callback(payload);
            }
        });
    }
}