// pages/Gift_details/Gift_details.js
const app = getApp()
var config = require('../../utils/config.js')
var WxParse = require('../../wxParse/wxParse.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isss: false,
    HTTP: config.HTTP,//图片路径
    getAppInfo: '',//判断手机 底部高度
    params: [],//礼品参数
    product:[],//详情参数
    guess_love:[],//猜你喜欢
 
    shouchang_id: [],
    collection:'',
    id:'',
    qd:''
  },
  gotogoumai(e){
    var id = this.data.id
    wx.navigateTo({
      url: '../order/order?id='+id,
    })
  },
  //收藏功能
  haveSave(e) {
    var https = config.http_url;
    var _this = this
    console.log(this.data.shouchang_id)
    var shouchang_id = this.data.shouchang_id
    if (!this.data.collection == true) {
      wx.request({
        url: https + '/member/collection', //写自己的服务器
        data: {
          id: shouchang_id,
          from: 3
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
            collection: 1
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
          from: 3 // 来源 1:产品  2:活动  3:礼品
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
  },
  previewImg: function (e) {//点击全屏预览图片
    console.log(e.currentTarget.dataset.index);
    var index = e.currentTarget.dataset.index;
    var HTTP = this.data.HTTP
    var imgArr = this.data.product.images;
    var imgArr3 = []
    for (var i = 0; i < imgArr.length; i++) {
      var imgArr2 = HTTP + imgArr[i].split(",")
      imgArr3[i] = imgArr2
      console.log(imgArr2)
    }
    wx.previewImage({
      current: imgArr3[index],     //当前图片地址
      urls: imgArr3,               //所有要预览的图片的地址集合 数组形式
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({//显示 loading 提示框
      title: '加载中...',
    })
    var https = config.http_url;
    const _this = this;
    var getAppInfo = app.globalData.bottom;
    this.setData({
      getAppInfo: getAppInfo,
      id: options.id,
      qd: options.qd
    })
    console.log(options)
    var shouchang_id = options.id
    wx.request({//渲染详情页
      url: https + '/gift/detail', //写自己的服务器
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
        console.log(res)
        wx.hideLoading();
        var params = res.data.data.params
        var product = res.data.data.product[0]
        var content = res.data.data.product[0].content.replace(/\<img/gi, '<img style="max-width:100%;height:auto" ')
        if (Object.keys(params).length === 0) {
  
          _this.setData({
            isss: true
          })
        }
  
        _this.setData({
          params: params,//礼品参数
          product: product,//详情参数
          train_content: content,
          collection: res.data.data.collection,//收藏
          shouchang_id: shouchang_id,
        })
        WxParse.wxParse('article', 'html', _this.data.train_content, _this, 5);
      },
      fail: function () {
        console.log("fail")
      }

    })

    wx.request({//猜你喜欢
      url: https + '/gift/guess',//写自己的服务器
      data: {
        id: options.id,
        page:1,  // 页码
        pagenum:4  // 数量

      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: "get",
      success: function (res) {
        console.log(res.data.data)
        var guess_love = res.data.data.list
        _this.setData({
          guess_love: guess_love
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