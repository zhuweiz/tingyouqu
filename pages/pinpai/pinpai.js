// pages/pinpai/pinpai.js
const app = getApp()
var config = require('../../utils/config.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pinpai_list: [],//测试
    showPy: '#',
    scrollTopId: '',
    flag: true,//遮罩
    hidden: true,
    HTTP: config.HTTP,//图片路径
  },
  goSearch: function (e) {
    var https = config.http_url;
    console.log(e)
    var that = this;
    var formData = e.detail.value;
      wx.showLoading({
        title: '加载中',
      })
      if (formData) {
        wx.request({
          url: https + '/search/brand',
          data: {
            keyword: formData,
          },
          header: {
            "Content-Type": "application/x-www-form-urlencoded",
            'openid': wx.getStorageInfoSync("openid"),
            'skey': wx.getStorageInfoSync("skey"),
          },
          method: "get",
          success: function (res) {
            console.log(res.data)
            var searchShow = res.data.data
            that.setData({
              pinpai_list: searchShow,
              formData: formData
            })
            wx.hideLoading();
            if (res.data.data == '') {
              that.setData({
                flag: false,//遮罩
              })
            } else {
              that.setData({
                flag: true,//遮罩
              })
            }
          }
        })
      } else {

        wx.showToast({
          title: '输入不能为空',
          icon: 'none',
          duration: 1500
        })

      }

    },
  //回退
  selectCity: function (e) {
    console.log(e)
    var cname = e.currentTarget.dataset.cname;
    var id = e.currentTarget.dataset.id;
    var dataset = e.currentTarget.dataset;
    this.setData({
      citySelected: dataset.fullname,
      cityListShow: false,
      inputListShow: false,
      historyListShow: true,
      location: {
        latitude: dataset.lat,
        longitude: dataset.lng
      }
    });
    let pages = getCurrentPages();//当前页面    （pages就是获取的当前页面的JS里面所有pages的信息）
    let prevPage = pages[pages.length - 2];//上一页面（prevPage 就是获取的上一个页面的JS里面所有pages的信息）
    console.log(prevPage)
    prevPage.setData({
      cname: e.currentTarget.dataset.cname,
      brandId: e.currentTarget.dataset.id,
    })
    wx.navigateBack({
      delta: 1,
    }) //回到上一个页面  仅适用于用navigateTo跳转过来的页面
    // wx.redirectTo({
    //   url: "../dealer/dealer?name=" + name + '&id=' + this.data.brandId
    // })
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
    wx.showLoading({
      title: '加载中~',
    })
    //渲染礼品列表页
    wx.request({
      url: https + '/brand/simpleList', //写自己的服务器
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        "openid": wx.getStorageSync('openid'),
        "skey": wx.getStorageSync('skey'),
      },
      method: "get",
      success: function (res) {
        wx.hideLoading()
        console.log(res)
        var arr1 = _this.data.classify_list;
        var classify_list = res.data.data.list; //从此次请求返回的数据中获取新数组

        console.log(res.data.data)
        _this.setData({
          pinpai_list: classify_list,//其它品牌
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