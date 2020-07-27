// pages/register/register.js
const app = getApp()
var openid = wx.getStorageSync('openid')
var config = require('../../utils/config.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    HTTP: config.HTTP, //图片路径
    num: 1,
    cartData:{},
    uhide: 0, //箭头旋转/隐藏显示
    activity:[],//详情数据
    tickets:[],//票券
    pic:'',
    inStock: 0,//商品库存
    minusStatus: 'disable',
     getAppInfo: '',//判断手机 底部高度
     moni:'',
     moni2:''
  },
  ShowState: function (e) {
    console.log(e)
    var that = this;
    var toggleBtnVal = that.data.uhide
    var id = e.currentTarget.dataset.id
    var price = e.currentTarget.dataset.price
    var pic = e.currentTarget.dataset.pic
    console.log(id)
    if (toggleBtnVal == id) {
      that.setData({
        uhide: 0,
        moni: '',
        cid:'',
      })
    } else {
      that.setData({
        uhide: id,
        moni: price,
        cid: id,
         pic: pic
      })
    }
    console.log(that.data.moni)
  },
  //事件处理函数
  /*点击减号*/
  bindMinus: function (e) {
    // var num = this.data.num;
    var foodId = e.currentTarget.dataset.id;
    console.log(foodId);
    // 读取目前购物车数据
    var cartData = this.data.cartData;
    var foodCount = cartData[foodId] ? cartData[foodId] : 0;
    if (foodCount > 0) {
      cartData[foodId] = --foodCount;
    }
    console.log(cartData[foodId]);
    this.setData({
      cartData: cartData,
    })
    console.log(cartData)
  },
  /*点击加号*/
  bindPlus: function (e) {
    console.log(e)
    var num = this.data.num;
    num++;
    var max = e.currentTarget.dataset.max
    var inStock = this.data.inStock
    if (max == 0){
      max = 9999
    }
    // 所点商品id
    var foodId = e.currentTarget.dataset.id;
    console.log(foodId);
    // 读取目前购物车数据
    var cartData = this.data.cartData;
    // 获取当前商品数量
    var foodCount = cartData[ foodId] ? cartData[foodId] : 0;
    // 自增1后存回
 
    if (foodCount >= max) {
      wx.showToast({
        title: '库存不足',
        icon: 'none'
      })
      foodCount = max
      return false
    }
    cartData[foodId] = ++foodCount;
    // 设值到data数据中
    this.setData({
      cartData: cartData,
    });
console.log(cartData)
  },
  gotodingdan(e){
    var moni = this.data.moni
    var moni2 = this.data.moni2
    var cid = this.data.cid
    // if (moni == ''){
    //   wx.showToast({
    //     title: '请选择票券',
    //     icon: 'none',
    //     duration: 1200
    //   })
    //   return false;
    // } 
    console.log(this.data.cartData[cid])
     if (this.data.cartData[cid] == '0'){
      wx.showToast({
        title: '请选择购买数量',
        icon: 'none',
        duration: 1200
      })
      return false;
    }
    var data = JSON.stringify(this.data.cartData);
   
    console.log(wx.getStorageSync('realname'))
    if (wx.getStorageSync('realname') == ''){
      wx.navigateTo({
        url: '../perfect/perfect?id=' + this.data.id + '&num=' + data + '&moni=' + this.data.moni + '&cid=' + cid + '&ture=' + 'ture' + '&nameh=' + '首次购票，请填写您的资料~',
    })
    }else{
      wx.navigateTo({
        url: '../confirm/confirm?id=' + this.data.id + '&num=' + data + '&moni=' + this.data.moni + '&cid=' + this.data.cid ,
    })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var https = config.http_url;
    let _this = this;
    console.log(options)
   wx.showLoading({
     title: '加载中~',
   })
    var getAppInfo = app.globalData.bottom;//获取底部高度
    this.setData({
      getAppInfo: getAppInfo,
      id: options.id,
    })
    console.log(this.data.cartData)
    // console.log(cartData)
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
        var cartData = {}
        var tickets = res.data.data.tickets
        for (var i in tickets){
          // cartData[tickets[i].id]
           cartData[tickets[i].id]=0
        }
        console.log(cartData)
       
        if (res.data.data.tickets!= ''){
          _this.setData({
            inStock: res.data.data.tickets[0].max,
          })
        }
        if (res.data.data.tickets.length > 0){
          _this.setData({
            uhide: res.data.data.tickets[0].id,//票券
            moni: res.data.data.tickets[0].price,
            cid: res.data.data.tickets[0].id,
          })
        }
        _this.setData({
          cartData: cartData,
          activity: res.data.data.activity,//详情参数
          tickets: res.data.data.tickets,//票券
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