// pages/information_list/information_list.js
const app = getApp();
var openid = wx.getStorageSync('openid')
var config = require('../../utils/config.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    HTTP: config.HTTP,//图片路径
    information: [],
    flag: true,//遮罩
    id:'',
    name:'',
    sercherStorage2: [], //最近搜索内容
  },
  openLocationsercher: function () {//获取搜索缓存
    console.log(wx.getStorageSync('searchData2'))
    this.setData({
      sercherStorage2: wx.getStorageSync('searchData2') || [],
      StorageFlag: true,
      listFlag: true,
    })
  },
  // 搜索
  goSearch: function (e) {
    var https = config.http_url;
    console.log(e)
    var that = this;
    var formData = e.detail.value;
    if (formData) {

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
      wx.setStorageSync('searchData2', searchData);
      wx.request({//渲染详情页
        url: https + '/article/search', //写自己的服务器
        data: {
          id: that.data.id,
          keyword: formData,
        },
        header: {
          "Content-Type": "application/x-www-form-urlencoded",
          "openid": wx.getStorageSync('openid'),
          "skey": wx.getStorageSync('skey'),
        },
        method: "get",
        success: function (res) {
          console.log(res)
          if (res.data.data == '') {
            that.setData({
              flag: false,//遮罩
            })
          } else {
            that.setData({
              flag: true,//遮罩
            })
          }
          that.setData({
            information: res.data.data,//合并后更新information
          })

        },
        fail: function () {
          console.log("fail")
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


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    var https = config.http_url;

    const _this = this;
    _this.setData({
      id: options.id,
      name: options.name
    })
    wx.request({//渲染详情页
      url: https + '/article/search', //写自己的服务器
      data: {
        id: options.id,
        keyword: options.formData,
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        "openid": wx.getStorageSync('openid'),
        "skey": wx.getStorageSync('skey'),
      },
      method: "get",
      success: function (res) {
        console.log(res)
        if (res.data.data == '') {
          _this.setData({
            flag: false,//遮罩
          })
        } else {
          _this.setData({
            flag: true,//遮罩
          })
        }
        _this.setData({
          information: res.data.data,//合并后更新information
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