// pages/ma_ticket/ma_ticket.js
const app = getApp()
var config = require('../../utils/config.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    /* 页面配置 */
    HTTP: config.HTTP, //图片路径
    pastlist:[],//无效票
    validlist:[],//有效票
    // tab切换  
    currentTab: 0, 
    page: 1,//页数
    
    pagenum: 6,//一页的数据量
    isHide: '',
  },
  /** 
   * 点击tab切换 
   */
  swichNav: function (e) {

    var that = this;

    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current
      })
    }
  },
  remove(e) {//删除
    var https = config.http_url;
    var orderno = e.currentTarget.dataset.orderno
    var that = this;
  

    wx.request({
      url: https + '/member/orderDel', //写自己的服务器
      data: {
        orderno: orderno,    // 订单号
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        "openid": wx.getStorageSync('openid'),
        "skey": wx.getStorageSync('skey'),
      },
      method: "post",
      success: function (res) {
        console.log(res)

        wx.showToast({
          title: '删除成功',
          icon: 'success',
          duration: 1500
        })
        console.log(that.data.pastlist.length)
        if (that.data.pastlist.length < 1) {
          console.log("asd")
          that.setData({
            isHide2: true
          })
        }
        that.onShow()
      },
      fail: function () {
        console.log("fail")
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
    var https = config.http_url;
    var _this = this;
    wx.showLoading({
      title: '加载中',
    })
    var page = 1
    var pagenum = 6
    wx.request({
      url: https + '/member/ticketOrderList', //写自己的服务器
      data: {
        status: 1,
        page: page,
        pagenum:pagenum, //每页显示条数
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        "openid": wx.getStorageSync('openid'),
        "skey": wx.getStorageSync('skey'),
      },
      method: "get",
      success: function (res) {
        console.log(res.data.data)
        wx.hideLoading() //隐藏 loading 提示框
        var a = []
        var List = res.data.data
        for (var i = 0; i < List.length; i++) {
          a = List[i].images.split(',')[0]
          List[i]['List_img'] = a
          // console.log(a)
        }
        if (res.data.data.length > 0) {
          _this.setData({
            validlist: res.data.data,
            isHide: false
          })
        } else {
          _this.setData({
            isHide: true
          })
        }
      },
      fail: function () {
        console.log("fail")
      }

    })
    wx.request({
      url: https + '/member/ticketOrderList', //写自己的服务器
      data: {
        status:2,
        page: page,
        pagenum: pagenum, //每页显示条数
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        "openid": wx.getStorageSync('openid'),
        "skey": wx.getStorageSync('skey'),
      },
      method: "get",
      success: function (res) {
        console.log(res)
        var a = []
        var List = res.data.data
        for (var i = 0; i < List.length; i++) {
          a = List[i].images.split(',')[0]
          List[i]['List_img'] = a
          // console.log(a)
        }
        if (res.data.data.length > 0) {
          _this.setData({
            pastlist: res.data.data,
            isHide2: false
          })
        } else {
          _this.setData({
            isHide2: true
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
    console.log('reach bottom')
    var https = config.http_url;
    let _this = this;
    var page = _this.data.page + 1; //获取当前页数并+1
    _this.setData({
      page: page, //更新当前页数
    })
    if (_this.data.currentTab == 0) {
      wx.request({
        url: https + '/member/ticketOrderList', //写自己的服务器
        data: {
          status: 1,
          page: _this.data.page,
          pagenum: _this.data.pagenum, //每页显示条数
        },
        header: {
          "Content-Type": "application/x-www-form-urlencoded",
          "openid": wx.getStorageSync('openid'),
          "skey": wx.getStorageSync('skey'),
        },
        method: "get",
        success: function (res) {
          var a = []
          var List = res.data.data
          for (var i = 0; i < List.length; i++) {
            a = List[i].images.split(',')[0]
            List[i]['List_img'] = a
            // console.log(a)
          }
          var arr1 = _this.data.validlist;
          if (res.data.data.length < 1) {
            wx.showToast({
              title: '没有更多了~',
              icon: 'none',
              duration: 1500
            })
          } else {
            _this.setData({
              validlist: arr1.concat(List)
            })
          }
        },
        fail: function () {
          console.log("fail")
        }

      })
    }
    if (_this.data.currentTab == 1) {
      wx.request({
        url: https + '/member/ticketOrderList', //写自己的服务器
        data: {
          status: 2,
          page: _this.data.page,
          pagenum: _this.data.pagenum, //每页显示条数
        },
        header: {
          "Content-Type": "application/x-www-form-urlencoded",
          "openid": wx.getStorageSync('openid'),
          "skey": wx.getStorageSync('skey'),
        },
        method: "get",
        success: function (res) {
          var a = []
          var List = res.data.data
          for (var i = 0; i < List.length; i++) {
            a = List[i].images.split(',')[0]
            List[i]['List_img'] = a
            // console.log(a)
          }
          var arr2 = _this.data.pastlist;
          if (res.data.data.length < 1) {
            wx.showToast({
              title: '没有更多了~',
              icon: 'none',
              duration: 1500
            })
          } else {
            _this.setData({
              pastlist: arr2.concat(List)
            })
          }
        },
        fail: function () {
          console.log("fail")
        }

      })
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})