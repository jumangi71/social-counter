// TODO: remove jquery
// TODO: elements classes set optional

const $ = require('jquery');

let currentUrl;
let counters = {
  vk: {
    url: 'http://vk.com/share.php?act=count&index=1&url=',
    el: document.querySelectorAll('share-vk-count')
  },
  ok: {
    url: 'http://ok.ru/dk?st.cmd=extOneClickLike&uid=odklocs0&ref=',
    el: document.querySelectorAll('share-ok-count')
  },
  fb: {
    url: 'https://api.facebook.com/method/links.getStats?format=json&urls=',
    el: document.querySelectorAll('share-fb-count')
  }
};

module.exports = {
  utmString: (source, action) => {
    return encodeURIComponent(`?utm_source=${source}&utm_medium=${action}`);
  },
  renderCount: (el, count) => {
    [].forEach.call(el, function(val) {
      let before = parseInt(val.textContent, 10) || 0;
      if (count > 0) val.textContent = (before + count);
    });
  },
  getCounts: (url, type, utm, callback) => {
    $.ajax({
      url: url + currentUrl + ((utm) ? utm : ''),
      dataType: (type) ? type : 'json',
      method: 'GET',
      async: true,
      success: (res) => {
        if (callback && typeof callback === 'function') callback(res);
      }
    });
  },
  init: function(url) {
    currentUrl = encodeURIComponent(url + window.location.pathname);

    window.ODKL = {
      updateCountOC: (a, b, n) => {
        this.renderCount(counters.ok.el, n);
      }
    };
    window.VK = {
      Share: {
        count: (i, n) => {
          this.renderCount(counters.vk.el, n);
        }
      }
    };
    let fbCallback = (r) => {
      if (r) { this.renderCount(counters.fb.el, r[0].share_count); }
    };
    this.getCounts(counters.ok.url, 'jsonp', this.utmString('ok', 'socialsharing'));
    this.getCounts(counters.vk.url, 'jsonp', this.utmString('vk', 'socialsharing'));
    this.getCounts(counters.fb.url, 'json', this.utmString('fb', 'socialsharing'), fbCallback);
  }
};
