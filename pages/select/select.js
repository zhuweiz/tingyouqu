// pages/select/select.js
var config = require('../../utils/config.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    HTTP: config.HTTP, //图片路径
    id: '',
    productList:[],//产品列表
    hasMoreData: true,	//上拉时是否继续请求数据，即是否还有更多数据
    flag: true,//遮罩
    name:'',
    page: 1, //页数
    pagenum: 6 //一页的数据量
  },

  duibi(e) {//对比接口
  console.log(e)
    var https = config.http_url;
    const _this = this;
    var id = e.currentTarget.dataset.id
    wx.request({
      url: https + '/product/compareAddId', //写自己的服务器
      data: {
        id: id
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        "openid": wx.getStorageSync('openid'),
        "skey": wx.getStorageSync('skey'),
      },
      method: "get",
      success: function (res) {
        console.log(res)
        if (res.data.msg == '已在对比列表中'){
          wx.showToast({
            title: '已在对比列表中',
          })
        }else{
          wx.showToast({
            title: '添加成功',
          })
          wx.navigateBack({
            delta: 2,
          })
        }
      
        _this.setData({
          msg: res.data.msg,//已加入对比
        })
        var msg = _this.data.msg
        wx.setStorage({//存储到本地
          key: "msg",
          data: msg
        })
     
      },
      fail: function () {
        console.log("fail")
      }

    })
  },


  getdatalist: function (message) {//渲染当前列表页
    wx.showNavigationBarLoading()					//在当前页面显示导航条加载动画
    wx.showLoading({								//显示 loading 提示框
      title: message,
    })
    var https = config.http_url;
    const _this = this;

    var id = _this.data.id
    var name = _this.data.name
    wx.request({ //列表渲染
      url: https + '/product/brand?id=' + id, //写自己的服务器
      data: {
        page: _this.data.page,
        pagenum: _this.data.pagenum //一页的数据量
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        "openid": wx.getStorageSync('openid'),
        "skey": wx.getStorageSync('skey'),
      },
      method: "get",
      success: function (res) {
        console.log(res.data.data)
        var contentlistTem = _this.data.productList;
        var productList = res.data.data.productList;//列表页
        var productList_img = []
        for (var i = 0; i < productList.length; i++) {
          productList_img = productList[i].images
          productList[i]['productList_img'] = productList_img[0]
        }
        wx.hideNavigationBarLoading()		//在当前页面隐藏导航条加载动画
        wx.hideLoading()					//隐藏 loading 提示框
        if (res.data.data.productList.length > 0) {

          if (_this.data.page == 1) {
            contentlistTem = []
          }
          var productList = res.data.data.productList;//列表页
          console.log(res.data.data.productList)
          if (productList.length < _this.data.pagenum) {
            _this.setData({
              productList: contentlistTem.concat(productList),
              hasMoreData: false,
              id: _this.data.id
            })
          } else {
            _this.setData({
              productList: contentlistTem.concat(productList),
              hasMoreData: true,
              page: _this.data.page + 1
            })
          }
        }else{
          _this.setData({
            flag: false,//遮罩
          })
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
    console.log(options)
    var https = config.http_url;
    const _this = this;
    var id = options.id
    console.log(id)
    _this.setData({
      id: id,
      name: options.name
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
    console.log("ee")
    if (this.data.hasMoreData) {
      this.getdatalist('加载更多数据')
    } else {
      wx.showToast({
        title: '没有更多数据',
      })
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
 
  }
})