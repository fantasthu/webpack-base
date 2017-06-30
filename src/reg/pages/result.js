import Vue from 'vue';
import template from './result.html';

import './result.scss';

export default Vue.extend({
  template,
  data() {
    return {
      info: '提交成功',
      check: false,
    };
  },
  mounted() {
    if (this.$route.params.type && this.$route.params.type === 'success') {
      this.check = false;
      this.info = '审核成功';
    } else {
      this.check = true;
      this.info = '提交成功';
    }

  },
});
