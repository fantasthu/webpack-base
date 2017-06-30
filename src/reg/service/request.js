import fetch from 'fetch-polyfill2';
import qs from 'qs';

/**
 * get请求
 */
export function get(url, payload) {
  let req;
  if (typeof payload !== 'undefined') {
    if (url.indexOf('?') > -1) {
      req = `${url}&${qs.stringify(payload)}`;
    } else {
      req = `${url}?${qs.stringify(payload)}`;
    }
  } else {
    req = url;
  }
  return fetch(req).then(response => response.json());
}
 /**
  * post请求
  */
export function post(url, payload) {
  const opts = {
    method: 'POST',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: qs.stringify(payload),
  };
  return fetch(url, opts).then(response => response.json());
}
