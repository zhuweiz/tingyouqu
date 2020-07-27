// pages/list_particulars/list_particulars.js
const app = getApp()
var config = require('../../utils/config.js')
var WxParse = require('../../wxParse/wxParse.js');
import NumberAnimate from "../../utils/NumberAnimate";
Page({
  data: {
    current: 0, // tab切换 
    licheng: false, //gif  显示
    isShow: true,
    show: false, //弹出开会员
    ismember: '',
    currency: '',
    videoHeight:'',//视频高度
    article2:'',
    jin: "¥",
    isss: false,
    isFixedTop: false, //是否固定顶部
    filtrate: false,
    topSpeed: '', //最高速度
    cruisingSpeed: '', //巡航速度
    HTTP: config.HTTP, //图片路径
    product: [], //请求数据
    "arr2": [], //存储数据
    guess_love: [], //猜你喜欢
    params: [], //产品规格型号
    brandName_id: [],
    currentTab: '',
    id: [], //收藏
    compare: [], //对比
    list: [],
    shulian: '',
    job: [],
    id: '',
    quanbu: '展开全部',
    brandId: '', //品牌id
    shouchang_id: [],
    isClick: false,
    getAppInfo: '', //判断手机 底部高度
    collection: '', //收藏
    uhide: 0,
    cname: '',
    num1: '',
    qd: '',
    defImg: '',
  },
  openpreviewImg() {
    this.selectComponent("#previewComponent").showPreview();
    this.setData({ 
      defImg: this.data.product.images[0],
      })
  },
  onClickItem(e) { //点击切换
    let idx = e.currentTarget.dataset.idx
    if (this.current !== idx) {
      this.setData({
        current: idx
      })
    }
  },
  // 去开通VIP
  gotoVip() {
    this.setData({
      show: true
    });
  },
  //去开vip
  getUserInfo(event) {
    console.log(event.detail);
    wx.navigateTo({
      url: '../member/member',
    })
  },
  onImageLoad(e) {
    console.log(e)
    setTimeout(() => {
      this.setData({
        licheng: true
      })
    }, 1500)
  },
  animate: function() {
    console.log(this.data.cruisingSpeed)
    let num1 = this.data.cruisingSpeed;
    let n1 = new NumberAnimate({
      from: num1, //开始时的数字
      speed: 1500, // 总时间
      refreshTime: 100, //  刷新一次的时间
      decimals: 1, //小数点后的位数
      onUpdate: () => { //更新回调函数
        this.setData({
          cruisingSpeed: n1.tempValue
        });
      },

    });
    let num2 = this.data.topSpeed;
    let n2 = new NumberAnimate({
      from: num2, //开始时的数字
      speed: 1500, // 总时间
      refreshTime: 100, //  刷新一次的时间
      decimals: 0, //小数点后的位数
      onUpdate: () => { //更新回调函数
        this.setData({
          topSpeed: n2.tempValue
        });
      },

    });
  },
  //视频
  // 点击封面自定义播放按钮时触发
  bindplay() {
    this.setData({
      isShow: false,
      filtrate: true
    })
    this.videoContext.play();
    console.log('play')
  },
  vido() {
    var _this = this
    this.setData({
      isShow: true,
      filtrate: false
    })
    this.videoContext.pause() //暂停播放 
  },
  // 监听播放到末尾时触发
  bindended() {
    console.log('bindended')
    this.setData({
      isShow: true
    })
    this.videoContext.ended();
  },
  // 监听暂停播放时触发
  bindpause() {
    console.log('pause')
  },

  bindChange: function(e) {
    console.log(e)
    console.log(e.detail.currentItemId)
    var id = e.detail.currentItemId
    var that = this;
    that.setData({
      currentTab: e.detail.current,

    });
  },

  //收藏功能
  chakan(e) {
    if (this.data.uhide == 0) {
      this.setData({
        uhide: 1,
        quanbu: '收起'
      })
    } else {
      this.setData({
        uhide: 0,
        quanbu: '展开全部'
      })
    }
    console.log(this.data.uhide)
  },
  haveSave(e) {
    var https = config.http_url;
    var _this = this
    console.log(this.data.shouchang_id)
    var shouchang_id = this.data.shouchang_id
    if (!this.data.collection == true) {
      wx.request({
        url: https + '/member/collection', //写自己的服务器
        data: {
          id: shouchang_id,
          from: 1
        },
        header: {
          "Content-Type": "application/x-www-form-urlencoded",
          "openid": wx.getStorageSync('openid'),
          "skey": wx.getStorageSync('skey'),
        },
        method: "get",
        success: function(res) {
          console.log(res)
          _this.setData({
            collection: 1
          })

        },
        fail: function() {
          console.log("fail")
        }

      })
      wx.showToast({
        title: '已收藏',
      });
    } else {

      wx.request({
        url: https + '/member/collectionDel', //写自己的服务器
        data: {
          id: shouchang_id, // 商品id
          from: 1 // 来源 1:产品  2:活动  3:礼品
        },
        header: {
          "Content-Type": "application/x-www-form-urlencoded",
          "openid": wx.getStorageSync('openid'),
          "skey": wx.getStorageSync('skey'),
        },
        method: "post",
        success: function(res) {
          _this.setData({
            collection: 0
          })
          wx.showToast({
            title: '已取消收藏',
          });

        },
        fail: function() {
          console.log("fail")
        }
      })
    }
  },

  handleClickShow(e) { //对比接口
    var https = config.http_url;
    const _this = this;
    var brandName_id = _this.data.brandName_id
    console.log(brandName_id)
    if (!this.data.compare == true) {
      wx.request({
        url: https + '/product/compareAddId', //写自己的服务器
        data: {
          id: brandName_id
        },
        header: {
          "Content-Type": "application/x-www-form-urlencoded",
          "openid": wx.getStorageSync('openid'),
          "skey": wx.getStorageSync('skey'),
        },
        method: "get",
        success: function(res) {
          console.log(res)
          _this.setData({
            compare: 1
          })
          wx.showToast({
            title: '已加入对比',
          });
        },
        fail: function() {
          console.log("fail")
        }

      })
    } else {

      wx.request({
        url: https + '/product/compareDelId', //写自己的服务器
        data: {
          id: brandName_id
        },
        header: {
          "Content-Type": "application/x-www-form-urlencoded",
          "openid": wx.getStorageSync('openid'),
          "skey": wx.getStorageSync('skey'),
        },
        method: "GET",
        success: function(res) {
          _this.setData({
            compare: 0
          })
          wx.showToast({
            title: '已取消对比',
          });

        },
        fail: function() {
          console.log("fail")
        }
      })
    }
  },


  chaxun: function() { //进销商查询
    var brandId = this.data.brandId
    wx.navigateTo({
      url: '../dealer/dealer?id=' + brandId + "&cname=" + this.data.cname,
    })
  },
  tapName: function(e) { //立即询价
    var brandName_id = this.data.brandName_id
    if (wx.getStorageSync('realname') == '') {
      wx.navigateTo({
        url: '../perfect/perfect?id=' + brandName_id + '&nameh=' + '首次查询需完善资料，以便后续 快速询价~',
      })
    } else {
      wx.navigateTo({
        url: '../enquiry/enquiry?id=' + brandName_id,
      })
    }
  },

  previewImg: function(e) { //点击全屏预览图片
    console.log(e.currentTarget.dataset.index);
    var index = e.currentTarget.dataset.index;

    var HTTP = this.data.HTTP
    var imgArr = this.data.product.images;
    var imgArr3 = []
    for (var i = 0; i < imgArr.length; i++) {
      var imgArr2 = HTTP + imgArr[i].split(",")
      imgArr3[i] = imgArr2
      console.log(imgArr2)
    }
    wx.previewImage({
      current: imgArr3[index], //当前图片地址
      urls: imgArr3, //所有要预览的图片的地址集合 数组形式
      success: function(res) {
        console.log(res)
      },
      fail: function(res) {},
      complete: function(res) {},
    })
  },


  getData(id) {
    var that = this;
    //获取节点距离顶部的距离
    setTimeout(() => {
      wx.createSelectorQuery().select('#navbar').boundingClientRect(function(rect) {
        console.log(rect)
        if (rect && rect.top > 0) {
          var navbarInitTop = parseInt(rect.top);
          that.setData({
            navbarInitTop: navbarInitTop
          });
        }
      }).exec();
    }, 500)
  },
  // 页面滚动监听
  onPageScroll: function(e) {
    var that = this;
    var scrollTop = parseInt(e.scrollTop); //滚动条距离顶部高度
    // console.log(scrollTop)
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
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

    console.log(options)
    var shouchang_id = options.id
    var https = config.http_url;
    const _this = this;
    var getAppInfo = app.globalData.bottom; //监听手机高度
    // wx.getSystemInfo({
    //   success: function(res) {
    //     _this.setData({
    //       videoHeight:parseInt(res.windowWidth*0.75)
    //     })
    //   },
    // })
    if (options.currency == 1) {
      _this.setData({
        jin: '¥'
      })
    } else if (options.currency == 2) {
      _this.setData({
        jin: '$'
      })
    } else if (options.currency == 3) {
      _this.setData({
        jin: '€'
      })
    }
    _this.setData({
      getAppInfo: getAppInfo,
      currency: options.currency,
      id: options.id, //把获取的id存到data中，当作一个变量供下边调用
      qd: options.qd
    })




  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    this.videoContext = wx.createVideoContext('myVideo')



  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    console.log(this.data.id)
    var https = config.http_url;
    const _this = this;
    wx.showLoading({ //显示 loading 提示框
      title: '加载中...',
    })
    wx.request({ //渲染详情页
      url: https + '/product/detail', //写自己的服务器
      data: {
        id: this.data.id,
        currency: this.data.currency
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        "openid": wx.getStorageSync('openid'),
        "skey": wx.getStorageSync('skey'),
      },
      method: "get",
      success: function(res) {
        // console.log(res.data.data.product[0].brandName)

        var params = res.data.data.params
        var content2 = res.data.data.product[0].brandContent
        var article = res.data.data.product[0].content
        var content = article.replace(/\<img/gi, '<img style="max-width:100%;height:auto" ')
        var productsParams = {};
        for (var i in params) {
          productsParams[i] = []
          productsParams[i].push(params[i] == 'null' || params[i] == "" ? '--' : params[i])

          //  }
        }
        console.log(res.data.data)

        if (Object.keys(productsParams).length === 0) {
          _this.setData({
            isss: true
          })
        }
        var topSpeed = res.data.data.product[0].topSpeed //最高速度
        var cruisingSpeed = res.data.data.product[0].cruisingSpeed //最高速度
        console.log(typeof(topSpeed));
        if (typeof(topSpeed) == "number") {
          console.log('变量 n 是一个数字');
        }
        _this.setData({
          ismember: res.data.data.ismember, //会员
          collection: res.data.data.collection, //收藏
          compare: res.data.data.compare, //对比
          params: productsParams, //产品规格型号
          product: res.data.data.product[0],
          cname: res.data.data.product[0].brandName,
          topSpeed: res.data.data.product[0].topSpeed, //最高速度
          cruisingSpeed: res.data.data.product[0].cruisingSpeed, //巡航速度
          shulian: Object.keys(res.data.data.params).length,
          list: res.data.data,
          brandName_id: _this.data.id, //商标
          shouchang_id: _this.data.id,
          article: content, //产品介绍
          article2: content2, //品牌介绍
          brandId: res.data.data.product[0].brandId //品牌id
        })
        WxParse.wxParse('article', 'html', _this.data.article, _this, 5);
        if (content2) {
          WxParse.wxParse('article2', 'html', _this.data.article2, _this, 5);
        }
       
        _this.animate()
        wx.hideLoading();
      },
      fail: function() {
        console.log("fail")
      }

    })
    wx.request({ //猜你喜欢
      url: https + '/product/guess', //写自己的服务器
      data: {
        id: this.data.id
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        "openid": wx.getStorageSync('openid'),
        "skey": wx.getStorageSync('skey'),
      },
      method: "get",
      success: function(res) {
        console.log(res)
        var guess_love = res.data.data.list
        var a = []
        for (var i = 0; i < guess_love.length; i++) {
          a = guess_love[i].images.split(",")
          guess_love[i]['guess_love_img'] = a[0]

        }
        console.log(guess_love)

        _this.setData({
          // bnrUrl: res.data.data.bannerList,
          guess_love: guess_love
        })
      },
      fail: function() {
        console.log("fail")
      }

    })
    this.getData()

    // wx.createSelectorQuery().select('#yingchang').boundingClientRect(function (rect) {
    //   console.log(rect)
    //   if (rect && rect.top > 0) {
    //     var navbarInitTop = parseInt(rect.top);
    //     that.setData({
    //       navbarInitTop: navbarInitTop
    //     });
    //   }
    // }).exec();
    // const query = wx.createSelectorQuery()
    // query.select('#yingchang').boundingClientRect()
    // query.selectViewport().scrollOffset()
    // query.exec(function (res) {
    //   res[0].top       // #the-id节点的上边界坐标
    //   res[1].scrollTop // 显示区域的竖直滚动位置
    //   console.log('打印demo的元素的信息', res);
    //   console.log('打印高度', res[0].height);

    // })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {
    if (this.data.qd == 'qd') {
      wx.switchTab({
        url: '/pages/index/index'
      })
    }
  },



  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})