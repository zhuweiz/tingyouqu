// pages/contrast/contrast.js
const app = getApp();
var config = require('../../utils/config.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    HTTP: config.HTTP,//图片路径
    params:[],
    products:[],
    msg:'',
    show:false,
    productsParams:[],
    scroll_left:0,
    // 导航头组件所需的参数
    nvabarData: {
      showCapsule: 1, //是否显示左上角图标   1表示显示    0表示不显示
      title: '', //导航栏 中间的标题
      // title2: 'P', //导航栏 中间的标题
      // title3: 'K', //导航栏 中间的标题
      white: false, // 是就显示白的，不是就显示黑的。
      address: '', // 加个背景 不加就是没有
      img:'../../img/PKK2.png',
    },
    // 导航头的高度
    height: app.globalData.height * 2 + 20
  },
  scroll: function (e) {
    // this.scroll_left = e.detail.scrollLeft
    // this._scrollTop = e.detail.scrollTop
    this.setData({
      scroll_left: e.detail.scrollLeft
    })
  },
  getUserInfo(event) {
    console.log('46456')
    wx.redirectTo({
      url: '../member/member',
    })
  },
  onClose2() {
    wx.navigateBack({
      delta: 1
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
    console.log(options.id)
    var https = config.http_url;
    const _this = this;
    wx.request({
      url: https + '/product/compare', //写自己的服务器
      data:{
        ids: options.id
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        "openid": wx.getStorageSync('openid'),
        "skey": wx.getStorageSync('skey'),
      },
      method: "get",
      success: function (res) {
        wx.hideLoading()
        console.log(res)
        if (res.data.code != 0){
          _this.setData({
            msg: res.data.msg,
            show:true
          })
          return;
        }
        var products = res.data.data.products //新品推荐
        var params = res.data.data.params //新品推荐
        var productsParams = {};
        for (var i in res.data.data.params) {
          console.log(i);
          productsParams[i] = []
          for (var j = 0, len = res.data.data.products.length; j < len; j++) {
            // console.log(typeof(res.data.data.products[j]['params'][i]));
            // productsParams[i].push(typeof (res.data.data.products[j]['params'][i]) == "undefined"  ? '--' : res.data.data.products[j]['params'][i])
            productsParams[i].push(res.data.data.products[j]['params'][i])
          }
        }
 
        console.log(productsParams)
       

        //console.log(products)
        _this.setData({
          params: res.data.data.params,
          products: res.data.data.products,
          productsParams: productsParams,
        })
       
        // console.log(products)
        // _this.setData({
        //   params: res.data.data.params,
        //   products: res.data.data.products
        // })

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