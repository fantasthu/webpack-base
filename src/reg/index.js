import Vue from 'vue'
import VueRouter from 'vue-router'
import tool from './service/Tools.js'

import 'mint-ui/lib/style.css'
import index from './pages/step1.js'
import info from './pages/step2.js'
import idcard from './pages/step3.js'
import signature from './pages/step4.js'
import result from './pages/result.js'
import { getProxyInfo } from './service/API.js'
import event from './service/eventBus.js'

require('./style.scss')

Vue.use(VueRouter)

//==========test es6===============
import outFile from './OutFile'
const outfile = new outFile()
console.log('A', outfile.setName(121), outfile.getName())
new Promise((resolve, reject) => {
  console.log('resolve', resolve)
})
Promise.all([1, 2, 3])
var arr = [...[1, 2], 3]
console.log('arr', arr)
function lazyLoad1() {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log('im lazy1', 'im lazy1')
      resolve("lazy1")
    }, 3000)
  })
}
function lazyLoad2() {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log('im lazy2', 'im lazy2')
      resolve("lazy2")
    }, 2000)
  })
}
async function getName() {
  const value1 = await lazyLoad1();
  const value2 = await lazyLoad2();
  console.log('value',value1,value2);
}
getName();
//==========test===============
// 开启debug模式
Vue.config.debug = true

const router = new VueRouter({
  routes: [
    {
      name: 'index',
      path: '/index',
      component: index
    },
    {
      name: 'info',
      path: '/info',
      component: info
    },
    {
      name: 'idcard',
      path: '/idcard',
      component: idcard
    },
    {
      name: 'result',
      path: '/result',
      component: result,
      mate: {
        keepAlive: true
      }
    },
    {
      name: 'signature',
      path: '/signature',
      component: signature
    },
    {
      path: '/*',
      component: index
    }
  ]
})

const proxyId = tool.qsearch('pid') || 1

const userToken = tool.qsearch('usertoken') || ''

new Vue({
  router,
  data() {
    return {
      proxyId,
      userToken,
      proxyInfo: {}
    }
  },
  mounted() {
    event.$on('userToken', usertoken => {
      this.userToken = usertoken
    })
    getProxyInfo({
      pid: this.proxyId
    }).then(res => {
      if (res.result === 1) {
        this.proxyInfo = JSON.parse(res.data)
      }
    })
  },
  render(h) {
    return h('router-view')
  }
}).$mount('#app')
