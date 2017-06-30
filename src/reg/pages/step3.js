import Vue from 'vue';
import {
  Toast,
} from 'mint-ui';
import template from './step3.html';

import './step3.scss';

export default Vue.extend({
  template,
  data() {
    return {
      actionUrl: 'https://user.intechtrading.com/api/setOpenAcountInfo.ashx',
      action: 'photo',
      proxyid: '',
      userToken: '',
      packtype: '784',
      idback: '',
      idfront: '',
      loading: false,
    };
  },
  mounted() {
    this.proxyid = this.$root.proxyId;
    if (this.$root.userToken) {
      this.userToken = this.$root.userToken;
    } else {
      this.$router.push('index');
    }
  },
  methods: {
    uploadIdFront({
      target: {
        files,
      },
    }) {
      const reader = new FileReader();
      reader.onload = () => {
        const data = reader.result;
        if (data.length > 0) {
          this.idfront = data;
        }
      };
      reader.readAsDataURL(files[0]);
      return false;
    },
    uploadIdBack({
      target: {
        files,
      },
    }) {
      const reader = new FileReader();
      reader.onload = () => {
        const data = reader.result;
        if (data.length > 0) {
          this.idback = data;
        }
      };
      reader.readAsDataURL(files[0]);
      return false;
    },
    validateFields() {
      const maxSize = 4 * 1024 * 1024;
      if (this.idfront.length === 0) {
        Toast('请上传身份证正面照');
        return false;
      }
      if (this.idback.length === 0) {
        Toast('请上传身份证背面照');
        return false;
      }
      if (this.idfront.length > maxSize || this.idback.length > maxSize) {
        Toast('上传的图片应小于4M');
        return false;
      }
      return true;
    },
    nextStep(e) {
      e.preventDefault();
      if (this.validateFields()) {
        const oData = new FormData(document.forms.namedItem('idcard'));
        oData.append('action', this.action);
        oData.append('proxyid', this.proxyid);
        oData.append('userToken', this.userToken);
        oData.append('packtype', this.packtype);
        oData.append('h5', 'h5');
        const oReq = new XMLHttpRequest();
        oReq.open('POST', this.actionUrl, true);
        oReq.onload = () => {
          this.loading = false;
          if (oReq.status === 200) {
            const res = JSON.parse(oReq.response);
            if (res.code === 0) {
              this.$router.push('signature');
            } else {
              Toast(res.message);
            }
          } else {
            Toast('网络异常');
          }
        };
        this.loading = true;
        oReq.send(oData);
      }
    },
  },
});
