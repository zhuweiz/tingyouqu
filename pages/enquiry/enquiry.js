// pages/enquiry/enquiry.js
const app = getApp()
var config = require('../../utils/config.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    HTTP: config.HTTP, //图片路径
    getAppInfo: '', //判断手机 底部高度
    flag: true,//遮罩
    uhide: 1,
    app_id:[],
    id: '', //产品id
    nickname: '', //用户名字
    phone: '', //手机号码
    gender: '男', //性别
    content: '', //需求内容
    checked: 0,
    enquiry_list:[],
    isok:true
  },
  checkboxChange: function (e) {
    console.log('checkbox发生change事件，携带value值为：', e.detail.value)
    console.log(e)
    var _this = this
    var app_id = _this.data.app_id
    var id = e.currentTarget.id
    if (e.detail.value != '') {
      app_id.push(id)
    } else {
      for (var i = 0; i < app_id.length; i++) {
        if (app_id[i] == id) {
          app_id.splice(i, 1)
        }
      }
    }
        console.log(app_id)
  },
  ShowState: function(e) { //点击男女切换

    var that = this;
    var gender = that.data.gender
    var toggleBtnVal = that.data.uhide
    var num = e.currentTarget.dataset.num

    console.log(num)
    if (toggleBtnVal == num) {
      that.setData({
        uhide: 0
      })
    } else {
      that.setData({
        uhide: num,
      })
    }
  },
  handlenameChange(e) {
    this.data.nickname = e.detail.value;
    console.log(this.data.nickname)
  },
  handleContactChange(e) { //填写联系方式
    this.data.phone = e.detail.value;
    console.log(this.data.phone)
  },
  handlecontentChange(e) { //填写需求
    this.data.content = e.detail.value;
    console.log(this.data.content)
  },

  handleSubmit(e) { //发送
    var https = config.http_url;
    var id = this.data.id
    console.log(id)
    var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
    if (!this.data.nickname) {
      wx.showToast({
        title: '请填写您的称呼',
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
    } else if (!this.data.content) {
      wx.showToast({
        title: '请输入您的需求！',
        icon: 'none',
        duration: 1500
      })
      return false;
    } else if (this.data.app_id.length<1) {
      wx.showToast({
        title: '请勾选您的需求！',
        icon: 'none',
        duration: 1500
      })
      return false;
    }
    const _this = this;
    var app_id = _this.data.app_id
    if (this.data.app_id.length>1){
      
        app_id = [3]
      
    }
    console.log(app_id)
    wx.request({
      url: https + '/product/inquiry', 
      data: {
        id: id,
        nickname: this.data.nickname, // 昵称
        gender: this.data.uhide, // 性别
        phone: this.data.phone, // 电话
        content: this.data.content, // 内容
        advisory: this.data.app_id.join(',') // 咨询方式 1：发送资料  2：询价  3：两者都选

      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        "openid": wx.getStorageSync('openid'),
        "skey": wx.getStorageSync('skey'),
      },
      method: "post",
      success: function(res) {
        console.log(res)
        _this.setData({
          flag: false
        })

      },
      fail: function() {
        console.log("fail")
      }

    })
  },
  closeMask: function () {//点击关闭
  var id =this.data.id
    this.setData({ flag: true })
    wx.navigateBack({
      delta: 1,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var https = config.http_url;
    const _this = this;
    // 查看是否授权
    wx.getSetting({
      success: function (res) {
        if (res.authSetting['scope.userInfo']) {
        } else {
          // 用户没有授权
          wx.redirectTo({
            url: '/pages/reg/reg',
          })
        }
      }
    })
    wx.showLoading({
      title: '加载中~',
    })
    console.log(this.data.uhide)
    var getAppInfo = app.globalData.bottom; //获取底部高度
    this.setData({
      getAppInfo: getAppInfo,
      id: options.id
    })
    console.log(options)
    //提交信息给后台
    wx.request({ //列表渲染
      url: https + '/product/detailSimplify?id=' + options.id, //写自己的服务器
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        "openid": wx.getStorageSync('openid'),
        "skey": wx.getStorageSync('skey'),
      },
      method: "get",
      success: function (res) {
        wx.hideLoading()
        console.log(res)
        var enquiry_list = res.data.data

        console.log(enquiry_list)

        _this.setData({
          enquiry_list: enquiry_list[0]
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