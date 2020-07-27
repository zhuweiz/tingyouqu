// pages/site/site.js
const app = getApp()
var config = require('../../utils/config.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id:'',
    name: '', //名字
    phone: '', //手机号码
    city: '请选择', // 城市
    region: '请选择', // 地区
    street: '请选择', // 街道
    address: '', //详细地址
    switch1Checked: 0, //开关默认
    getAppInfo: '' //判断手机 底部高度
  },
  bindRegionChange: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      // region: e.detail.value,
      city: e.detail.value[0], // 城市
      region: e.detail.value[1], // 地区
      street: e.detail.value[2], // 街道
    })
  },
  handlenameChange(e) { //收件人名字
    this.data.name = e.detail.value;
    console.log(this.data.name)
  },
  handlephoneChange(e) { //收件人手机号码
    this.data.phone = e.detail.value;
    console.log(this.data.phone)
  },
  handleaddressChange(e) { //收件人详细地址
    this.data.address = e.detail.value;
    console.log(this.data.address)
  },
  switch1Change(e) {
    console.log(e.detail.value)
    if (e.detail.value == true) {
      this.setData({
        switch1Checked: 1
      })
    } else {
      this.setData({
        switch1Checked: 0
      })
    }
    console.log(this.data.switch1Checked)
  },
  handleSubmit(e) { //保存地址
    var https = config.http_url;
    var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
    if (!this.data.name) {
      wx.showToast({
        title: '请填写您的姓名',
        icon: 'none',
        duration: 1500
      })
      return;
    } else if (this.data.phone.length == 0) {
      wx.showToast({
        title: '手机号不能为空',
        icon: 'none',
        duration: 1500
      })
      return false;
    } else if (this.data.phone.length < 11) {
      wx.showToast({
        title: '手机号长度有误！',
        icon: 'none',
        duration: 1500
      })
      return false;
    } else if (!myreg.test(this.data.phone)) {
      wx.showToast({
        title: '请填写正确的手机号码！',
        icon: 'none',
        duration: 1500
      })
      return false;
    } else if (!this.data.city || this.data.city === "请选择") {
      wx.showToast({
        title: '请选择您的省份！',
        icon: 'none',
        duration: 1500
      })
      return false;
    } else if (!this.data.region || this.data.region === "请选择") {
      wx.showToast({
        title: '请选择您的城市！',
        icon: 'none',
        duration: 1500
      })
      return false;
    } else if (!this.data.street || this.data.street === "请选择" || this.data.street === "全部") {
      wx.showToast({
        title: '请选择您的地区！',
        icon: 'none',
        duration: 1500
      })
      return false;
    } else if (!this.data.address) {
      wx.showToast({
        title: '请输入您详细地址！',
        icon: 'none',
        duration: 1500
      })
      return false;
    }
    const _this = this;
    wx.request({
      url: https + '/member/addressUpdate',
      data: {
        id: this.data.id,
        name: this.data.name, // 昵称
        phone: this.data.phone, // 电话
        city: this.data.city, // 省份
        region: this.data.region, // 城市
        street: this.data.street, // 地区
        address: this.data.address, // 详细地址
        default: this.data.switch1Checked // 是否默认
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        "openid": wx.getStorageSync('openid'),
        "skey": wx.getStorageSync('skey'),
      },
      method: "post",
      success: function (res) {
        wx.showToast({
          title: '保存成功',
          icon: 'success',
          duration: 1500
        })
        wx.navigateBack({//返回
          delta: 1
        })
      },
      fail: function () {
        console.log("fail")
        wx.showToast({
          title: '保存失败 请从新再试',
          icon: 'none',
          duration: 1500
        })
      }

    })
  },

  remove(e) {//删除地址
    var that = this;
    var https = config.http_url;
    wx.showModal({
      content: '确认删除吗',
      success(res) {
        if (res.confirm) {
          wx.request({
            url: https + '/member/addressDel', //写自己的服务器
            data: {
              id: that.data.id
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
              wx.navigateBack({//返回
                delta: 1
              })
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
    var _this = this
    var https = config.http_url;
    console.log(options)
    var getAppInfo = app.globalData.bottom;
    this.setData({
      getAppInfo: getAppInfo,
      id: options.id
    })
    wx.request({
      url: https + '/member/addressInfo',
      data: {
        id: options.id
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        "openid": wx.getStorageSync('openid'),
        "skey": wx.getStorageSync('skey'),
      },
      method: "GET",
      success: function(res) {
          console.log(res.data.data)
        _this.setData({
            name: res.data.data.name, //名字
            phone: res.data.data.phone, //手机号码
            city: res.data.data.city, // 城市
            region: res.data.data.region, // 地区
            street: res.data.data.street, // 街道
            address: res.data.data.address, //详细地址
            switch1Checked: res.data.data.default, //开关默认
          id: options.id//id
          })
      },
      fail: function() {
        console.log("fail")
      }

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