import 'babel-polyfill';
import Vue from 'vue';
import VueRouter from 'vue-router';
import tool from './service/Tools.js';

import 'mint-ui/lib/style.css';

import index from './pages/step1.js';
import info from './pages/step2.js';
import idcard from './pages/step3.js';
import signature from './pages/step4.js';
import result from './pages/result.js';
import {
  getProxyInfo,
} from './service/API.js';
import event from './service/eventBus.js';

require('./style.scss');

Vue.use(VueRouter);

// 开启debug模式
Vue.config.debug = true;

const router = new VueRouter({
  routes: [{
    name: 'index',
    path: '/index',
    component: index,
  }, {
    name: 'info',
    path: '/info',
    component: info,
  }, {
    name: 'idcard',
    path: '/idcard',
    component: idcard,
  }, {
    name: 'result',
    path: '/result',
    component: result,
    mate: { keepAlive: true },
  }, {
    name: 'signature',
    path: '/signature',
    component: signature,
  }, {
    path: '/*',
    component: index,
  }],
});

const proxyId = tool.qsearch('pid') || 1;

const userToken = tool.qsearch('usertoken') || '';

new Vue({
  router,
  data() {
    return {
      proxyId,
      userToken,
      proxyInfo: {},
    };
  },
  mounted() {
    event.$on('userToken', (usertoken) => {
      this.userToken = usertoken;
    });
    getProxyInfo({
      pid: this.proxyId,
    }).then((res) => {
      if (res.result === 1) {
        this.proxyInfo = JSON.parse(res.data);
      }
    });
  },
  render(h) {
    return h('router-view');
  },
}).$mount('#app');