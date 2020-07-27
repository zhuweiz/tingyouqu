// pages/rights/rights.js
var config = require('../../utils/config.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ismember: wx.getStorageSync('ismember'),
    HTTP: config.HTTP,//图片路径
    nickname:''
  },
  handlenameChange(e) {//填写兑换码
    this.data.nickname = e.detail.value;
    console.log(this.data.nickname)
  },
  generateOrder: function (e) {
    var https = config.http_url;
    var that = this
    if (!this.data.nickname) {
      wx.showToast({
        title: '请先填写兑换码',
        icon: 'none',
        duration: 1500
      })
      return;
    }
    wx.request({
      url: https + '/member/exchange',//后台请求地址
      method: 'POST',
      data: {
        code: that.data.nickname,// 兑换码
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        "openid": wx.getStorageSync('openid'),
        "skey": wx.getStorageSync('skey'),
      },
      success: function (res) {
        // console.log("后台获取数据成功");
        console.log(res.data);
        if(res.data.code == 0){
          wx.showToast({
            title: '兑换成功',
            icon: 'success',
            duration: 1500,
            success() {
              setTimeout(() => {
                wx.navigateBack({
                  delta: 1
                })
              }, 1500)
            }
          })
         
        }else{
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 1500
          })
        }
        // //发起支付
        // var orderno = res.data.orderno
        // if (that.data.uhide == 1) {
        //   that.param(orderno);
        // }
      },
      fail: function (res) {
        console.log("向后台发送数据失败")
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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