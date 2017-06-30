/**
 * 数据接口
 */
import {
  get,
  post,
} from './request.js';
import base64 from 'base-64';

// const qhHost = 'https://user.qihuoniu.com';
const payHost = 'https://pay.intechtrading.com';
const userHost = 'https://user.intechtrading.com';
/**
 * 获取代理信息
 * @param {
 * pid: 代理Id
 * } payload
 */
export function getProxyInfo(payload) {
  return get(`${payHost}/Proxy/info.ashx`, {
    ...payload,
    packtype: 784,
  });
}
/**
 * 获取验证码
 * @param {*手机号} mobile
 */
export function getVerifyCode(payload) {
  // https://user.intechtrading.com/api/getverifycode.ashx
  const params = {
    ...payload,
    mobile: base64.encode(payload.mobile),
    packtype: 784,
    smsType: 21,
  };
  return post(`${userHost}/api/getverifycode.ashx`, params);
}
/**
 * 用户注册
 * @param {
 * mobile: 手机号，
 * code: 验证码
 * password: 密码,
 * proxyid: 代理id,
 * } payload
 */
export function register(payload) {
  const params = {
    ...payload,
    mobile: base64.encode(payload.mobile),
    packtype: 784,
    version: '1.0.0',
  };
  return post(`${userHost}/Api/register.ashx`, params);
}
/**
 * 上传用户信息
 * @param {*
 * name	姓名
 * sfzzmnum	身份证号码
 * jtcynum 家庭成员个数
 * hyzk	婚姻状况
 * profession	职业
 * industry	行业
 * assets	资产总净值
 * tzmb	投资目标
 * tzjy	投资经验
 * } payload
 */
export function setOpenAcountInfo(payload) {
  const params = {
    ...payload,
    action: 'basic',
    packtype: 784,
  };
  return post(`${userHost}/api/setOpenAcountInfo.ashx`, params);
}
/**
 * @param {*
 * proxyid: 代理Id
 * signed: 签名图片base64
 * signame: 寰盈证券员工名
 * userToken: 用户Token
 * } payload
 */
export function uploadSign(payload) {
  const params = {
    ...payload,
    action: 'setsigned',
    packtype: 784,
  };
  return post(`${userHost}/api/setOpenAcountInfo.ashx`, params);
}
/**
 * 判断手机号是否注册
 */
export function checkMobile(args) {
  return post(`${userHost}/api/checkMobile.ashx?version=0.0.0&packtype=784&proxyid=1`, args);
}
/**
 * 登录
 */
export function login(arg) {
  return post(`${userHost}/api/login.ashx`, arg);
}
/**
 * 查询账户状态
 */
export function getUserAccountStatu(payload) {
  const params = {
    ...payload,
    action: 'getUserAccountStatu',
    packtype: 784,
    version:'1.0.0',
  };
  return post(`${userHost}/api/getUserAccountStatu.ashx`, params);
}
