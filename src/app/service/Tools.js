module.exports = {
  qsearch(key) {
    let res;
    let ss;
    let i;
    let sss;
    let s = location.search;
    if (s) {
      s = s.substr(1);
      if (s) {
        ss = s.split('&');
        for (i = 0; i < ss.length; i += 1) {
          sss = ss[i].split('=');
          if (sss && sss[0] === key) {
            res = sss[1];
          }
        }
      }
    }
    return res;
  },
};
