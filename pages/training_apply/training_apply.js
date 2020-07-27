// pages/training_apply/training_apply.js
const app = getApp()
var config = require('../../utils/config.js')
var util = require('../../utils/jieliu.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ismember: wx.getStorageSync('ismember'),
    uhide: 1,
    HTTP: config.HTTP,//图片路径
    getAppInfo: '',//判断手机 底部高度
    train_list:{},
    id:'',
    nickname: '', //用户名字
    phone: '', //手机号码
  },
  handlenameChange(e) {//填写姓名
    this.data.nickname = e.detail.value;
    console.log(this.data.nickname)
  },
  handleContactChange(e) { //填写联系方式
    this.data.phone = e.detail.value;
    console.log(this.data.phone)
  },

  generateOrder: util.throttle(function () {
    var https = config.http_url;
    var that = this
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
    }
    wx.request({
      url: https + '/pay/prepay',//后台请求地址
      method: 'POST',
      data: {
        id: that.data.id,  // 商品id
        from: 4,   //  1:礼品  2:门票  3:会员
        type: that.data.uhide, // 支付方式
        name: that.data.nickname,// 购买名字
        phone: that.data.phone  // 电话号码
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        "openid": wx.getStorageSync('openid'),
        "skey": wx.getStorageSync('skey'),
      },
      success: function (res) {
        // console.log("后台获取数据成功");
        console.log(res.data);

        // //发起支付
        var orderno = res.data.orderno
        if (that.data.uhide == 1){
          that.param(orderno);
        }else{
          wx.showToast({
            title: '报名成功',
            icon: 'success',
            duration: 1500,
            success() {
              setTimeout(() => {
                wx.redirectTo({
                  url: '../Orderdetail/Orderdetail?orderno=' + orderno
                })
              }, 1500)
            }
          })
      
        }
      },
      fail: function (res) {
        console.log("向后台发送数据失败")
      }
    })
  }),
  //支付
  param: function (orderno) {
    console.log(orderno)
    var https = config.http_url;
    var that = this
    wx.request({
      url: https + '/pay/pay',//后台请求地址
      method: 'POST',
      data: {
        orderno: orderno
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        "openid": wx.getStorageSync('openid'),
        "skey": wx.getStorageSync('skey'),
      },
      success: function (res) {
        console.log(res.data);
        var param = { "timeStamp": res.data.data.timeStamp, "package": res.data.data.package, "paySign": res.data.data.paySign, "signType": res.data.data.signType, "nonceStr": res.data.data.nonceStr };
        that.pay(param);
       
        that.setData({
          orderno: orderno
        })
      },

      fail: function (res) {
        console.log("向后台发送数据失败")
      }
    })
  },
  pay: function (param) {
    var that = this;
    //   console.log("发起支付")
    console.log(param)
    wx.requestPayment({
      timeStamp: param.timeStamp,
      nonceStr: param.nonceStr,
      package: param.package,
      signType: param.signType,
      paySign: param.paySign,
      success: function (res) {
        console.log(res);
        var orderno = that.data.orderno
        console.log(orderno);
        wx.redirectTo({
          url: '../Orderdetail/Orderdetail?orderno=' + orderno
        })
      },
      fail: function (res) {
        console.log("fail")
        console.log(res);

      },
      complete: function (res) {
        console.log("complete");
        console.log(res)

      }
    })

  },



  ShowState: function (e) {
    var that = this;
    var toggleBtnVal = that.data.uhide
    var num = e.currentTarget.dataset.num
    if (toggleBtnVal == num) {
      that.setData({
        uhide: 0,
      })
    } else {
      that.setData({
        uhide: num,
      })
    }
    console.log(that.data.uhide)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var getAppInfo = app.globalData.bottom;//获取底部高度
    var https = config.http_url;
    const _this = this;
    this.setData({
      getAppInfo: getAppInfo,
      id: options.id
    })
    console.log(options)
    //渲染培训详情
    wx.request({
      url: https + '/train/signUp?id=' + options.id, //写自己的服务器
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        "openid": wx.getStorageSync('openid'),
        "skey": wx.getStorageSync('skey'),
      },
      method: "get",
      success: function (res) {
        wx.hideLoading()
        console.log(res.data.data)
        var arr1 = res.data.data; //从此次请求返回的数据中获取新数组
        _this.setData({

          train_list: arr1 //合并后更新train_list
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