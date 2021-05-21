// pages/launch/launch.js
var config = require('../../utils/config.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    HTTP: config.HTTP, //图片路径
    image: '',
    gid:'',
    setInter:'',
    cid:'',
    seconds:'',
    timer: '',//定时器名字
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var https = config.http_url;
    const _this = this;
    wx.request({
      url: https + '/flashbox/index', //写自己的服务器
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        "openid": wx.getStorageSync('openid'),
        "skey": wx.getStorageSync('skey'),
      },
      method: "get",
      success: function(res) {
        // console.log(res.data.data)
        if (res.data.data ==''){
          wx.switchTab({
            url: '/pages/index/index'
          })
        }
        _this.setData({
          image: res.data.data.image,
          cid: res.data.data.cid,
          gid: res.data.data.gid,
          seconds: res.data.data.seconds
        })

        let seconds = res.data.data.seconds;//获取倒计时初始值
        // console.log(seconds)
        _this.setData({
          timer: setInterval(function () {
            seconds--;
            _this.setData({
              seconds: seconds
            })
            if (seconds == 0) {
              clearInterval(_this.data.timer);
            }
          }, 1000)
        })
   
        _this.data.setInter = setTimeout(() => {
          wx.switchTab({
            url: '/pages/index/index'
          })
        }, res.data.data.seconds*1000)
      },
      fail: function() {
        console.log("fail")

      }
    })
  
  },
  tiaoguo(){
    clearTimeout(this.data.setInter)
    wx.switchTab({
      url: '/pages/index/index'
    })
  },
  tiaozhuan(e) {
  
    var that = this;
    clearTimeout(that.data.setInter)
    var fiom = e.currentTarget.dataset.from
    var goosid = e.currentTarget.dataset.goosid
    var qd = 'qd'
    if (fiom == '1') {
      // let str = JSON.stringify(res.data);
      wx.reLaunch({
        url: '../list_particulars/list_particulars?id=' + goosid + '&qd=' + qd
      })
    } else if (fiom == '2'){
      wx.reLaunch({
        url: '../Gift_details/Gift_details?id=' + goosid + '&qd=' + qd
      })
    } else if (fiom == '3'){
      wx.reLaunch({
        url: '../activity/activity?id=' + goosid + '&qd=' + qd
      })
    }
  },

  // countDown: function () {
  //   let that = this;
  //   let seconds = that.data.seconds;//获取倒计时初始值
  //   console.log(seconds)
  //   that.setData({
  //     timer: setInterval(function () {
  //       seconds--;
  //       that.setData({
  //         seconds: seconds
  //       })
  //       if (seconds == 0) {
  //         clearInterval(that.data.timer);
  //       }
  //     }, 1000)
  //   })
  // },



  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
// this.countDown();
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