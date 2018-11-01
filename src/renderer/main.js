import Vue from 'vue'
import axios from 'axios'

import App from './App'
import router from './router'
import store from './store'
var Nifty = require('./nifty').Nifty;

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false
/* eslint-disable no-new */
var v = new Vue({
  components: { App },
  beforeMount: function() {
      this.nifty = new Nifty(this);
      window.nifty = this.nifty;
  },
  router,
  store,
  template: '<App/>'
}).$mount('#app');
