// pages/indent/indent.js
const app = getApp()
var config = require('../../utils/config.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    HTTP: config.HTTP, //图片路径
    page: 1,//页数
    isHide: '',
    pagenum: 4,//一页的数据量
    list:[]
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
    var https = config.http_url;
    var _this = this;
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: https + '/member/ordersList', //写自己的服务器
      data: {
        page: _this.data.page,
        pagenum: _this.data.pagenum, //每页显示条数
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
        var a = []
        var List = res.data.data
        for (var i = 0; i < List.length; i++) {
          a = List[i].images.split(',')[0]
          List[i]['List_img'] = a
          // console.log(a)
        }
        if (res.data.data.length > 0) {
          _this.setData({
            list: res.data.data,
            isHide: false
          })
        } else {
          _this.setData({
            isHide: true
          })
        }
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
    var https = config.http_url;
    let _this = this;
 
    var page = _this.data.page + 1; //获取当前页数并+1
    _this.setData({
      page: page, //更新当前页数
    })
    wx.request({
      url: https + '/member/ordersList', //写自己的服务器
      data: {
        page: _this.data.page,
        pagenum: _this.data.pagenum, //每页显示条数
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        "openid": wx.getStorageSync('openid'),
        "skey": wx.getStorageSync('skey'),
      },
      method: "get",
      success: function (res) {
        console.log(res.data)
        var a = []
        var list = res.data.data
        if (list.length < 1) {
          wx.showToast({
            title: '没有更多了~',
            icon: 'none',
            duration: 1500
          })
        }
        for (var i = 0; i < list.length; i++) {
          a = list[i].images.split(',')[0]
          list[i]['List_img'] = a
        }
  
        var arr1 = _this.data.list;
        _this.setData({
          list: arr1.concat(list),//热门产品
        })
      },
      fail: function () {
        console.log("fail")
      }

    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})