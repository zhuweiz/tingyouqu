// pages/activity/activity.js
const app = getApp()
var openid = wx.getStorageSync('openid')
var config = require('../../utils/config.js')
var WxParse = require('../../wxParse/wxParse.js');
Page({

  /** 
   * 页面的初始数据
   */
  data: {
    content:[],
    HTTP: config.HTTP, //图片路径
    getAppInfo: '',//判断手机 底部高度
    activity:[],//详情数据
    shouchang_id:'',//收藏id
    collection: '',//收藏
    qd:''
  },
  //收藏功能
  haveSave(e) {
    var https = config.http_url;
    var _this = this
    console.log(this.data.shouchang_id)
    var shouchang_id = this.data.shouchang_id
    console.log(shouchang_id)
    if (!this.data.collection == true) {
      wx.request({
        url: https + '/member/collection', //写自己的服务器
        data: {
          from: 2,
          id: shouchang_id,
        },
        header: {
          "Content-Type": "application/x-www-form-urlencoded",
          "openid": wx.getStorageSync('openid'),
          "skey": wx.getStorageSync('skey'),
        },
        method: "get",
        success: function (res) {
          console.log(res)
          _this.setData({
            collection:1
          })

        },
        fail: function () {
          console.log("fail")
        }

      })
      wx.showToast({
        title: '已收藏',
      });
    } else {
      wx.request({
        url: https + '/member/collectionDel', //写自己的服务器
        data: {
          id: shouchang_id,    // 商品id
          from: 2 // 来源 1:产品  2:活动  3:礼品
        },
        header: {
          "Content-Type": "application/x-www-form-urlencoded",
          "openid": wx.getStorageSync('openid'),
          "skey": wx.getStorageSync('skey'),
        },
        method: "post",
        success: function (res) {
          _this.setData({
            collection: 0
          })
          wx.showToast({
            title: '已取消收藏',
          });

        },
        fail: function () {
          console.log("fail")
        }
      })
      wx.showToast({
        title: '已取消收藏',
      });
    }
    this.setData({
      isClick: !this.data.isClick
    })
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
  //跳转首页
  gotoindex: function (options){
    wx.reLaunch({
      url: '/pages/index/index',

    })
  },
  baoming(e){//跳转支付票券页面
    console.log(e)
    var id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '../register/register?id=' + id,
    })
  },
  fengxiang(e){
    this.onShareAppMessage()
  },
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
    }
    return {
      title: '转发',
      path: '/pages/activity/activity',
      success: function (res) {
        console.log('成功', res)
      }
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var https = config.http_url;
    let _this = this;
    wx.showLoading({
      title: '加载中~',
    })
    var getAppInfo = app.globalData.bottom;
    var shouchang_id = options.id
    _this.setData({
      getAppInfo: getAppInfo,
      qd: options.qd
    })
    wx.request({//渲染详情页
      url: https + '/activity/detail', //写自己的服务器
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
        console.log(res)
        if (res.data.data.length < 1) {
          wx.showToast({
            title: '暂无该产品~',
            icon: "none"
          })
        }
        var content = res.data.data.content.replace(/\<img/gi, '<img style="max-width:100%;height:auto" ')
        _this.setData({
          activity: res.data.data,//详情参数
          collection: res.data.data.collection,//收藏
          shouchang_id: shouchang_id,
          train_content: content,
        })
        WxParse.wxParse('article', 'html', _this.data.train_content, _this, 5);
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
    if (this.data.qd == 'qd') {
      wx.switchTab({
        url: '/pages/index/index'
      })
    }
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