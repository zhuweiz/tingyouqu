// pages/confirm/confirm.js
const app = getApp()
var config = require('../../utils/config.js')
var util = require('../../utils/jieliu.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    HTTP: config.HTTP, //图片路径
    getAppInfo: '',//判断手机 底部高度
    num:'',
    id:'',
    cid:'',
    moni:'',
    mini:'',
    activity:[]
  },
  generateOrder: util.throttle(function (){
    var https = config.http_url;
    var that = this
    console.log(that.data.cid)
    wx.request({
      url: https + '/pay/prepay',//后台请求地址
      method: 'POST',
      data: {
        id: that.data.cid,  // 商品id
        from: 2,   //  1:礼品  2:门票  3:会员
        addressid:1,
        number: that.data.num,// 购买数量
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        "openid": wx.getStorageSync('openid'),
        "skey": wx.getStorageSync('skey'),
      },
      success: function (res) {
        // console.log("后台获取数据成功");
        console.log(res);

        // //发起支付
        var orderno = res.data.orderno
        that.param(orderno);
      },
      fail: function (res) {
        console.log("向后台发送数据失败")
      }
    })
  }),
  //支付
  param: function (orderno) {
    console.log(orderno)
    var https = config.http_url;
    var that = this
    wx.request({
      url: https + '/pay/pay',//后台请求地址
      method: 'POST',
      data: {
        orderno: orderno
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        "openid": wx.getStorageSync('openid'),
        "skey": wx.getStorageSync('skey'),
      },
      success: function (res) {
        console.log(res.data);
        var param = { "timeStamp": res.data.data.timeStamp, "package": res.data.data.package, "paySign": res.data.data.paySign, "signType": res.data.data.signType, "nonceStr": res.data.data.nonceStr };
        that.pay(param);
      },
      fail: function (res) {
        console.log("向后台发送数据失败")
      }
    })
  },
  pay: function (param) {
    var that = this;
    //   console.log("发起支付")
    console.log(param)
    wx.requestPayment({
      timeStamp: param.timeStamp,
      nonceStr: param.nonceStr,
      package: param.package,
      signType: param.signType,
      paySign: param.paySign,
      success: function (res) {
        console.log("success");
        console.log(res);
        wx.navigateBack({
          delta: 2
        })
      },
      fail: function (res) {
        console.log("fail")
        console.log(res);

      },
      complete: function (res) {
        console.log("complete");
        console.log(res)

      }
    })

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中~',
    })
    console.log(options)
    var data = JSON.parse(options.num)
    console.log(data)
    for (var item in data) {
      console.log(item)
      if (item == options.cid) {  //item 表示Json串中的属性，如'name' 
        var jValue = data[item];//key所对应的value 
      }
    }
    if (jValue == undefined){
      jValue = 1
    }
    console.log(jValue)
    var https = config.http_url;
    let _this = this;
    var getAppInfo = app.globalData.bottom;
    this.setData({
      getAppInfo: getAppInfo,
      id: options.id,
      cid: options.cid,
      num: jValue,
      moni: options.moni,
      money: jValue * options.moni
    })
    wx.request({//渲染详情页
      url: https + '/activity/ticket', //写自己的服务器
      data: {
        id: options.id
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        "openid": wx.getStorageSync('openid'),
        "skey": wx.getStorageSync('skey'),
      },
      method: "get",
      success: function (res) {
        wx.hideLoading()
        console.log(res.data.data)
        if (res.data.data.tickets != '') {
          _this.setData({
            inStock: res.data.data.tickets[0].max,
          })
        }
        _this.setData({
          activity: res.data.data.activity,//详情参数
          tickets: res.data.data.tickets,//票券
  
          // inStock: res.data.data.tickets[0].max,
        })
        console.log(_this.data.money)
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