// pages/train/train.js
const app = getApp()
var config = require('../../utils/config.js')
var WxParse = require('../../wxParse/wxParse.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    content: {},
    HTTP: config.HTTP,//图片路径
    getAppInfo: '',//判断手机 底部高度
    train_list: {},
    article: {},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中~',
    })
    console.log(options)
    var id = options.id
    var getAppInfo = app.globalData.bottom; //获取底部高度
    var https = config.http_url;
    const _this = this;
    this.setData({
      getAppInfo: getAppInfo,
      id: options.id
    })
    //渲染培训详情
    wx.request({
      url: https + '/article/content?id=' + id, //写自己的服务器
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        "openid": wx.getStorageSync('openid'),
        "skey": wx.getStorageSync('skey'),
      },
      method: "get",
      success: function (res) {
        wx.hideLoading()
        console.log(res.data.data)
        var arr1 = res.data.data; //从此次请求返回的数据中获取新数组

        _this.setData({
          article: res.data.data.content, //产品介绍
          train_list: arr1 //合并后更新train_list
        })
        WxParse.wxParse('article', 'html', _this.data.article, _this, 5);
      },
      fail: function () {
        console.log("fail")
      }

    })
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