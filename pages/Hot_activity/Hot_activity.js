// pages/searchShow/searchShow.js
var config = require('../../utils/config.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    HTTP: config.HTTP,//图片路径
    page: 1, //页数
    pagenum: 8, //一页的数据量
    productList:[],
    hasMoreData: true	//上拉时是否继续请求数据，即是否还有更多数据
  },
  getdatalist: function (message) {
    wx.showNavigationBarLoading()					//在当前页面显示导航条加载动画
    wx.showLoading({								//显示 loading 提示框
      title: message,
    })
    var https = config.http_url;
    const _this = this;

    var id = _this.data.id
    var name = _this.data.name

    wx.request({ //列表渲染
      url: https + '/main/getActivityRecommendList', //写自己的服务器
      data: {
        page: _this.data.page,
        pagenum: _this.data.pagenum //一页的数据量
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        'openid': wx.getStorageInfoSync("openid"),
        'skey': wx.getStorageInfoSync("skey"),
      },
      method: "get",
      success: function (res) {
        console.log(res.data.data)
        var contentlistTem = _this.data.productList;
        var productList = res.data.data;//列表页

        if (res.data.data.length > 0) {
          wx.hideNavigationBarLoading()		//在当前页面隐藏导航条加载动画
          wx.hideLoading()					//隐藏 loading 提示框
          if (_this.data.page == 1) {
            contentlistTem = []
          }
          var productList = res.data.data;//列表页
          
          if (productList.length < _this.data.pagenum) {
            _this.setData({
              productList: contentlistTem.concat(productList),
              hasMoreData: false
            })
          } else {
            _this.setData({
              productList: contentlistTem.concat(productList),
              hasMoreData: true,
              page: _this.data.page + 1
            })
          }
        }
        console.log(productList)
      },
      fail: function () {
        console.log("fail")
      }

    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var https = config.http_url;
    const _this = this;
    _this.getdatalist('正在加载数据...');
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
    if (this.data.hasMoreData) {
      this.getdatalist('加载更多数据')
    } else {
      wx.showToast({
        title: '没有更多数据',
      })
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})