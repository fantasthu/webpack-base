import Vue from 'vue';
import template from './index.html';

import './style.scss';

export default Vue.extend({
  template,
  props: {
    options: {
      type: Array,
      required: true,
      default: () => [],
    },
    value: {
      default: () => '',
    },
  },
  data() {
    return {
      model: '',
    };
  },
  mounted() {
    this.model = this.value;
  },
  watch: {
    model(model) {
      this.$emit('input', model);
    },
    value(value) {
      this.model = value;
    },
  },
});
