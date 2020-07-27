// pages/Ticket_details/Ticket_details.js
var config = require('../../utils/config.js')
var drawQrcode = require('../../utils/weapp.qrcode.js')
var qrcode;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentTab: 0,
    activity: {},
    text: '6665',
    coupon_code: '',
    ticket: {}, //详情参数
    user: {},
    code:''
  },
  //地图导航
  navigation: function (e) {
    var _this = this
    var longitude = Number(_this.data.activity.longitude)
    var latitude = Number(_this.data.activity.latitude)
    var name = _this.data.activity.address
    console.log(latitude)
    wx.openLocation({
      latitude: latitude,
      longitude: longitude,
      scale: 15,
      name: name,
      // address: '(常兴店)'
    })
  },

  bindChange: function(e) {
    console.log(e)
    console.log(e.detail.current)
    console.log(e.detail.currentItemId)
    var id = e.detail.currentItemId
    var that = this;
    var coupon = id.match(/coupon=(.*)&p/)[1];//取 id=后面所有字符串
    console.log(coupon)
    that.setData({
      currentTab: e.detail.current,
      code: coupon
    });
    drawQrcode({
      width: 150,
      height: 150,
      canvasId: e.detail.currentItemId,
      // ctx: wx.createCanvasContext('myQrcode'),
      text: e.detail.currentItemId,
    })
  },
  bbcc: function(e) {
    console.log(e)
  },
  draw: function(e) {
    var _this = this
    var text = this.data.text
    var coupon_code = this.data.coupon_code
    console.log(coupon_code)
    drawQrcode({
      width: 150,
      height: 150,
      canvasId: coupon_code,
      // ctx: wx.createCanvasContext('myQrcode'),
      text: coupon_code,
    })

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options)
    console.log(this.data.currentTab)
    var https = config.http_url;
    var that = this;
    wx.request({ //渲染详情页
      url: https + '/member/ticketDetail', //写自己的服务器
      data: {
        orderno: options.orderno
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        "openid": wx.getStorageSync('openid'),
        "skey": wx.getStorageSync('skey'),
      },
      method: "post",
      success: function(res) {
        console.log(res)
        console.log(res.data.data.activity)
        var code = res.data.data.ticket.coupon_code
        var coupon = []
        for (var i in code){
          console.log(code[i].code)
           coupon = code[i].code.match(/coupon=(.*)&/)[1];//取 id=后面所有字符串
          code[i]['coupon'] = coupon
        }
        console.log(coupon)
        console.log(res.data.data.ticket.coupon_code[0].code+"&id=0")
        that.setData({
          activity: res.data.data.activity,
          ticket: res.data.data.ticket, //详情参数
          user: res.data.data.user,
          coupon_code: res.data.data.ticket.coupon_code[0].code + "&id=0",
          code: code[0].coupon
        })
        that.draw()
      },
      fail: function() {
        console.log("fail")
      }

    })

    // qrcode = new drawQrcode({
    //   width: 160,
    //   height: 160,
    //   canvasId: 'myQrcode',
    //   // ctx: wx.createCanvasContext('myQrcode'),
    //   text: 'https://github.com/yingye',
    // })
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