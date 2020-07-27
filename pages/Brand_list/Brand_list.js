// pages/Brand_list/Brand_list.js
var config = require('../../utils/config.js')
var WxParse = require('../../wxParse/wxParse.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    HTTP: config.HTTP, //图片路径
    uhide: 0,//箭头旋转/隐藏显示
    touchS: [0, 0],
    touchE: [0, 0],
    id:'',
    article:'',
    flag: true,//遮罩
    brand_list: [],//品牌列表页
    page: 1,//页数
    pagenum: 5,//一页的数据量
    issd:false,
    brand:{}
  },


  // 下来
  btnClick: function () {
   var isd = this.data.issd
    isd = !isd
    this.setData({
      issd: isd
    })
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


  getdatalist: function () {
    var https = config.http_url;
    const _this = this;
 
    var id = _this.data.id
    wx.request({ //列表渲染
      url: https + '/product/brand?id=' + id, //写自己的服务器
      data: {
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
        console.log(res)
        var arr1 = _this.data.brand_list; //从data获取当前datalist数组
        var brand_list = res.data.data.productList
        var content = res.data.data.brand.content
        arr1 = arr1.concat(brand_list); //合并数组
        var brand_list_img = []
        for (var i = 0; i < brand_list.length; i++) {
          brand_list_img = brand_list[i].images
          brand_list[i]['brand_list_img'] = brand_list_img[0]
          // console.log(a)
        }
        if (res.data.data.productList == '') {
          _this.setData({
            flag: false,//遮罩
          })
        } else {
          _this.setData({
            flag: true,//遮罩
          })
        }
        _this.setData({
          brand_list: arr1,//合并后更新information
          brand: res.data.data.brand,
          article: content,
        })
        if (content){
          WxParse.wxParse('article', 'html', _this.data.article, _this, 5);
        }
       
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
    var https = config.http_url;
    const _this = this;
    console.log(options)
    var id = options.id
    _this.setData({
      id: options.id
    })


    //设置导航栏为对应导航
    wx.setNavigationBarTitle({
      title: (options.name != '' ? options.name : '')
    })
    _this.getdatalist('正在加载数据...');
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
    const _this = this;
    var page = _this.data.page + 1; //获取当前页数并+1
    _this.setData({
      page: page, //更新当前页数
    })
    var https = config.http_url;
 

    var id = _this.data.id
    wx.request({ //列表渲染
      url: https + '/product/brand?id=' + id, //写自己的服务器
      data: {
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
        console.log(res)
        var arr1 = _this.data.brand_list; //从data获取当前datalist数组
        var brand_list = res.data.data.productList
        arr1 = arr1.concat(brand_list); //合并数组
        var brand_list_img = []
        for (var i = 0; i < brand_list.length; i++) {
          brand_list_img = brand_list[i].images
          brand_list[i]['brand_list_img'] = brand_list_img[0]
          // console.log(a)
        }
        if (res.data.data.productList == 0) {
          wx.showToast({
            title: '没有更多了',
            icon: 'none',
            duration: 1500
          })
        }
        _this.setData({
          brand_list: arr1//合并后更新information
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