// pages/member/member.js
const app = getApp();
var config = require('../../utils/config.js')
var util = require('../../utils/jieliu.js')
Page({
  data: {
    HTTP: config.HTTP, //图片路径
    getAppInfo: '', //判断手机 底部高度
    vip_list:[],
    name_list:[],
    equity:'',
    ismember: wx.getStorageSync('ismember'),
    memberexpires: wx.getStorageSync('memberexpires'),
    // 导航头组件所需的参数
    from: '0',
    id:'',
    nvabarData: {
      showCapsule: 1, //是否显示左上角图标   1表示显示    0表示不显示
      title: '会员中心', //导航栏 中间的标题

      white: true, // 是就显示白的，不是就显示黑的。
      address: 'http://a1.qpic.cn/psc?/V13t2G4i0uprYL/6srbhn710T4Nam1Tpgw9AzgiyX3M8dlfGpdxI39*adQvZOME6j0x96cDgK9pAaktXPsdPQgopmQfCKbqIuNXTw!!/b&ek=1&kp=1&pt=0&bo=7gLbAQAAAAADFwQ!&tl=1&vuin=1428635858&tm=1590757200&sce=60-2-2&rf=viewer_4' // 加个背景 不加就是没有
    },
    // 导航头的高度
    height: app.globalData.height * 2 + 20
  },
  clickTAO(e) {
    var that = this;
    var toggleBtnVal = that.data.from
    var num = e.currentTarget.dataset.num
    var id = e.currentTarget.dataset.id
    that.setData({
      from: num,
      id:id
    })
  },


  generateOrder: util.throttle(function (){
    var https = config.http_url;
    var that = this
    console.log(that.data.id)
    wx.request({
      url: https + '/pay/prepay',//后台请求地址
      method: 'POST',
      data: {
        id: that.data.id,  // 商品id
        from:3,
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
        that.setData({
          orderno: orderno
        })
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
        console.log(res);
        var orderno = that.data.orderno
        console.log(orderno);
        wx.navigateBack({
          delta: 1
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




  methods: {
    // 返回上一页面
    _navback() {
      wx.navigateBack()
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var getAppInfo = app.globalData.bottom; //获取底部高度
    var https = config.http_url;
    const _this = this;
    this.setData({
      getAppInfo: getAppInfo,
      // id: options.id
    })
    //渲染城市列表页
    wx.request({
      url: https + '/member/priceList', //写自己的服务器
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        "openid": wx.getStorageSync('openid'),
        "skey": wx.getStorageSync('skey'),
      },
      method: "get",
      success: function (res) {
        console.log(res.data)
        _this.setData({
          equity: res.data.equity,
          vip_list: res.data.data,
          id: res.data.data[0].id,
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