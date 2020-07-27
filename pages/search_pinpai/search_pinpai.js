var config = require('../../utils/config.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    keyWord: '',
    search: '',
    keyWord: '', //value值
    name_focus: true,//输入框聚焦 
    name: [],
    hotword:[],
    id: '',
    list: '',
    sercherStorage2: [], //最近搜索内容
  },
  //点击热门词出现在输入框里
  this_value: function (e) {
    var that = this;
    that.setData({
      name_focus: true
    })
    let value = e.currentTarget.dataset.text;
    that.setData({
      keyWord: value,
    })
    var formData = e.currentTarget.dataset.text;
    console.log(formData)

    if (formData) {// 搜索
      wx.redirectTo({
        url: '../pinpai_list/pinpai_list?formData=' + formData + '&name=' + formData
      })
      var searchData = that.data.sercherStorage2;
      let arrnum = searchData.indexOf(formData)
      console.log(arrnum)
      if (arrnum != -1) {
        // 删除已存在后重新插入至数组
        searchData.splice(arrnum, 1)
        searchData.unshift(formData);

      } else {
        searchData.unshift(formData);
      }
      wx.setStorageSync('pinpai', searchData);
    } else {

      wx.showToast({
        title: '输入不能为空',
        icon: 'none',
        duration: 1500
      })

    }

  },
  openLocationsercher: function () {//获取搜索缓存
    console.log(wx.getStorageSync('pinpai'))
    this.setData({
      sercherStorage2: wx.getStorageSync('pinpai') || [],
      StorageFlag: true,
      listFlag: true,
    })
  },
  clearSearchStorage: function () {//清除搜索历史
    wx.removeStorageSync('pinpai')
    this.setData({
      sercherStorage2: [],
      StorageFlag: false,
    })
  },


  // 搜索
  goSearch: function (e) {
    var https = config.http_url;
    console.log(e)
    var that = this;
    var formData = e.detail.value;
    if (formData) {
      wx.redirectTo({
        url: '../pinpai_list/pinpai_list?formData=' + formData + '&name=' + formData
      })
      var searchData = that.data.sercherStorage2;
      let arrnum = searchData.indexOf(formData)
      console.log(arrnum)
      if (arrnum != -1) {
        // 删除已存在后重新插入至数组
        searchData.splice(arrnum, 1)
        searchData.unshift(formData);

      } else {
        searchData.unshift(formData);
      }
      wx.setStorageSync('pinpai', searchData);
    } else {

      wx.showToast({
        title: '输入不能为空',
        icon: 'none',
        duration: 1500
      })

    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var https = config.http_url;
    console.log(options)
    let _this = this;
    this.setData({
      id: options.id,
      list: options.list
    })
    wx.request({
      url: https + '/brand/country', //写自己的服务器
 
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        "openid": wx.getStorageSync('openid'),
        "skey": wx.getStorageSync('skey'),
      },
      method: "get",
      success: function (res) {
        wx.hideLoading()
        console.log(res)
        var classify_list = res.data.data.list; //从此次请求返回的数据中获取新数组
        var classify_hot = res.data.data.hot;
        _this.setData({
          hotword: res.data.data,//其它品牌
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
    this.openLocationsercher();
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