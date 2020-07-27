// pages/authorization/authorization.js
const app = getApp();
var openid = wx.getStorageSync('openid')
var config = require('../../utils/config.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    HTTP: config.HTTP, //图片路径
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    name:[],
  },

  bindgetuserinfo: function (e) {
    console.log(e)
    var https = config.http_url;
    if (e.detail.userInfo) {
      //用户按了允许授权按钮
      var that = this;
      // 获取到用户的信息了，打印到控制台上看下
      console.log(e.detail.userInfo);
      wx.request({
        url: https + '/user/register',//写自己的服务器
        header: {
          "Content-Type": "application/x-www-form-urlencoded",
          "openid": wx.getStorageSync('openid'),
          "skey": wx.getStorageSync('skey'),
        },
        method: "POST",
        data: {
          nickname: e.detail.userInfo.nickName,//用户名
          avatarurl: e.detail.userInfo.avatarUrl,//头像
          gender: e.detail.userInfo.gender,//性别 1为男 2为女
          city: e.detail.userInfo.city,//城市
          country: e.detail.userInfo.country,//国家
          province: e.detail.userInfo.province,//省份
          language: e.detail.userInfo.language,//语言
          openid: openid
        },
        success: function (res) {
          console.log(res)
          that.setData({
            nickName: e.detail.userInfo.nickName,//用户名
            avatarUrl: e.detail.userInfo.avatarUrl,//头像
          })
          if (that.data.name != undefined){
            wx.switchTab({
              url:'../mine/mine'
            })
          }else{
            wx.navigateBack({
              delta: 1
            })
          }
       
        },
        fail: function () {
          console.log("fail")
        }

      })
      wx.setStorageSync('city', e.detail.userInfo.city)


    } else {
      //用户按了拒绝按钮
      wx.showModal({
        title: '提示',
        content: '请您先授权~',
        showCancel: false,
        confirmText: '返回授权',
        success: function (res) {
          // 用户没有授权成功，不需要改变 isHide 的值
          if (res.confirm) {
            console.log('用户点击了“返回授权”');
          }
        }
      });
    }
  },
  // 跳转带参数
  // bindViewTap: function () {
  //   wx.navigateTo({
  //     url: '../index/index'
  //   })
  // },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.setData({
      name: options.name
    })
    console.log(this.data.name)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    // if (this.data.name != undefined) {
    //   wx.switchTab({
    //     url: '../index/index'
    //   })
    // }
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})