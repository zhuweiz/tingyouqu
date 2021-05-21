// pages/pinpai/pinpai.js
const app = getApp()
var config = require('../../utils/config.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pinpai_list: [], //测试
    showPy: '#',
    scrollTopId: '',
    flag: true, //遮罩
    hidden: true,
    id: '',
    name: '',
    HTTP: config.HTTP, //图片路径
  },
  // goSearch: function (e) {
  //   var https = config.http_url;
  //   console.log(e)
  //   var that = this;
  //   var formData = e.detail.value;
  //   wx.showLoading({
  //     title: '加载中',
  //   })
  //   if (formData) {
  //     wx.request({
  //       url: https + '/search/brand',
  //       data: {
  //         keyword: formData,
  //       },
  //       header: {
  //         "Content-Type": "application/x-www-form-urlencoded",
  //         'openid': wx.getStorageInfoSync("openid"),
  //         'skey': wx.getStorageInfoSync("skey"),
  //       },
  //       method: "get",
  //       success: function (res) {
  //         console.log(res.data)
  //         var searchShow = res.data.data
  //         that.setData({
  //           pinpai_list: searchShow,
  //           formData: formData
  //         })
  //         wx.hideLoading();
  //         if (res.data.data == '') {
  //           that.setData({
  //             flag: false,//遮罩
  //           })
  //         } else {
  //           that.setData({
  //             flag: true,//遮罩
  //           })
  //         }
  //       }
  //     })
  //   } else {

  //     wx.showToast({
  //       title: '输入不能为空',
  //       icon: 'none',
  //       duration: 1500
  //     })

  //   }

  // },
  //回退
  selectCity: function(e) {
    // wx.redirectTo({
    //   url: "../dealer/dealer?name=" + name + '&id=' + this.data.brandId
    // })
  },

  //获取文字信息
  getPy: function(e) { //点击跳转指定位置
    console.log(e)
    this.setData({
      hidden: false,
      showPy: e.target.id,
    })
  },
  //触发全部开始选择
  tStart: function() {
    this.setData({
      hidden: false
    })
  },

  //触发结束选择
  tEnd: function() {
    this.setData({
      hidden: true,
      scrollTopId: this.data.showPy
    })
  },

  getdatalist: function() {
    const _this = this;
    var https = config.http_url;
    wx.showLoading({
      title: '加载中~',
    })
    wx.request({
      url: https + '/brand/listByCountry?id=' + _this.data.id, //写自己的服务器
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        "openid": wx.getStorageSync('openid'),
        "skey": wx.getStorageSync('skey'),
      },
      method: "get",
      success: function(res) {
        wx.hideLoading()
        console.log(res.data.data)
        if (res.data.data == '') {
          _this.setData({
            flag: false, //遮罩
          })
        } else {
          _this.setData({
            flag: true, //遮罩
          })
        }
        _this.setData({
          pinpai_list: res.data.data, //其它品牌
        })

      },
      fail: function() {
        console.log("fail")
      }

    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    const _this = this;
    var id = options.id
    var name = options.name
    _this.setData({
      id: id,
      name: name,
    })
    _this.getdatalist();
    wx.setNavigationBarTitle({
      title: (name != '' ? name : '')
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