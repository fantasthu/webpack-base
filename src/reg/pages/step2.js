import Vue from 'vue';
import {
  Cell,
  Field,
  Button,
  Toast,
} from 'mint-ui';
import VueSelect from '../components/vue-select/index.js';
import {
  setOpenAcountInfo,
} from '../service/API.js';
import template from './step2.html';

import './step2.scss';


Vue.component(Cell.name, Cell);
Vue.component(Field.name, Field);
Vue.component(Button.name, Button);
Vue.component('v-select', VueSelect);

const familyNum = [{
  label: '1',
  value: 1,
}, {
  label: '2',
  value: 2,
}, {
  label: '3',
  value: 3,
}, {
  label: '4',
  value: 4,
}, {
  label: '5个及5个以上',
  value: 5,
}];

const maritalStatus = [{
  label: '未婚',
  value: 1,
}, {
  label: '已婚',
  value: 2,
}, {
  label: '离异',
  value: 3,
}, {
  label: '丧偶',
  value: 4,
}];

const professionList = [{
  label: '在职',
  value: 1,
}, {
  label: '无业',
  value: 2,
}, {
  label: '学生',
  value: 3,
}, {
  label: '退休',
  value: 4,
}];
const industryList = [{
  label: '金融/银行/保险',
  value: 1,
}, {
  label: '政府/事业机构',
  value: 2,
}, {
  label: '广告公关/媒体/艺术文化',
  value: 3,
}, {
  label: '销售/贸易',
  value: 4,
}, {
  label: '计算机/互联网/通信/电子技术',
  value: 5,
}, {
  label: '生产制造/物流运输',
  value: 6,
}, {
  label: '医药/化工',
  value: 7,
}, {
  label: '建筑/房地产',
  value: 8,
}, {
  label: '教育/法律',
  value: 9,
}, {
  label: '餐饮/娱乐/美容',
  value: 10,
}, {
  label: '其他',
  value: 11,
}];
const assetsList = [{
  label: '10万元人民币以下',
  value: 1,
}, {
  label: '10万-20万人民币',
  value: 2,
}, {
  label: '20万-30万人民币',
  value: 3,
}, {
  label: '30万-50万人民币',
  value: 4,
}, {
  label: '50万-100万人民币',
  value: 5,
}, {
  label: '100万-500万人民币',
  value: 6,
}, {
  label: '500万-1000万人民币',
  value: 7,
}, {
  label: '1000万人民币以上',
  value: 8,
}];
const objectivesList = [{
  label: '资产增值',
  value: 1,
}, {
  label: '投机',
  value: 2,
}, {
  label: '套利',
  value: 3,
}, {
  label: '对冲',
  value: 4,
}];
const expList = [{
  label: '1年以下',
  value: 1,
}, {
  label: '1年-2年',
  value: 2,
}, {
  label: '2年-3年',
  value: 3,
}, {
  label: '3年-4年',
  value: 4,
}, {
  label: '4年-5年',
  value: 5,
}, {
  label: '5年-10年',
  value: 6,
}, {
  label: '10年以上',
  value: 7,
}];

export default Vue.extend({
  template,
  data() {
    return {
      userToken: '',
      name: '',
      sfzzmnum: '',
      jtcynum: undefined,
      hyzk: undefined,
      profession: undefined,
      industry: undefined,
      assets: undefined,
      tzmb: undefined,
      tzjy: undefined,
      familyNum,
      maritalStatus,
      professionList,
      industryList,
      assetsList,
      objectivesList,
      expList,
      loading: false,
    };
  },
  mounted() {
    if (this.$root.userToken) {
      this.userToken = this.$root.userToken;
    } else {
      this.$router.push('index');
    }
  },
  methods: {
    nextStep() {
      if (this.verifyFields()) {
        this.loading = true;
        setOpenAcountInfo({
          userToken: this.userToken,
          name: this.name,
          sfzzmnum: this.sfzzmnum,
          jtcynum: this.jtcynum,
          hyzk: this.hyzk,
          profession: this.profession,
          industry: this.industry,
          assets: this.assets,
          tzmb: this.tzmb,
          tzjy: this.tzjy,
        }).then((res) => {
          this.loading = false;
          if (res.code === 0) {
            this.$router.push('idcard');
          } else {
            Toast(res.message);
          }
        });
      }
    },
    verifyFields() {
      if (this.name === '') {
        Toast('请输入姓名');
        return false;
      }
      if (this.sfzzmnum === '') {
        Toast('请输入身份证号');
        return false;
      }
      console.log(this.jtcynum);
      if (typeof this.jtcynum === 'undefined' || this.jtcynum === null) {
        Toast('请选择家庭成员人数');
        return false;
      }
      if (typeof this.hyzk === 'undefined' || this.hyzk === null) {
        Toast('请选择婚姻状况');
        return false;
      }
      if (typeof this.profession === 'undefined' || this.profession === null) {
        Toast('请选择职业');
        return false;
      }
      if (typeof this.industry === 'undefined' || this.industry === null) {
        Toast('请选择行业');
        return false;
      }
      if (typeof this.assets === 'undefined' || this.assets === null) {
        Toast('请选择总资产净值');
        return false;
      }
      if (typeof this.tzmb === 'undefined' || this.tzmb === null) {
        Toast('请选择投资目标');
        return false;
      }
      if (typeof this.tzjy === 'undefined' || this.tzjy === null) {
        Toast('请选择投资经验');
        return false;
      }
      return true;
    },
  },
});
