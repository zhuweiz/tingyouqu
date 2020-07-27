// pages/ Active_line/ Active_line.js
const app = getApp()
var openid = wx.getStorageSync('openid')
var config = require('../../utils/config.js')
Page({ 

  /**
   * 页面的初始数据
   */
  data: {
    HTTP: config.HTTP, //图片路径
    bnrUrl: [],//轮播图
    hotList:[],//热门活动
    guessList:[],//猜你喜欢
    page: 1,//页数
    pagenum: 12//一页的数据量
  },
  //轮播图
  lunbo: function (e) {
    var that = this;
    console.log(e)
    var id = e.currentTarget.dataset.id
    var goosid = e.currentTarget.dataset.goosid
    // if (fiom == '1') {
      wx.navigateTo({
        url: '../activity/activity?id=' + id
      })
    // }
  },

//猜你喜欢渲染
  getdatalist: function () {
    var https = config.http_url;
    const _this = this;
    wx.showLoading({
      title: '加载中',
    })
    wx.request({ //列表渲染
      url: https + '/activity/guess', //写自己的服务器
      data: {
        page: _this.data.page,
        pagenum: _this.data.pagenum,//一页的数据量
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        "openid": wx.getStorageSync('openid'),
        "skey": wx.getStorageSync('skey'),
      },
      method: "get",
      success: function (res) {
        console.log(res.data)
        var guessList = res.data.data//从此次请求返回的数据中获取新数组
         var arr1 = _this.data.guessList; //从data获取当前datalist数组
         arr1 = arr1.concat(guessList); //合并数组

         console.log(arr1)
        if (res.data.data == 0) {
          wx.showToast({
            title: '没有更多了',
            icon: 'none',
            duration: 1500
          })
        }

        _this.setData({
          guessList: arr1,
        })
        wx.hideLoading();
      },
      fail: function () {
        console.log("fail")
        wx.hideLoading();
      }

    })
  },

  guessList:function(e){
    var https = config.http_url;
    let _this = this;
    wx.showLoading({
      title: '加载中',
    })
    wx.request({ //首页渲染
      url: https + '/activity/index', //写自己的服务器
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        "openid": wx.getStorageSync('openid'),
        "skey": wx.getStorageSync('skey'),
      },
      method: "get",
      success: function (res) {
        console.log(res)
        _this.setData({
          bnrUrl: res.data.data.bannerList,//轮播图
          hotList: res.data.data.hotList,//新品推荐
        })
        wx.hideLoading();
      },
      fail: function () {
        console.log("fail")
        wx.hideLoading();
      }

    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
    var https = config.http_url;
    let _this = this;
    _this.guessList();
    _this.getdatalist();
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
    var that = this;
    var page = that.data.page + 1; //获取当前页数并+1
    console.log(page)
    that.setData({
      page: page, //更新当前页数
    })
    that.getdatalist();//重新调用请求获取下一页数据
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})