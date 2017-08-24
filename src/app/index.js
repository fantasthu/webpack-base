import Vue from 'vue';
import VueRouter from 'vue-router';
import routes from './router/index.js';
import tool from './service/Tools.js';

import 'mint-ui/lib/style.css';
import { getProxyInfo } from './service/API.js';

require('./style.scss');

Vue.use(VueRouter);
const router = new VueRouter({
  routes
});

const proxyId = tool.qsearch('pid') || 1;
const userToken = tool.qsearch('usertoken') || '';

new Vue({
  router,
  data() {
    return {
      proxyId,
      userToken,
      eventBus: this
    };
  },
  mounted() {
    this.eventBus.$on('userToken', usertoken => {
      this.userToken = usertoken;
    });
    getProxyInfo({
      pid: this.proxyId
    }).then(res => {
      if (res.result === 1) {
        this.proxyInfo = JSON.parse(res.data);
      }
    });
  },
  render(h) {
    return h('router-view');
  }
}).$mount('#app');
