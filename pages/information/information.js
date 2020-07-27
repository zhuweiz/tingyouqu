// pages/circle/circle.js
const app = getApp();
var openid = wx.getStorageSync('openid')
var config = require('../../utils/config.js')
Page({
  data: {
    HTTP: config.HTTP,//图片路径
    clickImg9: true,
    information:[],
    channel:[],//频道列表
    current:1,
    getAppInfo: app.globalData.bottom, //判断手机 底部高度
    bnrUrl: [],//轮播图
    page: 1,//页数
    pagenum:4,//一页的数据量
    nvabarData: {
      showCapsule: 0, //是否显示左上角图标   1表示显示    0表示不显示
      title2: '热榜资讯', //导航栏 中间的标题
      white2: false,
      address2: '' // 加个背景 不加就是没有
    },
    // 导航头的高度
    height: app.globalData.height * 2 + 20,
    navData: [
      {
        name: "首页",  //文本
        current: 0,    //是否是当前页，0不是  1是
        style: 0,     //样式
        ico: '../../img/shouye.png',  //不同图标
        fn: 'gotoIndex'   //对应处理函数
      }, {
        name: "品牌",
        current: 0,
        style: 0,
        ico: '../../img/fenlei.png',
        fn: 'gotoOldGoods'
      }, {
        name: "pk",
        current: 0,
        style: 1,
        ico: '',
        fn: 'gotoPublish'
      }, {
        name: "热榜资讯",
        current: 1,
        style: 0,
        ico: '../../img/reban2.png',
        fn: 'gotoRecruit'
      }, {
        name: "我的",
        current: 0,
        style: 0,
        ico: '../../img/wode.png',
        fn: 'gotoMine'
      },
    ],
  },
  gotoIndex: function () {
    wx.switchTab({
      url: '/pages/index/index',
    });
  },
  gotoPublish: function () {
    var _this = this
    this.setData({
      clickImg9: false
    })
    setTimeout(function () {
      wx.navigateTo({
        url: '/pages/comparison/comparison',
      })
      _this.setData({
        clickImg9: true
      })
    }, 400)
  },
  gotoOldGoods: function () {
    wx.switchTab({
      url: '/pages/classify/classify',
    });
  },
  gotoMine: function () {
    wx.switchTab({
      url: '/pages/mine/mine',
    });
  },






  onClickItem(e) {//点击切换
    console.log(e.currentTarget.dataset.idx)//获取自定义的值
    let idx = e.currentTarget.dataset.idx

    if (this.current !== idx) {
      this.setData({ 
        current: idx, 
        page: 1, //更新当前页数
      })
    }

    var https = config.http_url;
    const _this = this;
    wx.request({//渲染详情页
      url: https + '/article/list', //写自己的服务器
      data: {
        id: idx,
        page: 1,
        pagenum: 4, //每页显示条数
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        "openid": wx.getStorageSync('openid'),
        "skey": wx.getStorageSync('skey'),
      },
      method: "get",
      success: function (res) {
        console.log(res)
        _this.setData({
          information: res.data.data.list,//合并后更新information
        })

      },
      fail: function () {
        console.log("fail")
      }

    })


  },
  getdatalist: function () {
    wx.showLoading({
      title: '加载中~',
    })
    var https = config.http_url;
    const _this = this;
    wx.request({//渲染详情页
      url: https + '/article/list', //写自己的服务器
      data: {
        id: _this.data.current,
        page:_this.data.page,
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
        wx.hideLoading()
        var arr1 = _this.data.information; //从data获取当前datalist数组
    
        var arr2 = res.data.data.list; //从此次请求返回的数据中获取新数组
        arr1 = arr1.concat(arr2); //合并数组
        console.log(res.data.data.recommend)
        console.log(arr1)
        if (res.data.data.list == 0) {
          wx.showToast({
            title: '没有更多了',
            icon: 'none',
            duration: 1500
          })
        }
        _this.setData({
          information: arr1,//合并后更新information
        })

      },
      fail: function () {
        console.log("fail")
      }

    })
  },
  //浏览量上报
  browse:function(e){
    var https = config.http_url;
    var views =e.currentTarget.dataset.views
    var url = e.currentTarget.dataset.id
    console.log(views)
    wx.request({
      url: https + '/article/views', //写自己的服务器
      data:{
        id:views
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        'openid': wx.getStorageInfoSync("openid"),
        'skey': wx.getStorageInfoSync("skey"),
      },
      method: "get",
      success: function (res) {
        console.log(res)
        // _this.setData({
        //   hotword: res.data.data
        // })
      },
      fail: function () {
        console.log("fail")
      }
    })

    if (url != ''){
      wx.navigateTo({
        url: '../gzh/gzh?id=' + url,
      })
    }else{
      wx.navigateTo({
        url: '../infoxiangqin/infoxiangqin?id=' + views,
      })
    }
 
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const _this = this;
    _this.getdatalist();
   

      var https = config.http_url;

    wx.request({ //频道列表
      url: https + '/article/channels', //写自己的服务器
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        "openid": wx.getStorageSync('openid'),
        "skey": wx.getStorageSync('skey'),
      },
      method: "get",
      success: function (res) {
        console.log(res.data.data)
        _this.setData({
          channel: res.data.data
        })
      },
      fail: function () {
        console.log("fail")
        wx.hideLoading();
      }

    })
    wx.request({//渲染详情页
      url: https + '/article/list', //写自己的服务器
      data: {
        id: _this.data.current,
        page: 1,
        pagenum: 4, //每页显示条数
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        "openid": wx.getStorageSync('openid'),
        "skey": wx.getStorageSync('skey'),
      },
      method: "get",
      success: function (res) {
        console.log(res)
        _this.setData({
          bnrUrl: res.data.data.recommend
        })

      },
      fail: function () {
        console.log("fail")
      }

    })

    
  },
  showLoading: function () { // api交互，显示loading提示框
    wx.showLoading({
      title: '加载中',
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
    var that = this;
    var page = that.data.page + 1; //获取当前页数并+1
    that.setData({
      page: page, //更新当前页数
    })
    that.getdatalist();//重新调用请求获取下一页数据
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})