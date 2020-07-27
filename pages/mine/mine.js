// pages/reg/reg.js
const app = getApp();
var openid = wx.getStorageSync('openid')
var config = require('../../utils/config.js')
Page({

  /**
   * 页面的初始数据
   */ 
  data: {
    HTTP: config.HTTP, //图片路径
    clickImg9:true,
    getAppInfo: app.globalData.bottom, //判断手机 底部高度
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    guess_love:[],
    name_list:[],
    navData: [
      {
        name: "首页",  //文本
        current: 0,    //是否是当前页，0不是  1是
        style: 0,     //样式
        ico: '../../img/shouye.png',  //不同图标
        fn: 'gotoIndex'   //对应处理函数
      }, {
        name: "品牌",
        current: 0,
        style: 0,
        ico: '../../img/fenlei.png',
        fn: 'gotoOldGoods'
      }, {
        name: "pk",
        current: 0,
        style: 1,
        ico: '',
        fn: 'gotoPublish'
      }, {
        name: "热榜资讯",
        current: 0,
        style: 0,
        ico: '../../img/reban.png',
        fn: 'gotoRecruit'
      }, {
        name: "我的",
        current: 1,
        style: 0,
        ico: '../../img/wode2.png',
        fn: 'gotoMine'
      },
    ],
    isHide: false,
    userInfo: {},
    nickName:"",
    avatarUrl: "",
    // 导航头组件所需的参数
    nvabarData: {
      showCapsule: 0, //是否显示左上角图标   1表示显示    0表示不显示
      title: '个人中心',//导航栏 中间的标题
      title2: '登录', //导航栏 中间的标题
      white: true, // 是就显示白的，不是就显示黑的。
      white2:false,
      address: 'http://a4.qpic.cn/psb?/V13t2G4i1j2Sqz/rPW3ctGgFEZd5sd.w5ph5kFrVF0NxAOuWpHYsIM*37c!/b/dL8AAAAAAAAA&ek=1&kp=1&pt=0&bo=7gK2AQAAAAADF2k!&tl=1&vuin=1428635858&tm=1572267600&sce=60-2-2&rf=viewer_4', // 加个背景 不加就是没有
      address2: '' // 加个背景 不加就是没有
    },
    // 导航头的高度
    height: app.globalData.height * 2 + 20
  },
  gotoIndex: function () {
    wx.switchTab({
      url: '/pages/index/index',
    });
  },
  gotoPublish: function () {
    var _this = this
    this.setData({
      clickImg9: false
    })
    setTimeout(function () {
      wx.navigateTo({
        url: '/pages/comparison/comparison',
      })
      _this.setData({
        clickImg9: true
      })
    }, 400)
  },
  gotoOldGoods: function () {
    wx.switchTab({
      url: '/pages/classify/classify',
    });
  },
  gotoRecruit: function () {
    wx.switchTab({
      url: '/pages/information/information',
    });
  },
  // 拨打
  tel: function () {
    wx.makePhoneCall({
      phoneNumber: '18688984787',
    })
  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */

  onLoad: function(options) {
    var https = config.http_url;
    var that = this;
    // 查看是否授权
    wx.getSetting({
      success: function(res) {
        if (res.authSetting['scope.userInfo']) {

          wx.setNavigationBarColor({//改变导航背景颜色
            frontColor: '#ffffff',
            backgroundColor: '#ffffff',
          })
          
          //已授权，可以获取用户信息
          wx.getUserInfo({
            success: function(res) {
              console.log(res)
              that.setData({
                nickName: res.userInfo.nickName,//用户名
                avatarUrl: res.userInfo.avatarUrl,//头像
              })
            }
          });
        } else {
            // 用户没有授权
          wx.redirectTo({
            url: '/pages/reg/reg?name=mine',
          })
          // wx.redirectTo(
        // wx.navigateTo({
        //   url: '/reg/reg',
        // })
        }
      }
    })

  },
  // 跳转带参数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../index/index'
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    var https = config.http_url;
    var that = this;
    wx.request({
      url: https + '/member/getData',//写自己的服务器
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        "openid": wx.getStorageSync('openid'),
        "skey": wx.getStorageSync('skey'),
      },
      method: "get",
      success: function (res) {
        console.log(res.data.data)
        wx.setStorageSync('ismember', res.data.data.ismember)
        wx.setStorageSync('memberexpires', res.data.data.memberexpires)
        that.setData({
          name_list: res.data.data
        })
      },
      fail: function () {
        console.log("fail")
      }

    })
  },


  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})