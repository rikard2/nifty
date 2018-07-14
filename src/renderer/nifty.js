const ipc = require('electron').ipcRenderer

module.exports = {
    onCommand: function(name, callback) {
        ipc.on('command', function(event, msg) {
            var cmd = msg.command;
            if (cmd == name) {
                callback();
            }
        });
    }
};