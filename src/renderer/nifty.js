const ipc = require('electron').ipcRenderer

var commands = {
    listeners: [],
    listen: function(name, callback) {
        this.listeners.push({
            name: name,
            callback: callback
        });
    },
    send: function(name, payload) {
        this.listeners.forEach(l => {
            if (l.name == name) {
                l.callback(payload);
            }
        });
    }
};

ipc.on('command', function(event, msg) {
    console.log(commands.listeners);
    commands.send(msg.command, msg.payload);
});

module.exports = {
    commands : commands
};