// pages/training/training.js
const app = getApp();
var config = require('../../utils/config.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 导航头组件所需的参数
    HTTP: config.HTTP, //图片路径
    uhide: 0,
    from: 1,
    current: 0,
    flag: true,//遮罩
    city: '',
    city_list:[],
    products: [], //产品列表
    channles: [], //牌照
    startdate:'',//时间选择
    idx: 0,
    key: '全部地区',
    types: '全部地区',
    key_tiem: '全部时间',
    types_tiem: '全部时间',
    dates: [], //时间列表
    change: false, // 当两个slider在最右端重合时，将change设置为true，从而隐藏slider2，才能继续操作slider1
    max: 5000, // 两个slider所能达到的最大值
    min: 50, // 两个slider所能取的最小值
    rate: 50, // slider的最大最小值之差和100（或1000）之间的比率
    slider1Max: 5000, // slider1的最大取值
    slider1Value: 0, // slider1的值
    slider2Value: 5000, // slider2的值
    slider2Min: 0, // slider2的最小取值
    slider1W: 100, // slider1的宽度
    slider2W: 0, // slider2的宽度
    least_M: '',
    maximum_M: '',
    least_FT: '',
    maximum_FT: '',

    page: 2, //页数
    pagenum: 8, //一页的数据量
    nvabarData: {

      showCapsule: 1, //是否显示左上角图标   1表示显示    0表示不显示
      title: '', //导航栏 中间的标题
      white: true, // 是就显示白的，不是就显示黑的。
      address: '' // 加个背景 不加就是没有
    },
    // 导航头的高度
    height: app.globalData.height * 2 + 20
  },
  //确定价格
  affirm(){
    
    this.setData({
      uhide: 0,
    })
    this.shaixuan()
  },
  onClickItem(e) { //点击切换
    console.log(e.currentTarget.dataset.idx) //获取自定义的值
    let idx = e.currentTarget.dataset.idx

    if (this.current !== idx) {
      this.setData({
        current: idx,
      })
    }
    this.shaixuan()
  },
  shaixuan(){
    var https = config.http_url;
    const _this = this;
    _this.setData({
      page: 1, //更新当前页数
    })
    //最低
    var slider1Value = _this.data.slider1Value
    //最高
    var slider2Value = _this.data.slider2Value
    if (slider2Value == 5000){
      slider2Value = 10000000000
    }
   
    wx.request({
      url: https + '/train/index',
      data: {
        page: _this.data.page,
        pagenum: _this.data.pagenum, //一页的数据量
        min_price: slider1Value, // 最低价格
        max_price: slider2Value, // 最高价格
        from: _this.data.from, // 1:国内 2:国外   默认国内
        city: _this.data.city, // 城市
        cid: _this.data.current, // 证件id
        startdate: _this.data.startdate // 开始日期
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        'openid': wx.getStorageInfoSync("openid"),
        'skey': wx.getStorageInfoSync("skey"),
      },

      method: "get",
      success: function (res) {
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
      fail: function () {
        console.log("fail")
      }
    })
  },
  //地区筛选
  clickform: function(e) {
    var https = config.http_url;
    const _this = this;
    var id = e.currentTarget.dataset.id
    var types = e.currentTarget.dataset.types
    var city = e.currentTarget.dataset.city
    _this.setData({
      city: city,
      types: types,
      uhide: 0,
      key: types,
    })
    console.log(this.data.city)

this.shaixuan()
  },
  //时间筛选
  clickform_tiem: function(e) {
    var https = config.http_url;
    const _this = this;
    var id = e.currentTarget.dataset.id
    var types_tiem = e.currentTarget.dataset.types_tiem

    _this.setData({
      uhide: 0,
      startdate: e.currentTarget.dataset.startdate,
      types_tiem: types_tiem,
      key_tiem: types_tiem,
    })

    this.shaixuan()
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


  //返回上一页
  _navback() {
    wx.navigateBack()
  },
  ShowState: function(e) {
    var that = this;
    var toggleBtnVal = that.data.uhide
    var num = e.currentTarget.dataset.num
    if (toggleBtnVal == num) {
      that.setData({
        uhide: 0,
      })
    } else {
      that.setData({
        uhide: num,
      })
    }
    console.log(that.data.uhide)
  },
  ShowState2: function(e) {
    var that = this;
    var toggleBtnVal = that.data.from
    var num = e.currentTarget.dataset.num
    that.setData({
      from: num
    })
    this.shaixuan()
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
      url: https + '/train/index', //写自己的服务器
      data: {
        // from:1,
        // page: _this.data.page,
        // pagenum: _this.data.pagenum //一页的数据量
      },
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
          dates: res.data.dates,
          channles: res.data.channles,
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
    var https = config.http_url;
    var _this = this
    var page = _this.data.page + 1; //获取当前页数并+1
    _this.setData({
      page: page, //更新当前页数
    })
    //最低
    var slider1Value = _this.data.slider1Value
    //最高
    var slider2Value = _this.data.slider2Value
    wx.request({
      url: https + '/train/index',
      data: {
        page: _this.data.page,
        pagenum: _this.data.pagenum, //一页的数据量
        min_price: slider1Value, // 最低价格
        max_price: slider2Value, // 最高价格
        from: _this.data.from, // 1:国内 2:国外   默认国内
        city: _this.data.city, // 城市
        cid: _this.data.current, // 证件id
        startdate: _this.data.startdate // 开始日期
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        'openid': wx.getStorageInfoSync("openid"),
        'skey': wx.getStorageInfoSync("skey"),
      },

      method: "get",
      success: function (res) {
        console.log(res)
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