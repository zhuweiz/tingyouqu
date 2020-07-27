// pages/comparison/comparison.js
const app = getApp()
var config = require('../../utils/config.js')
Page({

  /**
   * 页面的初始数据
   */
  data: { 
    HTTP: config.HTTP,//图片路径
    getAppInfo: '',//判断手机 底部高度
    comparison:[],
    // checked:'',
    checked: false,
    app_id:[],
    id:'',
    numbers:'',
    times:'',
    show: false,
    isok:false,
  },
  // onClose() {
  //   this.setData({
  //     show: false,
  //   })
  // },
eec:function(e){
  var _this = this
  var id = e.currentTarget.dataset.id
  var app_id = _this.data.app_id
  var index = e.currentTarget.dataset.index
  var item = this.data.comparison[index];
  item.length = !item.length;
  if (item.length) {
    app_id.push(item.id)
  } else {
    for (var i = 0; i < app_id.length; i++) {
      if (app_id[i] == item.id) {
        app_id.splice(i, 1)
      }
    }
  }
  _this.setData({
    comparison: this.data.comparison,
  })
  console.log(app_id)
},
// 点击删除
  deletelist:function(e){
    var https = config.http_url;
    const _this = this;
    var app_id = _this.data.app_id
    // var item = this.data.comparison[index];


    if (this.data.app_id.length == 0) {
      wx.showToast({
        title: '请至少选择一项',
        icon: "none"
      })
      return 
    }

    //搜索热词
    wx.request({
      url: https + '/product/compareDelId', //写自己的服务器
      data:{
        id: app_id.join(',')
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        "openid": wx.getStorageSync('openid'),
        "skey": wx.getStorageSync('skey'),
      },
      method: "get",
      success: function (res) {
        console.log(res)
        for (var i = 0; i < app_id.length; i++) {
          if (app_id[i] == app_id[i]) {
            app_id.splice(i, 1)
          }
        }
        console.log(app_id)
        _this.onShow()
      },
      fail: function () {
        console.log("fail")
      }
    })
  },
  getUserInfo(event) {
    console.log(event.detail);
    wx.navigateTo({
      url: '../member/member',
    })
  },
  // 去对比！！！
  gotodb(e){
    var _this = this
 
    if (this.data.app_id.length < 2) {
      wx.showToast({
        title: '至少对比两款哦',
        icon: "none"
      })
      return
    }
    if (wx.getStorageSync('ismember') != 1){
      if (_this.data.app_id.length > _this.data.numbers) {
        _this.setData({ show: true });
        return
      }
    }
    if (this.data.app_id.length >10) {
      wx.showToast({
        title: '最多选择10款',
        icon: "none"
      })
      return
    }
  
    wx.navigateTo({
      // url: './updjichu/index?jichu=' + JSON.stringify(this.data.arr)
      url: '../contrast/contrast?id=' + this.data.app_id
    })
    this.setData({
      app_id: []
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(wx.getStorageSync('ismember'))
    var https = config.http_url;
    const _this = this;
    var getAppInfo = app.globalData.bottom;//获取底部高度
    this.setData({
      getAppInfo: getAppInfo,
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
    var https = config.http_url;
    const _this = this;
    wx.showLoading({
      title: '加载中~',
    })
    wx.request({
      url: https + '/product/compareList', //写自己的服务器
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        "openid": wx.getStorageSync('openid'),
        "skey": wx.getStorageSync('skey'),
      },
      method: "get",
      success: function (res) {
        wx.hideLoading()
        console.log(res)
        _this.setData({
          comparison: res.data.data,
          numbers: res.data.numbers,
          times: res.data.times,
        })

      },
      fail: function () {
        console.log("fail")
      }

    })
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
    // wx.redirectTo({
    //   url: '../list_particulars/list_particulars?id=' + this.data.id
    // })
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