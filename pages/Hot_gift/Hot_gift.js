var config = require('../../utils/config.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    HTTP: config.HTTP,//图片路径
    gift_list: [],
    page: 1,//页数
    pagenum: 5//一页的数据量
  },
  getdatalist: function () {
    var https = config.http_url;
    const _this = this;
    //渲染礼品列表页
    wx.request({
      url: https + '/main/getGiftRecommendList', //写自己的服务器
      data: {
        page: _this.data.page,
        pagenum: 3, //每页显示条数
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        "openid": wx.getStorageSync('openid'),
        "skey": wx.getStorageSync('skey'),
      },
      method: "get",
      success: function (res) {
        console.log(res.data.data)
        var arr1 = _this.data.gift_list; //从data获取当前datalist数组
        var arr2 = res.data.data; //从此次请求返回的数据中获取新数组
        arr1 = arr1.concat(arr2); //合并数组
        var a = []
        for (var i = 0; i < arr1.length; i++) {
          a = arr1[i].images[0]
          arr1[i]['gift_img'] = a
          // console.log(a)
        }

        console.log(arr1)
        if (res.data.data == 0) {
          wx.showToast({
            title: '没有更多了',
            icon: 'none',
            duration: 1500
          })
        }
        _this.setData({
          gift_list: arr1//合并后更新information
        })

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
    const _this = this;
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})