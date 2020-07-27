// pages/address/address.js
var config = require('../../utils/config.js')
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isHide: '',
    address: [],
    order:'',
    errMsg: [], //
    status: true, //true为正常显示，false为显示删除按钮
    getAppInfo: '' //判断手机 底部高度
  },
  touchS(e) {
    // 获得起始坐标
    this.startX = e.touches[0].clientX;
    this.startY = e.touches[0].clientY;

  },
  touchM(e) {
    var id = e.currentTarget.dataset.id;//当前索引
    this.currentX = e.touches[0].clientX;
    this.currentY = e.touches[0].clientY;
    const x = this.startX - this.currentX; //横向移动距离
    const y = Math.abs(this.startY - this.currentY); //纵向移动距离，若向左移动有点倾斜也可以接受
    if (x > 35 && y < 110) {
      //向左滑是显示删除
      this.setData({

        status:id

      })
    } else if (x < -35 && y < 110) {
      //向右滑
      this.setData({
        status:true
      })
    }
  },
  xiugai(e) { //保存地址
    var https = config.http_url;
    const _this = this;
    if (this.data.order == 'order'){
      wx.request({
        url: https + '/member/addressUpdate',
        data: {
          id: e.currentTarget.dataset.id,
          name: e.currentTarget.dataset.name, // 昵称
          phone: e.currentTarget.dataset.phone, // 电话
          city: e.currentTarget.dataset.city, // 省份
          region: e.currentTarget.dataset.region, // 城市
          street: e.currentTarget.dataset.street, // 地区
          address: e.currentTarget.dataset.address, // 详细地址
          default: 1 // 是否默认
        },
        header: {
          "Content-Type": "application/x-www-form-urlencoded",
          "openid": wx.getStorageSync('openid'),
          "skey": wx.getStorageSync('skey'),
        },
        method: "post",
        success: function (res) {

          wx.navigateBack({//返回
            delta: 1
          })
          _this.onShow()
        },
        fail: function () {
          console.log("fail")
        }

      })
    }

  },

  remove(e) {//删除地址
  console.log(e)
    var that = this;
    var https = config.http_url;
    wx.showModal({
      content: '确认删除吗',
      success(res) {
        if (res.confirm) {
          wx.request({
            url: https + '/member/addressDel', //写自己的服务器
            data: {
              id: e.currentTarget.dataset.id
            },
            header: {
              "Content-Type": "application/x-www-form-urlencoded",
              "openid": wx.getStorageSync('openid'),
              "skey": wx.getStorageSync('skey'),
            },
            method: "post",
            success: function (res) {
              wx.showToast({
                title: '删除成功',
                icon: 'success',
                duration: 1500
              })
              that.onShow()
            },
            fail: function () {
              console.log("fail")
            }

          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options)
    var getAppInfo = app.globalData.bottom;
    this.setData({
      getAppInfo: getAppInfo,
      order: options.order
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
    var that = this;
    var https = config.http_url;
    wx.showLoading({
      title: '加载中~',
    })
    wx.request({
      url: https + '/member/address', //写自己的服务器
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        "openid": wx.getStorageSync('openid'),
        "skey": wx.getStorageSync('skey'),
      },
      method: "get",
      success: function (res) {
        wx.hideLoading()
        console.log(res.data.data.length)
        if (res.data.data.length > 0) {
          that.setData({
            address: res.data.data,
            isHide: false
          })
        } else {
          that.setData({
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
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {
    // wx.switchTab({
    //   url: '../mine/mine'
    // })
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