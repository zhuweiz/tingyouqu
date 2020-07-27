// pages/select_brand/select_brand.js
const app = getApp()
var config = require('../../utils/config.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    HTTP: config.HTTP,//图片路径
    classify_list: [],//其它品牌
    classify_hot: [],//热门品牌
    page: 1,//页数
    scrollTopId: '',
    hidden: true,
    flag: true,//遮罩
    pagenum: 10//一页的数据量
  },
  //获取文字信息
  getPy: function (e) { //点击跳转指定位置
    console.log(e)
    this.setData({
      hidden: false,
      showPy: e.target.id,
    })
  },
  //触发全部开始选择
  tStart: function () {
    this.setData({
      hidden: false
    })
  },

  //触发结束选择
  tEnd: function () {
    this.setData({
      hidden: true,
      scrollTopId: this.data.showPy
    })
  },
  getdatalist: function () {
    const _this = this;
    var https = config.http_url;

    //渲染礼品列表页
    wx.request({
      url: https + '/brand/index', //写自己的服务器
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
        var arr1 = _this.data.classify_list;
        var arr2 = _this.data.classify_hot;
        var classify_list = res.data.data.list; //从此次请求返回的数据中获取新数组
        var classify_hot = res.data.data.hot;
        arr1 = arr1.concat(classify_list);
        arr2 = arr2.concat(classify_hot);
        console.log(res.data.data)
        // if (res.data.data.list == 0 || res.data.data.hot == 0) {
        //   wx.showToast({
        //     title: '没有更多了',
        //     icon: 'none',
        //     duration: 1500
        //   })
        // }
        _this.setData({
          pinpai_list: classify_list,//其它品牌
          classify_hot: classify_hot//热门品牌
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