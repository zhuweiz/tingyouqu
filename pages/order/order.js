// pages/order/order.js
const app = getApp()
var config = require('../../utils/config.js')
var util = require('../../utils/jieliu.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    HTTP: config.HTTP, //图片路径
    num: 1,
    isHide: '',
    site: "请填写收货地址",
    address: '', //默认地址
    minusStatus: 'disable',
    product: [], //详情
    money: '',
    price: '',
    content:'',//备注
    addressid:'',
    id:'',
    orderno:'',
    getAppInfo: '' //判断手机 底部高度
  },
  //事件处理函数
  /*点击减号*/
  bindMinus: function() {
    var num = this.data.num;
    var price = this.data.price;
    if (num > 1) {
      num--;
    }
    var minusStatus = num > 1 ? 'normal' : 'disable';
    this.setData({
      num: num,
      money: num * price + ".00",
      minusStatus: minusStatus
    })
    console.log(num)
  },
  /*点击加号*/
  bindPlus: function() {
    var num = this.data.num;
    var price = this.data.price;
    num++;
    var minusStatus = num > 1 ? 'normal' : 'disable';
    this.setData({
      num: num,
      money: num * price + ".00",
      minusStatus: minusStatus
    })
  },
  handlecontentChange(e) { //填写需求
    this.data.content = e.detail.value;
    console.log(this.data.content)
  },
  /*输入框事件*/
  // bindManual: function (e) {
  //   var num = e.detail.value;
  //   var minusStatus = num > 1 ? 'normal' : 'disable';
  //   this.setData({
  //     num: num,

  //     minusStatus: minusStatus
  //   })
  // },
  generateOrder:util.throttle(function (){
    var https = config.http_url;
    var that = this
    if (that.data.addressid == '' || that.data.addressid == '请填写收货地址'){
      wx.showToast({
        title: '请填写收货地址',
        icon: 'none',
        duration: 1200
      })
      return false;
    }
    wx.request({
      url: https + '/pay/prepay',//后台请求地址
      method: 'POST',
      data: {
        id: that.data.id,  // 商品id
        from:1,   //  1:礼品  2:门票  3:会员
        addressid: that.data.addressid, // 收获地址
        number: that.data.num,// 购买数量
        content: that.data.content  // 备注信息
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        "openid": wx.getStorageSync('openid'),
        "skey": wx.getStorageSync('skey'),
      },
      success: function (res) {
        // console.log("后台获取数据成功");
        console.log(res.data);
      
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
  param: function (orderno){
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
        that.setData({
          orderno: orderno
        })
      },
     
      fail: function (res) {
        console.log("向后台发送数据失败")
      }
    })
  },
  pay: function(param) {
    var that = this;
  //   console.log("发起支付")
    console.log(param)
    wx.requestPayment({
      timeStamp: param.timeStamp,
      nonceStr: param.nonceStr,
      package: param.package,
      signType: param.signType,
      paySign: param.paySign,
      success: function(res) {
        console.log(res);
        var orderno = that.data.orderno
        console.log(orderno);
        wx.redirectTo({
          url: '/pages/Orderdetail/Orderdetail?orderno=' + orderno
      })
      },
      fail: function(res) {
        console.log("fail")
        console.log(res);

      },
      complete: function(res) {
        console.log("complete");
        console.log(res)

      }
    })

  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.getSetting({
      success: function (res) {
        if (res.authSetting['scope.userInfo']) {
        } else {
          // 用户没有授权
          wx.redirectTo({
            url: '/pages/reg/reg',
          })
        }
      }
    })
    console.log(options)
    var https = config.http_url;
    var that = this;
    var getAppInfo = app.globalData.bottom; //获取底部高度
    this.setData({
      getAppInfo: getAppInfo,
      id: options.id
    })
    wx.request({ //渲染详情页
      url: https + '/gift/signUp', //写自己的服务器
      data: {
        id: options.id
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        "openid": wx.getStorageSync('openid'),
        "skey": wx.getStorageSync('skey'),
      },
      method: "get",
      success: function(res) {
        var product = res.data.data.product
        console.log(product)
        that.setData({
          product: product, //详情参数
          money: res.data.data.product.price,
        })

      },
      fail: function() {
        console.log("fail")
      }

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
      url: https + '/member/address', //写自己的服务器
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        "openid": wx.getStorageSync('openid'),
        "skey": wx.getStorageSync('skey'),
      },
      method: "get",
      success: function(res) {
        console.log(res.data.data)
        if (res.data.data.length > 0) {
          that.setData({
            address: res.data.data[0].city + res.data.data[0].region + res.data.data[0].street + res.data.data[0].address,
            addressid: res.data.data[0].id,
            isHide: false
          })
        } else {
          that.setData({
            isHide: true
          })
        }
      },
      fail: function() {
        console.log("fail")
      }

    })
    console.log(that.data.isHide)

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