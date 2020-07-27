// pages/Orderdetail/Orderdetail.js
const app = getApp()
var config = require('../../utils/config.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    HTTP: config.HTTP, //图片路径
    getAppInfo: '',//判断手机 底部高度
    product:[],
    address:[]
  },
  tel: function () {
    wx.makePhoneCall({
      phoneNumber: '18688984787',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var getAppInfo = app.globalData.bottom;//获取底部高度
    this.setData({
      getAppInfo: getAppInfo
    })
    wx.showLoading({
      title: '加载中~',
    })
    console.log(options)
    var https = config.http_url;
    var that = this;
    wx.request({ //渲染详情页
      url: https + '/member/orderDetail', //写自己的服务器
      data: {
        orderno: options.orderno
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        "openid": wx.getStorageSync('openid'),
        "skey": wx.getStorageSync('skey'),
      },
      method: "get",
      success: function (res) {
        console.log(res)
        wx.hideLoading()
        console.log(res.data.goods)
        var product = res.data.goods
        that.setData({
          product: product, //详情参数
          address: res.data.address
        })

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