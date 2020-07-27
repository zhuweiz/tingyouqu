// pages/collect/collect.
var config = require('../../utils/config.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    HTTP: config.HTTP,//图片路径
    /* 页面配置 */
    flag: true,//遮罩
    flag2: true,//遮罩
    flag3: true,//遮罩
    flag4: true,//遮罩
    winWidth: 0,
    winHeight: 0,
    collect_list:[],
    gift_list:[],
    activity_list:[],
    hanxian_list:[],
    // tab切换  
    currentTab: 0, 
    from:1,
    page: 1,//页数
    pagenum: 7,//一页的数据量
  },
  /* 点击tab切换*/
  swichNav: function (e) {
    var from = e.target.dataset.from
    console.log(e)
    var that = this;

    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current,
        from: from
      })
    }
    console.log(from)
  },
  remove(e){//删除
    var https = config.http_url;
    var from = e.currentTarget.dataset.from
    var id = e.currentTarget.dataset.id
    var that = this;
    console.log(from)
    console.log(id)
    wx.request({
      url: https + '/member/collectionDel', //写自己的服务器
      data: {
        id:id,    // 商品id
        from:from // 来源 1:产品  2:活动  3:礼品
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
        if (that.data.activity_list.length == 1){
          that.setData({
            flag2: true
          })
        }
        if (that.data.collect_list.length == 1) {
          that.setData({
            flag: true
          })
        }
       
        if (that.data.gift_list.length == 1) {
          that.setData({
            flag3: true
          })
        }
        if (that.data.hanxian_list.length == 1) {
          that.setData({
            flag4: true
          })
        }
        console.log(that.data.collect_list)
        that.onShow()
      },
      fail: function () {
        console.log("fail")
      }
    })
  },
  // product
  activity_list:function(e){//活动行收藏
    var https = config.http_url;
    var that = this;
    wx.request({
      url: https + '/member/collectionList', //写自己的服务器
      data: {
        from: 2,  // 来源 1:产品  2:活动  3:礼品
        page: that.data.page,
        pagenum: that.data.pagenum, //每页显示条数
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        "openid": wx.getStorageSync('openid'),
        "skey": wx.getStorageSync('skey'),
      },
      method: "get",
      success: function (res) {
        var activity_list = res.data.data
        console.log(res)
        if (res.data.data.length > 0) {
          that.setData({
            activity_list: activity_list,
            flag2: false
          })
        } else {
          flag2: true
        }

      },
      fail: function () {
        console.log("fail")
      }

    })
  },
  gift_list:function(e){//礼品收藏
    var https = config.http_url;
    var from = this.data.from
    var that = this;
    wx.request({
      url: https + '/member/collectionList', //写自己的服务器
      data: {
        from: 3,  // 来源 1:产品  2:活动  3:礼品
        page: that.data.page,
        pagenum: that.data.pagenum, //每页显示条数

      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        "openid": wx.getStorageSync('openid'),
        "skey": wx.getStorageSync('skey'),
      },
      method: "get",
      success: function (res) {
        var gift_list = res.data.data
        console.log(res.data.data)
        // console.log(res.data.data.id)
        if (res.data.data.length > 0) {
          that.setData({
            gift_list: gift_list,
            flag3: false
          })
        } else {
          flag3: true
        }
      },
      fail: function () {
        console.log("fail")
      }

    })
  },
  hanxian_list: function (e) {//航线收藏
    var https = config.http_url;
    var from = this.data.from
    var that = this;
    wx.request({
      url: https + '/member/collectionList', //写自己的服务器
      data: {
        from: 4,  // 来源 1:产品  2:活动  3:礼品
        page: that.data.page,
        pagenum: that.data.pagenum, //每页显示条数

      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        "openid": wx.getStorageSync('openid'),
        "skey": wx.getStorageSync('skey'),
      },
      method: "get",
      success: function (res) {
        var hanxian_list = res.data.data
        console.log(res.data.data)
        // console.log(res.data.data.id)
        if (res.data.data.length > 0) {
          that.setData({
            hanxian_list: hanxian_list,
            flag4: false
          })
        } else {
          flag4: true
        }
      },
      fail: function () {
        console.log("fail")
      }

    })
  },
  /*  滑动切换tab */
  bindChange: function (e) {
    var that = this;
    that.setData({ currentTab: e.detail.current });

  },
  /* 生命周期函数--监听页面加载 */
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
    var from = this.data.from
    var that = this;
    wx.showLoading({ //显示 loading 提示框
      title: '加载中',
    })
    wx.request({
      url: https + '/member/collectionList', //写自己的服务器
      data: {
        from: 1,  // 来源 1:产品  2:活动  3:礼品
        page: that.data.page,
        pagenum: that.data.pagenum, //每页显示条数

      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        "openid": wx.getStorageSync('openid'),
        "skey": wx.getStorageSync('skey'),
      },
      method: "get",
      success: function (res) {

        var collect_list = res.data.data
        wx.hideLoading() //隐藏 loading 提示框
        console.log(res.data.data)
        if (res.data.data.length > 0) {
          that.setData({
            collect_list: collect_list,
            flag: false
          })
        } else {
          flag: true
        }
      },
      fail: function () {
        console.log("fail")
      }

    })
    this.activity_list()
    this.gift_list()
    this.hanxian_list()
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
    var https = config.http_url;
    let _this = this;
    // wx.showLoading({//显示 loading 提示框
    //   title: '加载中...',
    // })
    var page = _this.data.page + 1; //获取当前页数并+1
    _this.setData({
      page: page, //更新当前页数
    })
    if (_this.data.currentTab == 0) {
      wx.request({
        url: https + '/member/collectionList', //写自己的服务器
        data: {
          from: 1,  // 来源 1:产品  2:活动  3:礼品
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
          var collect_list = res.data.data

          console.log(res.data.data)
          var arr1 = _this.data.collect_list;
          if (res.data.data.length < 1) {
            wx.showToast({
              title: '没有更多了~',
              icon: 'none',
              duration: 1500
            })
          } else {
            _this.setData({
              collect_list: arr1.concat(collect_list)
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
        url: https + '/member/collectionList', //写自己的服务器
        data: {
          from: 2,  // 来源 1:产品  2:活动  3:礼品
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
          var activity_list = res.data.data
          var arr1 = _this.data.activity_list;
          if (res.data.data.length < 1) {
            wx.showToast({
              title: '没有更多了~',
              icon: 'none',
              duration: 1500
            })
          } else {
            _this.setData({
              activity_list: arr1.concat(activity_list)
            })
          }
        },
        fail: function () {
          console.log("fail")
        }

      })
    }
    if (_this.data.currentTab == 2) {
      wx.request({
        url: https + '/member/collectionList', //写自己的服务器
        data: {
          from: 3,  // 来源 1:产品  2:活动  3:礼品
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
          var gift_list = res.data.data
          var arr1 = _this.data.gift_list;
          if (res.data.data.length < 1) {
            wx.showToast({
              title: '没有更多了~',
              icon: 'none',
              duration: 1500
            })
          } else {
            _this.setData({
              gift_list: arr1.concat(gift_list)
            })
          }
        },
        fail: function () {
          console.log("fail")
        }

      })
    }
    if (_this.data.currentTab == 3) {
      wx.request({
        url: https + '/member/collectionList', //写自己的服务器
        data: {
          from: 4,  // 来源 1:产品  2:活动  3:礼品
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
          var hanxian_list = res.data.data
          var arr1 = _this.data.hanxian_list;
          if (res.data.data.length < 1) {
            wx.showToast({
              title: '没有更多了~',
              icon: 'none',
              duration: 1500
            })
          } else {
            _this.setData({
              hanxian_list: arr1.concat(hanxian_list)
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