import Vue from 'vue';
import {
  Cell,
  Field,
  Button,
  Toast,
  Spinner,
} from 'mint-ui';

import {
  getVerifyCode,
  register,
  checkMobile,
  login,
  getUserAccountStatu,
} from '../service/API.js';
// import Tools from '../service/Tools';
import event from '../service/eventBus.js';
import template from './step1.html';
import {
  Base64,
} from 'js-base64';
import './step1.scss';

Vue.component(Cell.name, Cell);
Vue.component(Field.name, Field);
Vue.component(Button.name, Button);
Vue.component(Spinner.name, Spinner);

const regPhone = /^1[3|4|5|7|8][0-9]{9}$/;
const regVerify = /^[0-9]{4}$/;
const regPassword = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,15}$/;
export default Vue.extend({
  template,
  data() {
    return {
      phoneno: '',
      checkPhoneNo: true,
      verifyCode: '',
      verifyTimer: 0,
      verifyEnable: true,
      checkVerifyCode: true,
      password: '',
      checkPassword: true,
      loading: false,
      isreg: false,
      islogin: false,
    };
  },
  mounted() {
    console.log(this.$root.proxyId);
  },
  watch: {
    phoneno() {
      if (regPhone.test(this.phoneno)) {
        this.checkPhoneNo = true;
      } else {
        this.checkPhoneNo = false;
        this.isreg = false;
        this.islogin = false;
      }
    },
    verifyCode() {
      if (regVerify.test(this.verifyCode)) {
        this.checkVerifyCode = true;
      }
    },
    password() {
      if (regPassword.test(this.password)) {
        this.checkPassword = true;
      }
    },
  },
  methods: {
    getVerifyCode() {
      if (regPhone.test(this.phoneno.replace(/(^\s*)|(\s*$)/g, ''))) {
        this.checkPhoneNo = true;
        getVerifyCode({
          mobile: this.phoneno.replace(/(^\s*)|(\s*$)/g, ''),
          proxyId: this.$root.proxyId,
        }).then((res) => {
          if (res.result === 1) {
            this.startVerifyTimer();
          }
        });
      } else {
        this.checkPhoneNo = false;
      }
    },
    startVerifyTimer() {
      this.verifyTimer = 60;
      this.verifyEnable = false;
      const timerId = setInterval(() => {
        this.verifyTimer -= 1;
        if (this.verifyTimer === 0) {
          clearInterval(timerId);
          this.verifyEnable = true;
        }
      }, 1000);
    },
    verifyFields() {
      if (!regPhone.test(this.phoneno.replace(/(^\s*)|(\s*$)/g, ''))) {
        this.checkPhoneNo = false;
      } else {
        this.checkPhoneNo = true;
      }
      if (!regVerify.test(this.verifyCode.replace(/(^\s*)|(\s*$)/g, ''))) {
        this.checkVerifyCode = false;
      } else {
        this.checkVerifyCode = true;
      }
      if (!regPassword.test(this.password)) {
        this.checkPassword = false;
      } else {
        this.checkPassword = true;
      }
      return this.checkPhoneNo && this.checkVerifyCode && this.checkPassword;
    },
    toStep(status) {
      if (status === '1') {
        this.$router.push('info');
      } else if (status === '11' || status === '4') {
        this.$router.push('idcard');
      } else if (status === '12' || status === '5') {
        this.$router.push('signature');
      } else if (status === '2') {
        this.$router.push('result');
      } else if (status === '3') {
        this.$router.push({
          name: 'result',
          params: {
            type: 'success',
          },
        });
      }
    },
    nextStep() {
      // 判断是登录还是注册
      if (!this.isreg && !this.islogin && this.checkPhoneNo) {
        // 判断手机号是否已注册
        this.loading = true;
        checkMobile({
          mobile: Base64.encode(this.phoneno),
          proxyid: this.$root.proxyId,
        }).then(res => {
          this.loading = false;
          if (res.code === 0 && res.userInfo.status !== 0) {
            this.islogin = true;
          } else {
            this.isreg = true;
          }
        });
      }
      // 如果是 注册
      if (this.isreg && this.verifyFields()) {
        this.loading = true;
        register({
          mobile: this.phoneno.replace(/(^\s*)|(\s*$)/g, ''),
          code: this.verifyCode.replace(/(^\s*)|(\s*$)/g, ''),
          password: this.password,
          proxyId: this.$root.proxyId,
        }).then((res) => {
          this.loading = false;
          if (res.code === 0) {
            event.$emit('userToken', res.userInfo.userToken);
            this.$router.push('info');
            return res;
          } else {
            Toast(res.message);
          }
        }).then(data => {
          getUserAccountStatu({
            usertoken: data.userInfo.userToken,
            proxyid: this.$root.proxyId,
          }).then(res => {
            console.log('res', res);
            this.toStep(res.result.ostatus);
          });
        });
      }
      // 如果是登录
      if (this.islogin && this.checkPhoneNo) {
        login({
          mobile: Base64.encode(this.phoneno),
          password: this.password,
          proxyid: this.$root.proxyId,
        }).then(res => {
          if (res.code === 0) {
            // 获取请求状态接口,跳转路由
            event.$emit('userToken', res.userInfo.userToken);
            return res;
          } else {
            Toast(res.message);
          }
          return false;
        }).then(data => {
          getUserAccountStatu({
            usertoken: data.userInfo.userToken,
            proxyid: this.$root.proxyId,
          }).then(res => {
            console.log('res', res);
            this.toStep(res.result.ostatus);
          });
        });
      }
    },
  },
});
