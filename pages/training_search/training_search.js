// pages/information_list/information_list.js
const app = getApp();
var openid = wx.getStorageSync('openid')
var config = require('../../utils/config.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    HTTP: config.HTTP,//图片路径
    flag: true,//遮罩
    id: '',
    name: '',
    formData:'',
    products:[],
    sercherStorage2: [], //最近搜索内容
    page: 1, //页数
    pagenum: 8, //一页的数据量
  },
  openLocationsercher: function () {//获取搜索缓存
    console.log(wx.getStorageSync('peixun'))
    this.setData({
      sercherStorage2: wx.getStorageSync('peixun') || [],
      StorageFlag: true,
      listFlag: true,
    })
  },
  // 搜索
  goSearch: function (e) {
    var https = config.http_url;
    console.log(e)
    var that = this;
    var formData = e.detail.value;
    that.setData({
      page:1,
      formData: formData
    })
    if (formData) {

      var searchData = that.data.sercherStorage2;
      let arrnum = searchData.indexOf(formData)
      console.log(arrnum)
      if (arrnum != -1) {
        // 删除已存在后重新插入至数组
        searchData.splice(arrnum, 1)
        searchData.unshift(formData);

      } else {
        searchData.unshift(formData);
      }
      wx.setStorageSync('peixun', searchData);
      wx.request({//渲染详情页
        url: https + '/search/train', //写自己的服务器
        data: {
          from: that.data.id,
          keyword: formData,
          page: that.data.page,
          pagenum: that.data.pagenum, //一页的数据量
        },
        header: {
          "Content-Type": "application/x-www-form-urlencoded",
          "openid": wx.getStorageSync('openid'),
          "skey": wx.getStorageSync('skey'),
        },
        method: "get",
        success: function (res) {
          console.log(res)
          if (res.data.products == '') {
            that.setData({
              flag: false,//遮罩
            })
          } else {
            that.setData({
              flag: true,//遮罩
            })
          }
          that.setData({
            products: res.data.products,//合并后更新information
          })

        },
        fail: function () {
          console.log("fail")
        }

      })



    } else {

      wx.showToast({
        title: '输入不能为空',
        icon: 'none',
        duration: 1500
      })

    }
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    var https = config.http_url;

    const _this = this;
    _this.setData({
      id: options.id,
      name: options.name,
      formData: options.formData
    })
    wx.request({//渲染详情页
      url: https + '/search/train', //写自己的服务器
      data: {
        from: options.id,
        keyword: options.formData,
        page: _this.data.page,
        pagenum: _this.data.pagenum, //一页的数据量
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        "openid": wx.getStorageSync('openid'),
        "skey": wx.getStorageSync('skey'),
      },
      method: "get",
      success: function (res) {
        console.log(res)
        if (res.data.products == '') {
          _this.setData({
            flag: false,//遮罩
          })
        } else {
          _this.setData({
            flag: true,//遮罩
          })
        }
        _this.setData({
          products: res.data.products,//合并后更新information
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
    this.openLocationsercher();
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

    const _this = this;
    var page = _this.data.page + 1; //获取当前页数并+1
    _this.setData({
      page: page, //更新当前页数
    })
    wx.request({//渲染详情页
      url: https + '/search/train', //写自己的服务器
      data: {
        from: _this.id,
        keyword: _this.formData,
        page: _this.data.page,
        pagenum: _this.data.pagenum, //一页的数据量
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        "openid": wx.getStorageSync('openid'),
        "skey": wx.getStorageSync('skey'),
      },
      method: "get",
      success: function (res) {
        var arr1 = _this.data.products; //从data获取当前datalist数组
        if (res.data.products.length < 1) {
          wx.showToast({
            title: '没有更多了~',
            icon: 'none',
            duration: 1500
          })
        }
        var productList = res.data.products
        arr1 = arr1.concat(productList); //合并数组
        _this.setData({
          products: arr1, //合并后更新train_list
        })

      },
      fail: function () {
        console.log("fail")
      }

    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})