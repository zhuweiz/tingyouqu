//index.js
//获取应用实例
const app = getApp()
var openid = wx.getStorageSync('openid')
var config = require('../../utils/config.js')
import tool from "../../utils/tool.js";
Page({
  data: {
    HTTP: config.HTTP, //图片路径
    bnrUrl: [], //轮播图
    setDataCount: 1,
    clickImg1: true,
    clickImg2: true,
    clickImg3: true,
    clickImg4: true,
    clickImg5: true,
    clickImg6: true,
    clickImg7: true,
    clickImg8: true,
    clickImg9: true,
    getAppInfo: app.globalData.bottom, //判断手机 底部高度
    current: 0, // tab切换  
    page: 1,
    navbarInitTop: 1400, //导航栏初始化距顶部的距离
    isFixedTop: false, //是否固定顶部
    navData: [{
      name: "首页", //文本
      current: 1, //是否是当前页，0不是  1是
      style: 0, //样式
      ico: '../../img/shouye2.png', //不同图标
      fn: 'gotoIndex' //对应处理函数
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
    }, ],
    // 导航头组件所需的参数
    nvabarData: {
      showCapsule: 0, //是否显示左上角图标   1表示显示    0表示不显示
      // title: '艇有趣', //导航栏 中间的标题
      imgcc:'../../img/ttyy.png',
      white: true, // 是就显示白的，不是就显示黑的。
      address: '../../img/tb2x.png' // 加个背景 不加就是没有
    },
    // 导航头的高度
    height: app.globalData.height * 2 + 20,
    top1: app.globalData.height * 2 + 20 + 50 + 'px',
    hotword: [], //热搜
    input_value: '', //value值
    name_focus: false, //输入框聚焦
    newList: [], //新品推荐
    hotList: [], //最新活动
    productList: [], //热门产品
    giftList: [], //文化礼品周边
    giftList2: [],
    giftList3: []
  },
  gotoOldGoods: function() {
    wx.switchTab({
      url: '/pages/classify/classify',
    });
  },
  gotoPublish: function() {
    var _this = this
    this.setData({
      clickImg9: false
    })
    setTimeout(function() {
      wx.navigateTo({
        url: '/pages/comparison/comparison',
      })
      _this.setData({
        clickImg9: true
      })
    }, 400)
  },
  gotoRecruit: function() {
    wx.switchTab({
      url: '/pages/information/information',
    });
  },
  gotoMine: function() {
    wx.switchTab({
      url: '/pages/mine/mine',
    });
  },



  onClickItem(e) { //点击切换
    let idx = e.currentTarget.dataset.idx
    if (this.current !== idx) {
      this.setData({
        current: idx
      })
    }
  },
  //点击热门词出现在输入框里
  this_value: function(e) {
    var https = config.http_url;
    var that = this;
    that.setData({
      name_focus: true
    })
    let value = e.currentTarget.dataset.text;
    that.setData({
      keyWord: value,
    })
    var formData = e.currentTarget.dataset.text;

    if (formData) { // 搜索
      wx.navigateTo({
        url: '../searchShow/searchShow?formData=' + formData + '&name=' + formData
      })
    } else {
      wx.showToast({
        title: '输入不能为空',
        icon: 'none',
        duration: 1500
      })

    }

  },

  //轮播图
  lunbo: function(e) {
    var that = this;
    var fiom = e.currentTarget.dataset.from
    var goosid = e.currentTarget.dataset.goosid
    var url = e.currentTarget.dataset.url
    if (fiom == '1') {
      wx.navigateTo({
        url: '../list_particulars/list_particulars?id=' + goosid
      })
    } else if (fiom == '2') {
      wx.navigateTo({
        url: '../activity/activity?id=' + goosid
      })
    } else if (fiom == '3') {
      wx.navigateTo({
        url: '../gzh/gzh?id=' + url
      })
    }
  },
  index_list: function(e) { //首页渲染
    var https = config.http_url;
    let _this = this;
    wx.showLoading({ //显示 loading 提示框
      title: '加载中...',
    })
    wx.request({
      url: https + '/main/index', //写自己的服务器
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        "openid": wx.getStorageSync('openid'),
        "skey": wx.getStorageSync('skey'),
      },
      method: "get",
      success: function(res) {
        var newList = res.data.data.newList //新品推荐
        var giftList = res.data.data.giftList //礼物周边
        var giftList2 = res.data.data.giftList[1]
        var giftList3 = res.data.data.giftList[2]
        var productList = res.data.data.productList
        var b = []
        for (var i = 0; i < giftList.length; i++) {
          b = giftList[i].images[0]
          giftList[i]['giftList_img'] = b
        }
        _this.setData({
          bnrUrl: res.data.data.bannerList, //轮播图
          newList: res.data.data.newList, //新品推荐
          productList: res.data.data.productList, //热门产品
          giftList: giftList, //礼物周边
          giftList2: res.data.data.giftList[1],
          giftList3: res.data.data.giftList[2]
        })
        wx.hideLoading();
      },
      fail: function() {
        console.log("fail")
      }

    })
  },
  //最新活动
  index_activity: function(e) {
    var https = config.http_url;
    let _this = this;
    wx.showLoading({ //显示 loading 提示框
      title: '加载中...',
    })
    wx.request({
      url: https + '/activity/index', //写自己的服务器
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        "openid": wx.getStorageSync('openid'),
        "skey": wx.getStorageSync('skey'),
      },
      method: "get",
      success: function(res) {
        var hotList = res.data.data.hotList //新品推荐
        _this.setData({
          hotList: res.data.data.hotList, //最新活动

        })
        wx.hideLoading();
      },
      fail: function() {
        console.log("fail")
      }

    })
  },
  hot_list: function(e) { //搜索热词
    var https = config.http_url;
    let _this = this;
    wx.showLoading({ //显示 loading 提示框
      title: '加载中...',
    })
    wx.request({
      url: https + '/search/hot', //写自己的服务器
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        "openid": wx.getStorageSync('openid'),
        "skey": wx.getStorageSync('skey'),
      },
      method: "get",
      success: function(res) {
        _this.setData({
          hotword: res.data.data
        })
        wx.hideLoading();
      },
      fail: function() {
        console.log("fail")

      }
    })
  },
  //生命周期函数--监听页面加载
  onLoad: function(options) {
    wx.hideTabBar()
    // console.log(app.globalData.height * 2 + 20+100+'px')
    var https = config.http_url;
    let _this = this;
    _this.index_list()
    _this.index_activity()
    _this.hot_list()
    
    // this.getData()
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  getData(id) {
    var that = this;
    //获取节点距离顶部的距离
    setTimeout(() => {
      let query = wx.createSelectorQuery()//创建节点查询器
      query.selectAll('.childnode').boundingClientRect(function (rect) {
        that.setData({
          navbarInitTop: parseInt(rect[0].top) - 150
        })
      }).exec()     
    }, 1000)
  },
  onReady: function() {
  
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    
  
  },
  // 页面滚动监听
  onPageScroll: function(e) {
    var that = this;
    var scrollTop = parseInt(e.scrollTop); //滚动条距离顶部高度
    //判断'滚动条'滚动的距离 和 '元素在初始时'距顶部的距离进行判断
    var isSatisfy = scrollTop >= that.data.navbarInitTop ? true : false;
    //为了防止不停的setData, 这儿做了一个等式判断。 只有处于吸顶的临界值才会不相等
    // if (that.data.isFixedTop === isSatisfy) {
    //   return false;
    // }
    that.setData({
      isFixedTop: isSatisfy
    });
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    var https = config.http_url;
    let _this = this;
    // wx.showLoading({//显示 loading 提示框
    //   title: '加载中...',
    // })
    var page = _this.data.page + 1; //获取当前页数并+1
    _this.setData({
      page: page, //更新当前页数
    })
    if (_this.data.current == 0) {

      wx.request({
        url: https + '/main/index', //写自己的服务器
        data: {
          page: _this.data.page,
          type: 'recommend' //一页的数据量
        },
        header: {
          "Content-Type": "application/x-www-form-urlencoded",
          "openid": wx.getStorageSync('openid'),
          "skey": wx.getStorageSync('skey'),
        },
        method: "get",
        success: function(res) {
          var productList = res.data.data.list
          if (productList.length < 1) {
            wx.showToast({
              title: '没有更多了~',
              icon: 'none',
              duration: 1500
            })
          }
          var arr1 = _this.data.productList;
          _this.setData({
            productList: arr1.concat(productList), //热门产品
          })
          // wx.hideLoading();
        },
        fail: function() {
          console.log("fail")
        }

      })
    }
    if (_this.data.current == 1) {
      wx.request({
        url: https + '/main/index', //写自己的服务器
        data: {
          page: _this.data.page,
          type: 'new' //一页的数据量
        },
        header: {
          "Content-Type": "application/x-www-form-urlencoded",
          "openid": wx.getStorageSync('openid'),
          "skey": wx.getStorageSync('skey'),
        },
        method: "get",
        success: function(res) {
          var newList = res.data.data.list //新品推荐
          var arr2 = _this.data.newList;
          if (newList.length < 1) {
            wx.showToast({
              title: '没有更多了~',
              icon: 'none',
              duration: 1500
            })
          }
          _this.setData({
            newList: arr2.concat(newList), //新品推荐
          })
          // wx.hideLoading();
        },
        fail: function() {
          console.log("fail")
        }

      })
    }


  },
  clickImg1() {
    var _this = this
    this.setData({
      clickImg1: false
    })
    setTimeout(function() {
      wx.navigateTo({
        url: '../list/list?id=yacht&name=游艇',
      })
      _this.setData({
        clickImg1: true
      })
    }, 500)

  },
  clickImg2() {
    var _this = this
    this.setData({
      clickImg2: false
    })
    setTimeout(function() {
      wx.navigateTo({
        url: '../list/list?id=sailboat&name=帆船',
      })
      _this.setData({
        clickImg2: true
      })
    }, 500)

  },
  clickImg3() {
    var _this = this
    this.setData({
      clickImg3: false
    })
    setTimeout(function() {
      wx.navigateTo({
        url: '../training/training',
      })
      _this.setData({
        clickImg3: true
      })
    }, 500)

  },
  clickImg4(e) {
    var _this = this
    this.setData({
      clickImg4: false
    })
    setTimeout(function() {
      wx.navigateTo({
        url: '../train_list/train_list',
      })
      _this.setData({
        clickImg4: true
      })
    }, 500)
  },
  clickImg5(e) {
    var _this = this
    this.setData({
      clickImg5: false
    })
    setTimeout(function() {
      wx.navigateTo({
        url: '../Gift/Gift',
      })
      _this.setData({
        clickImg5: true
      })
    }, 500)
  },
  clickImg6(e) {
    var _this = this
    this.setData({
      clickImg6: false
    })
    setTimeout(function() {
      wx.navigateTo({
        url: '../list/list?id=factory&name=游艇工厂',
      })
      _this.setData({
        clickImg6: true
      })
    }, 500)
  },
  clickImg7(e) {
    var _this = this
    this.setData({
      clickImg7: false
    })
    setTimeout(function() {
      wx.navigateTo({
        url: '../Active_line/Active_line',
      })
      _this.setData({
        clickImg7: true
      })
    }, 500)
  },
  clickImg8() {
    var _this = this
    this.setData({
      clickImg8: false
    })
    setTimeout(function() {
      wx.navigateTo({
        url: '../list/list?id=watersport&name=水上运动',
      })
      _this.setData({
        clickImg8: true
      })
    }, 500)

  },
  //分享
  onShareAppMessage: function(res) {
    var that = this;
    return {
      title: '',
      path: '/pages/index/index',
      success: function(res) {
        // 转发成功

        that.shareClick();
      },
      fail: function(res) {
        // 转发失败
      }
    }
  },


})