// pages/train_list/train_list.js
const app = getApp();
var config = require('../../utils/config.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    HTTP: config.HTTP, //图片路径
    uhide: 0,
    uhide_A: 0,
    uhide_x: 0,
    uhide_j: 0,
    flag: true, //遮罩
    uhide_j_j: 0,
    products: [], //列表数据
    city_list: [], //城市列表
    from: 1,
    sort: '', //排序
    types: '综合',
    min_price: '',
    max_price: '',
    change: false, // 当两个slider在最右端重合时，将change设置为true，从而隐藏slider2，才能继续操作slider1
    max: 5000, // 两个slider所能达到的最大值
    min: 20, // 两个slider所能取的最小值
    rate: 50, // slider的最大最小值之差和100（或1000）之间的比率
    slider1Max: 5000, // slider1的最大取值
    slider2Min: 20, // slider2的最小取值
    slider1Value: 20, // slider1的值
    slider2Value: 5000, // slider2的值
    slider1W: 100, // slider1的宽度
    slider2W: 0, // slider2的宽度
    least_M: '',
    maximum_M: '',
    least_FT: '',
    city_id: '', //选择城市id
    maximum_FT: '',
    nvabarData: {
      showCapsule: 1, //是否显示左上角图标   1表示显示    0表示不显示
      title: '', //导航栏 中间的标题
      white: true, // 是就显示白的，不是就显示黑的。
      address: '' // 加个背景 不加就是没有
    },
    // 导航头的高度
    height: app.globalData.height * 2 + 20,
    page: 1, //页数
    pagenum: 8, //一页的数据量
    train_list: [],
    pic: 0,
  },

  affirm() {
    var https = config.http_url;
    const _this = this;
    _this.setData({
      page: 1, //更新当前页数
    })
    //最低
    var slider1Value = _this.data.slider1Value
    //最高
    var slider2Value = _this.data.slider2Value
    if (slider2Value == 5000) {
      slider2Value = 10000000000
    }
    if (this.data.min_price != '') {
      slider1Value = this.data.min_price
    }
    if (this.data.max_price != '') {
      slider2Value = this.data.max_price
    }
    wx.request({
      url: https + '/trip/index',
      data: {
        page: _this.data.page,
        sort: _this.data.sort,
        pagenum: _this.data.pagenum, //一页的数据量
        min_price: slider1Value, // 最低价格
        max_price: slider2Value, // 最高价格
        from: _this.data.from, // 1:国内 2:国外   默认国内
        city: _this.data.city_id, // 城市
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        'openid': wx.getStorageInfoSync("openid"),
        'skey': wx.getStorageInfoSync("skey"),
      },

      method: "get",
      success: function(res) {
        console.log(res)
        var arr1 = _this.data.productList; //从data获取当前datalist数组
        if (res.data.products.length < 1) {
          _this.setData({
            flag: false,
          })
        } else {
          _this.setData({
            flag: true,
          })
        }
        _this.setData({
          products: res.data.products, //合并后更新train_list
        })
      },
      fail: function() {
        console.log("fail")
      }
    })




    this.setData({
      uhide_A: 0
    })
  },
  chongzi(e) {
    this.setData({
      min_price: '',
      max_price: '',
      slider1W: 100, // slider1的宽度
      slider2W: 0, // slider2的宽度
      slider1Value: 20, // slider1的值
      slider2Value: 5000, // slider2的值
      pic: '',
      city_id: '',
    })
  },
  //选择航线
  ShowState2: function(e) {
    var that = this;
    var toggleBtnVal = that.data.from
    var num = e.currentTarget.dataset.num
    that.setData({
      from: num
    })

    this.affirm()
  },
  // 开始滑动
  changeStart: function(e) {
    var idx = parseInt(e.currentTarget.dataset.idx)
    if (idx === 1) {
      // dW是当前操作的slider所能占据的最大宽度百分数
      var dW = (this.data.slider2Value - this.data.min) / this.data.rate
      this.setData({
        slider1W: dW,
        slider2W: 100 - dW,
        slider1Max: this.data.slider2Value,
        slider2Min: this.data.slider2Value,
        change: false
      })
    } else if (idx === 2) {
      var dw = (this.data.max - this.data.slider1Value) / this.data.rate
      this.setData({
        slider2W: dw,
        slider1W: 100 - dw,
        slider1Max: this.data.slider1Value,
        slider2Min: this.data.slider1Value,
        change: false
      })
    }
  },

  // 正在滑动
  changing: function(e) {
    var idx = parseInt(e.currentTarget.dataset.idx)
    var value = e.detail.value
    if (idx === 1) {
      this.setData({
        slider1Value: value
      })
    } else if (idx === 2) {
      this.setData({
        slider2Value: value,
      })
    }
  },
  changed: function(e) {
    console.log(e)
    if (this.data.slider1Value === this.data.slider2Value && this.data.slider2Value === this.data.max) {
      this.setData({
        change: true
      })
    }
  },
  picJiage(e) {
    var that = this;
    var toggleBtnVal = that.data.pic
    var num = e.currentTarget.dataset.pic
    var min_price = e.currentTarget.dataset.min_price
    var max_price = e.currentTarget.dataset.max_price
    if (toggleBtnVal == num) {
      that.setData({
        slider1W: 100, // slider1的宽度
        slider2W: 0, // slider2的宽度
        slider1Value: 20, // slider1的值
        slider2Value: 5000, // slider2的值
        min_price: '',
        max_price: '',
        pic: 0,
      })
      this.affirm()
    } else {
      that.setData({
        slider1W: 100, // slider1的宽度
        slider2W: 0, // slider2的宽度
        slider1Value: 20, // slider1的值
        slider2Value: 5000, // slider2的值
        min_price: min_price,
        max_price: max_price,
        pic: num,
      })
      this.affirm()
    }
    console.log(this.data.min_price)
  },
  CSclick(e) {
    var that = this;
    var toggleBtnVal = that.data.city_id
    var num = e.currentTarget.dataset.id
    var num = e.currentTarget.dataset.id
    if (toggleBtnVal == num) {
      that.setData({
        city_id: '',
      })
      this.affirm()
    } else {
      that.setData({
        city_id: num,
      })
      this.affirm()
    }
    // console.log(this.data.pic)
  },
  ShowState_J(e) {
    var that = this;
    var toggleBtnVal = that.data.uhide_j
    var num = e.currentTarget.dataset.num
    if (toggleBtnVal == num) {
      that.setData({
        uhide: 0,
        uhide_x: 0,
        uhide_x_x: 0,
        uhide_j: 888,
        uhide_j_j: 1,
        sort: 3,
      })
      this.affirm()
    } else {
      that.setData({
        uhide: 0,
        uhide_x: 0,
        uhide_x_x: 0,
        uhide_j: num,
        uhide_j_j: 1,
        sort: 2,
      })
      this.affirm()
    }
    // this.datac
    console.log(this.data.sort)
  },
  ShowState_X(e) {
    var that = this;
    var toggleBtnVal = that.data.uhide_x
    var num = e.currentTarget.dataset.num
    if (toggleBtnVal == num) {
      that.setData({
        uhide: 0,
        uhide_j: 0,
        uhide_j_j: 0,
        uhide_x: 997,
        uhide_x_x: 1,
        sort: 4,
      })
      this.affirm()
    } else {
      that.setData({
        uhide: 0,
        uhide_j: 0,
        uhide_j_j: 0,
        uhide_x: num,
        uhide_x_x: 1,
        sort: 5,
      })
      this.affirm()
    }
  },
  ShowState: function(e) {
    var that = this;
    var toggleBtnVal = that.data.uhide
    var num = e.currentTarget.dataset.num
    if (toggleBtnVal == num) {
      that.setData({
        uhide_j: 0,
        uhide_j_j: 0,
        uhide_x: 0,
        uhide_x_x: 0,
        uhide: 0,
        uhide2: 0,
        sort: 1,
      })
      this.affirm()
    } else {
      that.setData({
        uhide_j: 0,
        uhide_j_j: 0,
        uhide_x: 0,
        uhide_x_x: 0,
        uhide: num,
        uhide2: '99',
        sort: 1,
      })
      this.affirm()
    }
    console.log(that.data.uhide)
  },
  ShowState_A(e) {
    var that = this;
    var toggleBtnVal = that.data.uhide_A
    var num = e.currentTarget.dataset.num
    if (toggleBtnVal == num) {
      that.setData({
        uhide_A: 0,
      })
    } else {
      that.setData({
        uhide_A: num,
      })
    }
  },
  //返回上一页
  _navback() {
    wx.navigateBack()
  },
  getdatalist: function() {
    wx.showLoading({
      title: '加载中~',
    })
    var https = config.http_url;
    const _this = this;
    wx.request({ //渲染详情页
      url: https + '/trip/index', //写自己的服务器
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
      success: function(res) {
        wx.hideLoading()
        console.log(res.data.data)
        var arr1 = _this.data.train_list; //从data获取当前datalist数组

        var arr2 = res.data.data; //从此次请求返回的数据中获取新数组
        arr1 = arr1.concat(arr2); //合并数组
        console.log(arr1)
        if (res.data.data == 0) {
          wx.showToast({
            title: '没有更多了',
            icon: 'none',
            duration: 1500
          })
        }
        _this.setData({
          train_list: arr1, //合并后更新information
        })

      },
      fail: function() {
        console.log("fail")
      }

    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options)
    wx.showLoading({
      title: '加载中~',
    })
    var https = config.http_url;
    const _this = this;
    //渲染礼品列表页
    wx.request({
      url: https + '/trip/index', //写自己的服务器
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        "openid": wx.getStorageSync('openid'),
        "skey": wx.getStorageSync('skey'),
      },
      method: "get",
      success: function(res) {
        console.log(res.data)
        wx.hideLoading()
        _this.setData({
          products: res.data.products, //合并后更新train_list
          city_list: res.data.city

        })

      },
      fail: function() {
        console.log("fail")
      }

    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

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
    const _this = this;
    var https = config.http_url;
    var page = _this.data.page + 1; //获取当前页数并+1
    _this.setData({
      page: page, //更新当前页数
    })
    //最低
    var slider1Value = _this.data.slider1Value
    //最高
    var slider2Value = _this.data.slider2Value
    if (slider2Value == 5000) {
      slider2Value = 10000000000
    }
    if (this.data.min_price != '') {
      slider1Value = this.data.min_price
    }
    if (this.data.max_price != '') {
      slider2Value = this.data.max_price
    }
    wx.request({
      url: https + '/trip/index',
      data: {
        page: _this.data.page,
        sort: _this.data.sort,
        pagenum: _this.data.pagenum, //一页的数据量
        min_price: slider1Value, // 最低价格
        max_price: slider2Value, // 最高价格
        from: _this.data.from, // 1:国内 2:国外   默认国内
        city: _this.data.city_id, // 城市
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        'openid': wx.getStorageInfoSync("openid"),
        'skey': wx.getStorageInfoSync("skey"),
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
  onShareAppMessage: function() {

  }
})