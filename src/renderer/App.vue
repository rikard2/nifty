<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
const ipc = require('electron').ipcRenderer

export default {
    name: 'lol',
    components: {
    },
    methods: {
        executeQuery() {
            console.log('executeQuery');
        }
    },
    created() {
        var dis = this;
        ipc.on('command', function(event, msg) {
            console.log('command', msg);
            var cmd = msg.command;
            if (cmd == 'execute-query') {
                dis.executeQuery();
            }
        });
    }
}
</script>

<style>
  /* CSS */
  #app {
    height: 100%;
  }
  html { height: 100%;}
</style>
