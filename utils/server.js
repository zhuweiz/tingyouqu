var config = require('config.js');
function __args() {
  var setting = {};
  if (arguments.length === 1 && typeof arguments[0] !== 'string') {
    setting = arguments[0];
  } else {
    setting.url = arguments[0];
    if (typeof arguments[1] === 'object') {
      setting.data = arguments[1];
      setting.success = arguments[2];
    } else {
      setting.success = arguments[1];
    }
  }
  if (setting.url.indexOf('http://') !== 0) {
    //http://120.27.18.4/index.php/
    //http://shops.wudhl.com/index.php/WXAPIhttps://www.505coder.com
    setting.url = config.http_url + setting.url;
    console.log(setting.url)
  }
  return setting;
}
function __json(method, setting) {
  setting.method = method;
  setting.header = {
    'content-type': 'application/json'
  };
  wx.request(setting);
}
/*获取当前页url*/
function getCurrentPageUrl() {
  var pages = getCurrentPages()    //获取加载的页面
  var currentPage = pages[pages.length - 1]    //获取当前页面的对象
  var url = currentPage.route    //当前页面url
  return url
}


module.exports = {
  getJSON: function () {
    __json('GET', __args.apply(this, arguments));
  },
  postJSON: function () {
    __json('POST', __args.apply(this, arguments));
  },
  sendTemplate: function (formId, templateData, success, fail) {
    var app = getApp();
    this.getJSON({
      url: '/WxAppApi/sendTemplate',
      data: {
        rd_session: app.rd_session,
        form_id: formId,
        data: templateData,
      },
      success: success,   // errorcode==0时发送成功
      fail: fail
    });
  }
}

