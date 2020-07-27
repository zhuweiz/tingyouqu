// pages/classify/classify.js
const app = getApp()
var config = require('../../utils/config.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pinpai_list:[],//测试
    clickImg9: true,
    //搜索列表
    hidden: true,
    showPy: '#',
    scrollTopId:'',
    HTTP: config.HTTP,//图片路径
    page: 1,//页数
    pagenum: 10,//一页的数据量
    getAppInfo: app.globalData.bottom, //判断手机 底部高度
    nvabarData: {
      showCapsule: 0, //是否显示左上角图标   1表示显示    0表示不显示
      title2: '品牌分类', //导航栏 中间的标题
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
        current: 1,
        style: 0,
        ico: '../../img/fenlei2.png',
        fn: 'gotoOldGoods'
      }, {
        name: "pk",
        current: 0,
        style: 1,
        ico: '',
        fn: 'gotoPublish'
      }, {
        name: "热榜资讯",
        current: 0,
        style: 0,
        ico: '../../img/reban.png',
        fn: 'gotoRecruit'
      }, {
        name: "我的",
        current: 0,
        style: 0,
        ico: '../../img/wode.png',
        fn: 'gotoMine'
      },
    ],
    classify_list:[],//其它品牌
    classify_hot:[],//热门品牌
    page: 1,//页数
    pagenum: 10//一页的数据量
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
  gotoRecruit: function () {
    wx.switchTab({
      url: '/pages/information/information',
    });
  },
  gotoMine: function () {
    wx.switchTab({
      url: '/pages/mine/mine',
    });
  },

  //获取文字信息
  getPy: function (e) { //点击跳转指定位置
    console.log(e)
    this.setData({
      hidden: false,
      showPy: e.target.id,
    })
  },
  //触发全部开始选择
  tStart: function () {
    this.setData({
      hidden: false
    })
  },

  //触发结束选择
  tEnd: function () {
    this.setData({
      hidden: true,
      scrollTopId: this.data.showPy
    })
  },
  getdatalist: function () {
    const _this = this;
    var https = config.http_url;
    wx.showLoading({
      title: '加载中~',
    })
    //渲染礼品列表页
    wx.request({
      url: https + '/brand/index', //写自己的服务器
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
        wx.hideLoading()
        console.log(res)
        var arr1 = _this.data.classify_list;
        var arr2 = _this.data.classify_hot;
        var classify_list = res.data.data.list; //从此次请求返回的数据中获取新数组
        var classify_hot = res.data.data.hot;
        arr1 = arr1.concat(classify_list);
        arr2 = arr2.concat(classify_hot);
        console.log(res.data.data)
        // if (res.data.data.list == 0 || res.data.data.hot == 0) {
        //   wx.showToast({
        //     title: '没有更多了',
        //     icon: 'none',
        //     duration: 1500
        //   })
        // }
        _this.setData({
          pinpai_list: classify_list,//其它品牌
          classify_hot: classify_hot//热门品牌
        })

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
    const _this = this;
    _this.getdatalist();
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
    wx.hideHomeButton
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
  //   var that = this;
  //   var page = that.data.page + 1; //获取当前页数并+1
  //   console.log(page)
  //   that.setData({
  //     page: page, //更新当前页数
  //   })
  //   that.getdatalist();//重新调用请求获取下一页数据
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})