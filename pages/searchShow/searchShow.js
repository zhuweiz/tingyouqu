// pages/searchShow/searchShow.js
var config = require('../../utils/config.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    HTTP: config.HTTP,//图片路径
    uhide: 0,//箭头旋转/隐藏显示
    touchS: [0, 0],
    touchE: [0, 0],
    searchShow:[],
    formData:'',
    flag: true,//遮罩
    name:[],
    page: 1, //页数
    pagenum: 6, //一页的数据量
    list:'',
  },
  ShowState: function (e) {
    var that = this;
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
  // 搜索
  goSearch: function (e) {
    var https = config.http_url;
    console.log(e)
    var that = this;
    var formData = e.detail.value;
    console.log(this.data.list)
    if (this.data.list != undefined){

    wx.showLoading({
      title: '加载中',
    })
    if (formData) {
      wx.request({
        url: https + '/search/find',
        data: {
          id: that.data.id,
          keyword: formData,
          page: that.data.page,
          pagenum: that.data.pagenum //一页的数据量
        },
        header: {
          "Content-Type": "application/x-www-form-urlencoded",
          'openid': wx.getStorageInfoSync("openid"),
          'skey': wx.getStorageInfoSync("skey"),
        },
        method: "get",
        success: function (res) {
          console.log(res.data)
          var searchShow = res.data.data
          that.setData({
            searchShow: searchShow,
            formData: formData
          })
          wx.hideLoading();
          if (res.data.data == '') {
            that.setData({
              flag: false,//遮罩
            })
          } else {
            that.setData({
              flag: true,//遮罩
            })
          }
        }
      })
    } else {

      wx.showToast({
        title: '输入不能为空',
        icon: 'none',
        duration: 1500
      })

    }
  }else{
    wx.showLoading({
      title: '加载中',
    })
    if (formData) {
      wx.request({
        url: https + '/search/find',
        data: {
          keyword: formData,
          page: that.data.page,
          pagenum: that.data.pagenum //一页的数据量
        },
        header: {
          "Content-Type": "application/x-www-form-urlencoded",
          'openid': wx.getStorageInfoSync("openid"),
          'skey': wx.getStorageInfoSync("skey"),
        },
        method: "get",
        success: function (res) {
          console.log(res.data.data)
          var searchShow = res.data.data
          // var searchShow_img = []
          // for (var i = 0; i < searchShow.length; i++) {
          //   searchShow_img = searchShow[i].images[0]
          //   searchShow[i]['img'] = searchShow_img
          // }
          that.setData({
            searchShow: searchShow,
            formData: formData
          })
          wx.hideLoading();
          if (res.data.data == '') {
            that.setData({
              flag: false,//遮罩
            })
          } else {
            that.setData({
              flag: true,//遮罩
            })
          }
        }
      })
    } else {

      wx.showToast({
        title: '输入不能为空',
        icon: 'none',
        duration: 1500
      })

    }
  }


  },


  thisSearch: function (e) {
    var https = config.http_url;
    console.log(e)
    var that = this;
    var formData = that.data.formData;
    if (this.data.list == 'list') {
      console.log('sad')
      wx.showLoading({
        title: '加载中',
      })
      wx.request({
        url: https + '/search/find',
        data: {
          id: that.data.id,
          keyword: formData,
          page: that.data.page,
          pagenum: that.data.pagenum //一页的数据量
        },
        header: {
          "Content-Type": "application/x-www-form-urlencoded",
          'openid': wx.getStorageInfoSync("openid"),
          'skey': wx.getStorageInfoSync("skey"),
        },
        method: "get",
        success: function (res) {
          console.log(res.data.data)
          wx.hideLoading();
          if (res.data.data == '') {
            that.setData({
              flag: false,//遮罩
            })
          } else {
            var searchShow = res.data.data
            var searchShow_img = []
            for (var i = 0; i < searchShow.length; i++) {
              searchShow_img = searchShow[i].images[0]
              searchShow[i]['img'] = searchShow_img
            }
            that.setData({
              flag: true,//遮罩
              searchShow: searchShow,
              // name: options.name
            })
          }
        }
      })
    }else{
      wx.showLoading({
        title: '加载中',
      })
      wx.request({
        url: https + '/search/find',
        data: {
          keyword: formData,
          page: that.data.page,
          pagenum: that.data.pagenum //一页的数据量
        },
        header: {
          "Content-Type": "application/x-www-form-urlencoded",
          'openid': wx.getStorageInfoSync("openid"),
          'skey': wx.getStorageInfoSync("skey"),
        },
        method: "get",
        success: function (res) {
          console.log(res)
          wx.hideLoading();
          if (res.data.data == '') {
            that.setData({
              flag: false,//遮罩
            })
          } else {
            var searchShow = res.data.data
            var searchShow_img = []
            for (var i = 0; i < searchShow.length; i++) {
              searchShow_img = searchShow[i].images[0]
              searchShow[i]['img'] = searchShow_img
            }
            that.setData({
              flag: true,//遮罩
              searchShow: searchShow,
              // name: options.name
            })
          }
        }
      })
    }

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    var https = config.http_url;
    let that = this
    that.setData({
      formData: options.formData,
      name: options.name,
      list: options.list,
      id: options.id
    })

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    let that = this
    that.thisSearch()
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
    var that = this;
    var page = that.data.page + 1; //获取当前页数并+1
    console.log(page)
    that.setData({
      page: page, //更新当前页数
    })
      var https = config.http_url;
      var that = this;
      var formData = that.data.formData;
    console.log(formData)
      wx.showLoading({
        title: '加载中',
      })
      wx.request({
        url: https + '/search/find',
        data: {
          keyword: formData,
          page: that.data.page,
          pagenum: that.data.pagenum //一页的数据量
        },
        header: {
          "Content-Type": "application/x-www-form-urlencoded",
          'openid': wx.getStorageInfoSync("openid"),
          'skey': wx.getStorageInfoSync("skey"),
        },
        method: "get",
        success: function (res) {
          console.log(res.data)
          wx.hideLoading();
          if (res.data.data == '') {
            wx.showToast({
              title: '没有更多了',
              icon: 'none',
              duration: 1500
            })
          } else {
            var searchShow2 = that.data.searchShow
            var searchShow = res.data.data
            var searchShow_img = []
            for (var i = 0; i < searchShow.length; i++) {
              searchShow_img = searchShow[i].images[0]
              searchShow[i]['img'] = searchShow_img
            }
            that.setData({
              searchShow: searchShow2.concat(searchShow),
              // name: options.name
            })
          }
        }
      })

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})