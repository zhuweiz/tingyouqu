// pages/personage/personage.js
const app = getApp()
var config = require('../../utils/config.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    getAppInfo: '',//判断手机 底部高度
    // personage:{},
    hideFlag: true,//true-隐藏  false-显示
    optionList: ['企业', '个人'],
    value: '企业',
    animationData: {},//
    nickname: '', //用户名字
    phone: '', //手机号码
    content: '', //企业名字
    website: '',//网站
    address: '请选择位置'
  },
  quxiao(){
    wx.navigateBack({
      delta: 1
    })
  },
  handlenameChange(e) {//填写姓名
    this.data.nickname = e.detail.value;
    console.log(this.data.nickname)
  },
  handleContactChange(e) { //填写联系方式
    this.data.phone = e.detail.value;
    console.log(this.data.phone)
  },
  handlecontentChange(e) { //填写企业名称
    this.data.content = e.detail.value;
    console.log(this.data.content)
  },
  handlewebsite(e) { //填写网站
    this.data.website = e.detail.value;
    console.log(this.data.website)
  },
  handleAddressClick() {
    var _this = this
    wx.authorize({
      scope: 'scope.userLocation',
      success: (res) => {
        console.log('成功：', res)
        wx.chooseLocation({
          success: this.handleChooseLocationSucc.bind(this)
        })
      },
      fail: (res) => {
        console.log('失败：', res)
        _this.openConfirm();
      },
    })

  },
  openConfirm: function () {
    wx.showModal({
      content: '检测到您没打开此小程序的定位权限，是否去设置打开？',
      confirmText: "确认",
      cancelText: "取消",
      success: function (res) {
        console.log(res);
        //点击“确认”时打开设置页面
        if (res.confirm) {
          console.log('用户点击确认')
          wx.openSetting({
            success: (res) => { }
          })
        } else {
          console.log('用户点击取消')
        }
      }
    });
  },

  handleChooseLocationSucc(res) {
    this.setData({
      address: res.address
    });
    console.log(res.address)
  },

  handleSubmit(e) { //发送
    var https = config.http_url;
    var id = this.data.id
    console.log(id)
    const _this = this;
    if (this.data.value == '企业') {
      this.data.value = 1
    } else if (this.data.value == '个人') {
      this.data.value = 2
    }
    console.log(this.data.value)
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
    } else if (this.data.address == '请选择位置' || this.data.address == '') {
      wx.showToast({
        title: '请选择您的位置！',
        icon: 'none',
        duration: 1500
      })
      return false;
    } if (this.data.value == '1') {
      if (!_this.data.content) {
        wx.showToast({
          title: '请填写您的企业名称！',
          icon: 'none',
          duration: 1500
        })
        return false;
      }

    }


    wx.request({
      url: https + '/member/registerData',
      data: {
        realname: this.data.nickname, // 昵称
        phone: this.data.phone, // 电话
        address: this.data.address, // 地址
        type: this.data.value, // 1:企业  2:个人
        company_name: this.data.content, // 公司名字
        weisite_url: this.data.website // 公司网站

      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        "openid": wx.getStorageSync('openid'),
        "skey": wx.getStorageSync('skey'),
      },
      method: "post",
      success: function (res) {
        console.log(res)
        wx.setStorageSync('realname', _this.data.nickname)
        wx.showToast({
          title: '保存成功',
          icon: 'success',
          duration: 2500,
          mask: true,
          success(data) {
        
            setTimeout(function () {
              //要延时执行的代码
              wx.navigateBack({
                delta: 1
              })

            }, 1500) //延迟时间
          }
        })

      },
      fail: function () {
        console.log("fail")
      }

    })
  },
  // 点击选项
  getOption: function (e) {
    var that = this;
    that.setData({
      value: e.currentTarget.dataset.value,
      hideFlag: true
    })
  },
  //取消
  mCancel: function () {
    var that = this;
    that.hideModal();
  },
  // ----------------------------------------------------------------------modal
  // 显示遮罩层
  showModal: function () {
    var that = this;
    that.setData({
      hideFlag: false
    })
    // 创建动画实例
    var animation = wx.createAnimation({
      duration: 400,//动画的持续时间
      timingFunction: 'ease',//动画的效果 默认值是linear->匀速，ease->动画以低速开始，然后加快，在结束前变慢
    })
    this.animation = animation; //将animation变量赋值给当前动画
    var time1 = setTimeout(function () {
      that.slideIn();//调用动画--滑入
      clearTimeout(time1);
      time1 = null;
    }, 100)
  },

  // 隐藏遮罩层
  hideModal: function () {
    var that = this;
    var animation = wx.createAnimation({
      duration: 400,//动画的持续时间 默认400ms
      timingFunction: 'ease',//动画的效果 默认值是linear
    })
    this.animation = animation
    that.slideDown();//调用动画--滑出
    var time1 = setTimeout(function () {
      that.setData({
        hideFlag: true
      })
      clearTimeout(time1);
      time1 = null;
    }, 220)//先执行下滑动画，再隐藏模块

  },
  //动画 -- 滑入
  slideIn: function () {
    this.animation.translateY(0).step() // 在y轴偏移，然后用step()完成一个动画
    this.setData({
      //动画实例的export方法导出动画数据传递给组件的animation属性
      animationData: this.animation.export()
    })
  },
  //动画 -- 滑出
  slideDown: function () {
    this.animation.translateY(300).step()
    this.setData({
      animationData: this.animation.export(),
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var getAppInfo = app.globalData.bottom;//获取底部高度
    this.setData({
      getAppInfo: getAppInfo
    })
    wx.showLoading({
      title: '加载中~',
    })
    var _this = this
    var https = config.http_url;
    wx.request({
      url: https + '/member/getData',
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        "openid": wx.getStorageSync('openid'),
        "skey": wx.getStorageSync('skey'),
      },
      method: "GET",
      success: function (res) {
        wx.hideLoading()
        console.log(res.data.data)
        if (res.data.data.type == '2'){
          _this.setData({
            value: '个人'
          })
        } else if (res.data.data.type == '1'){
          _this.setData({
            value: '企业'
          })
        }
        _this.setData({
          //  personage: res.data.data,
          nickname: res.data.data.realname, //用户名字
          phone: res.data.data.phone, //手机号码
          content: res.data.data.company_name, //企业名字
          website: res.data.data.website_url,//网站
          address: res.data.data.address
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