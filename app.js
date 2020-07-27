//app.js
var config = require('utils/config.js')
App({

  onLaunch: function (options) {
    wx.hideTabBar()
    var that = this;
    var https = config.http_url;
    // 展示本地存储能力
    // var logs = wx.getStorageSync('logs') || []
    // logs.unshift(Date.now())
    // wx.setStorageSync('logs', logs)
    wx.checkSession({ //检测当前用户的session_key是否过期
      success: function () { //session_key 未过期，并且在本生命周期一直有效
        console.log("授权未过期")
     
        return;
      },
      fail: function () { //session_key 已经失效，需要重新执行登录流程
        console.log("授权过期")
        wx.navigateTo({
          url: '/pages/reg/reg' //重新授权
        })
      }
    })
    // 判断是否由分享进入小程序
    if (options.scene == 1007 || options.scene == 1008) {
      this.globalData.share = true
    } else {
      this.globalData.share = false
    };
    //获取设备顶部窗口的高度（不同设备窗口高度不一样，根据这个来设置自定义导航栏的高度）
    wx.getSystemInfo({
      success: (res) => {
        this.globalData.height = res.statusBarHeight
        // 获取手机型号
        const model = res.model;
        const modelInclude = ["iPhone X", 'iPhone XR', "iPhone XS", "iPhone XS MAX"];
        var flag = false;//是否X以上机型
        for (let i = 0; i < modelInclude.length; i++) {
          //模糊判断是否是modelInclude 中的机型,因为真机上测试显示的model机型信息比较长无法一一精确匹配
          if (model.indexOf(modelInclude[i]) != -1) {
            flag = true
          }
        }
        if (flag) {
          //如果是这几个机型，设置距离底部的bottom值
          this.globalData.bottom = 25;
        }
      },fail(err) {
        console.log(err);
      }
    })
    
    // 登录
    wx.login({
      success: function (res) {
        console.log(res)
        var code = res.code;
        console.log(code)
        if (res.code) {
          // that.code = res.code;
          // 获取openId并缓存
          wx.request({
            url: https +'/user/getwxopenid',
            data: {
              // appid:'wx032a20f0b276e640',
              jscode:code,
              // grant_type:'authorization_code'
            },
            method: 'get',
            header: {
              "Content-Type": "application/x-www-form-urlencoded",
              "openid": wx.getStorageSync('openid'),
              "skey": wx.getStorageSync('skey'),
            },
            success: function (res){
              console.log(res)
              console.log(res.data)
              // that.openid=res.data.openid
              //1.存用户信息到本地存储
              wx.setStorageSync('memberexpires', res.data.memberexpires)
              wx.setStorageSync('ismember', res.data.ismember)
              wx.setStorageSync('openid', res.data.openid)
              wx.setStorageSync('skey', res.data.skey)
            }
          });
        } else {
          console.log('获取用户登录态失败！' + res.errMsg)
        }
      }
    });

    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        } else {
          // wx.switchTab({
          //   // url: '/pages/reg/reg'
          // })
        }
      }
    })
    // this.share()
  },
  // share: function () { // 全局分享
  //   wx.onAppRoute(res => {
  //     const pages = getCurrentPages()
  //     const view = pages[pages.length - 1]
  //     wx.showShareMenu({
  //       withShareTicket: true
  //     })
  //     view.onShareAppMessage = function () {
  //       return {
  //         // title: '',
  //         path: view.route
  //       }
  //     }
  //   })
  // },
  globalData: {
    share: false,  // 分享默认为false
    height: 0,
    bottom: 0,
  },

  

})