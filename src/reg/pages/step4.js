import Vue from 'vue';
import {
  Checklist,
  Radio,
  Popup,
  Toast,
} from 'mint-ui';
import SignaturePad from 'signature_pad';
import {
  uploadSign,
} from '../service/API.js';
import template from './step4.html';
import './step4.scss';

const statementList = [{
  label: '我是本账户的最终受益拥有人',
  value: 1,
}, {
  label: '我不是美国公民或就税务而言的公民',
  value: 2,
}, {
  label: '我不是寰盈证券代理人或与职员有亲属关系',
  value: 3,
}];

Vue.component(Checklist.name, Checklist);
Vue.component(Radio.name, Radio);
Vue.component(Popup.name, Popup);

export default Vue.extend({
  template,
  data() {
    return {
      userToken: '',
      statement: [1, 2, 3],
      employee: '',
      statementList,
      signatureImg: '',
      popupVisible: false,
      canvas: undefined,
      signaturePad: undefined,
      loading: false,
    };
  },
  computed: {
    isValidate() {
      return this.statement.indexOf(1) > -1 &&
        this.statement.indexOf(2) > -1 &&
        (this.statement.indexOf(3) > -1 || (this.statement.indexOf(3) === -1 && this.employee.length > 0)) &&
        this.signatureImg.length > 0;
    },
  },
  mounted() {
    if (this.$root.userToken) {
      this.userToken = this.$root.userToken;
    } else {
      this.$router.push('index');
    }
    this.initSignaturePad();
  },
  methods: {
    showSign() {
      this.popupVisible = true;
      if (typeof window.orientation === 'number' && typeof window.onorientationchange === 'object') {
        window.removeEventListener('orientationchange', this.resizeHandler);
        window.addEventListener('orientationchange', this.resizeHandler, false);
      } else {
        window.removeEventListener('resize', this.resizeHandler);
        window.addEventListener('resize', this.resizeHandler, false);
      }
      this.resizeHandler();
    },
    resizeHandler() {
      this.$nextTick(() => {
        this.resizeCanvas();
      });
    },
    clearSign() {
      this.resizeCanvas();
    },
    saveSign() {
      this.popupVisible = false;
      this.signatureImg = this.signaturePad.toDataURL();
    },
    initSignaturePad() {
      const wrap = document.getElementById('signWrap');
      this.canvas = wrap.querySelector('canvas');
      this.signaturePad = new SignaturePad(this.canvas);
    },
    resizeCanvas() {
      const ratio = Math.max(window.devicePixelRatio || 1, 1);
      this.canvas.width = this.canvas.offsetWidth * ratio;
      this.canvas.height = this.canvas.offsetHeight * ratio;
      const context = this.canvas.getContext('2d');
      context.scale(ratio, ratio);
      if (window.orientation === 0) {
        context.translate(0, this.canvas.offsetHeight);
        context.rotate((-90 * Math.PI) / 180);
      }
      this.signaturePad.clear();
    },
    downloadAgreement(e) {
      e.preventDefault();
      console.log('sdfasd');
      window.open('./agreement.docx', '_blank', 'height=0,width=0,toolbar=no,menubar=no,scrollbars=no,resizable=on,location=no,status=no');
      // fileURL.document.execCommand('SaveAs');
      // fileURL.window.close();
      // fileURL.close();
      // window.win = open('./agreement.docx');
      // setTimeout('win.document.execCommand("SaveAs")', 500);
      return false;
    },
    downloadW8BEN(e) {
      e.preventDefault();
      window.open('./w8ben.pdf', '_blank', 'height=0,width=0,toolbar=no,menubar=no,scrollbars=no,resizable=on,location=no,status=no');
      // fileURL.document.execCommand('SaveAs');
      // fileURL.window.close();
      // fileURL.close();
      return false;
    },
    nextStep() {
      this.loading = true;
      uploadSign({
        userToken: this.userToken,
        proxyid: this.$root.proxyid,
        signed: encodeURIComponent(this.signatureImg),
        signame: this.statement.indexOf(3) > -1 ? '' : this.employee,
      }).then((res) => {
        this.loading = false;
        if (res.code === 0) {
          this.$router.push('result');
        } else {
          Toast(res.message);
        }
      });
    },
  },
});
