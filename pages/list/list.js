// pages/list/list.js
const app = getApp()
var config = require('../../utils/config.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    jin: "¥",
    isHide: true,
    HTTP: config.HTTP, //图片路径
    getAppInfo: app.globalData.bottom,
    name: '',
    types: '全部类型',
    productList: [], //游艇列表页
    channelList: [], //筛选类型
    filtrate: false,
    filtrate2: false,
    paramsList_id: [], //第三级筛选类型id
    paramsList: [], //第三级筛选类型
    change: false, // 当两个slider在最右端重合时，将change设置为true，从而隐藏slider2，才能继续操作slider1
    max: 1000, // 两个slider所能达到的最大值
    min: 50, // 两个slider所能取的最小值
    rate: 9.5, // slider的最大最小值之差和100（或1000）之间的比率
    slider1Max: 1000, // slider1的最大取值
    slider1Value: 0, // slider1的值
    slider2Value: 1000, // slider2的值
    slider2Min: 0, // slider2的最小取值
    slider1W: 100, // slider1的宽度
    slider2W: 0, // slider2的宽度
    list: [],
    brand: [], //品牌筛选id
    uhide: 0, //箭头旋转/隐藏显示
    uhide_XIAN: [],
    jobList: [{
      'id': '1',
      'name': '热门推荐',
      'isSelect': 0
    }, {
      'id': '2',
      'name': '只看现艇',
      'isSelect': 0
    }],
    uhide2: 0, //箭头旋转/隐藏显示
    touchS: [0, 0],
    touchE: [0, 0],
    isHide: true, //筛选显示
    saixuan: false,
    least_M: '',
    maximum_M: '',
    least_FT: '',
    maximum_FT: '',
    checked: false,
    id: '',
    cid:'',
    key: 2,
    currency: 1,
    app_id: [], //点击存储筛选id
    page: 1, //页数
    pagenum: 10, //一页的数据量
    selectedParams: {}, // 用户选择的参数
    saixuan: '',
    saixuan2: '',
    app_id2: [], //点击添加id
    pinpai_list: [],
    checked2: false,
    //搜索列表
    hidden: true,
    showPy: '#',

  },
  onClickItem(e) { //点击切换
    let idx = e.currentTarget.dataset.idx
    let jin = e.currentTarget.dataset.jin
    if (this.current !== idx) {
      this.setData({
        currency: idx,
        // jin: jin
      })
    }
    // this.listClass()
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
    if (this.data.slider1Value === this.data.slider2Value && this.data.slider2Value === this.data.max) {
      this.setData({
        change: true
      })
    }
  },
  least_M(e) { //最小长度M
    this.data.least_M = e.detail.value;
  },
  maximum_M(e) { //最大长度M
    this.data.maximum_M = e.detail.value;
  },
  least_FT(e) { //最小长度FT
    this.data.least_FT = e.detail.value;
  },
  maximum_FT(e) { //最小长度FT
    this.data.maximum_FT = e.detail.value;
  },
  reset(e) { //重置品类筛选}
    for (let i = 0; i < this.data.paramsList.length; i++) {
      for (var j in this.data.paramsList[i].options) {
        this.data.paramsList[i].options[j].checked = false;
      }
    }

    this.setData({
      slider1Max: 1000, // slider1的最大取值
      slider1Value: 0, // slider1的值
      slider2Value: 1000, // slider2的值
      slider2Min: 0, // slider2的最小取值
      slider1W: 100, // slider1的宽度
      slider2W: 0, // slider2的宽度
      least_M: '',
      maximum_M: '',
      least_FT: '',
      maximum_FT: '',
      selectedParams: {},
      paramsList: this.data.paramsList,
    })
  },
  eec: function(e) { //品类点击存id
    var _this = this
    var app_id = _this.data.app_id
    var index = e.currentTarget.dataset.index
    var id = e.currentTarget.dataset.id
    var pindex = e.currentTarget.dataset.pindex
    for (let i = 0; i < this.data.paramsList[pindex].options.length; i++) {
      if (this.data.paramsList[pindex].options[i].id == id) {
        if (this.data.paramsList[pindex].options[i].checked == true) {
          this.data.paramsList[pindex].options[i].checked = false;
        } else {
          this.data.paramsList[pindex].options[i].checked = true;
        }
      }
    }
    if (this.data.paramsList[pindex].options[index].checked) {
      //app_id.push(id)
      // 记录用户选择的参数

      var selectPindex = String(this.data.paramsList[pindex].id);

      if (typeof this.data.selectedParams['params_' + selectPindex] == "undefined") {
        this.data.selectedParams['params_' + selectPindex] = [];
      }
      this.data.selectedParams['params_' + selectPindex].push(this.data.paramsList[pindex].options[index].id);
    } else {
      // 删除指定参数
      var selectPindex = String(this.data.paramsList[pindex].id);
      var arrIndex = this.data.selectedParams['params_' + selectPindex].indexOf(this.data.paramsList[pindex].options[index].id);
      if (arrIndex > -1) {
        this.data.selectedParams['params_' + selectPindex].splice(arrIndex, 1);
      }
      // console.log(this.data.selectedParams['params_' + selectPindex]);
    }
    _this.setData({
      paramsList: this.data.paramsList,
    })
  },


  gotu_brand_filter(e) { //跳转筛选品牌页面
    var id = this.data.id
    wx.navigateTo({
      url: '../brand_filter/brand_filter?id=' + id + '&name=' + this.data.name
    })
  },
  shaixuan: function() { //筛选
    this.setData({
      isHide: false
    });
  },

  affirm: function(e) { //价格赛选
    var https = config.http_url;
    var _this = this
    wx.showLoading({ //显示 loading 提示框
      title: '加载中',
    })
    var jin = ''
    if (_this.data.currency == 1) {
      jin = '¥'
    } else if (_this.data.currency == 2) {
      jin = '$'
    } else if (_this.data.currency == 3) {
      jin = '€'
    }
    _this.setData({
      page: 1,
      jin:jin
    })
    //最低价格

    var slider1Value = _this.data.slider1Value * 10000
    //最高
    var slider2Value = _this.data.slider2Value * 10000
    var params = "";
    for (let i in this.data.selectedParams) {
      params += i + '=' + this.data.selectedParams[i].join(',') + '&';
    }
    wx.request({
      url: https + '/product/screen?' + params,
      data: {
        page: _this.data.page,
        pagenum: _this.data.pagenum, //一页的数据量
        channelid: _this.data.id,
        currency: _this.data.currency,
        type: _this.data.uhide_XIAN.join(','), //1:推荐   2:现艇  3:全部
        length_m_min: this.data.least_M, // 最小长度  单位m
        length_m_max: this.data.maximum_M, // 最大长度  单位m
        length_ft_min: this.data.least_FT, // 最小长度  单位ft
        length_ft_max: this.data.maximum_FT, // 最小长度  单位ft
        price_min: slider1Value, // 最低价格
        price_max: slider2Value, // 最高价格
        brand: this.data.app_id2.join(',') // 品牌
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        'openid': wx.getStorageInfoSync("openid"),
        'skey': wx.getStorageInfoSync("skey"),
      },

      method: "get",
      success: function(res) {
        wx.hideLoading() //隐藏 loading 提示框
        if (res.data.data.length > 0) {
          _this.setData({
            isHide: true
          })
        } else {
          _this.setData({
            isHide: false
          })
        }
        var productList = res.data.data
        _this.setData({
          productList: productList,
          uhide: 0,
          saixuan: true,
          filtrate: false,
          filtrate2: false,
        })
      },
      fail: function() {
        console.log("fail")
      }
    })
  },

  affirmXIAN: function(e) { //价格赛选
    var https = config.http_url;
    var _this = this
    wx.showLoading({ //显示 loading 提示框
      title: '加载中',
    })
    var uhide_XIAN = this.data.uhide_XIAN;
    var index = e.currentTarget.dataset.index
    var item = this.data.jobList[index];
    item.isSelect = !item.isSelect;
    if (item.isSelect) {
      uhide_XIAN.push(item.id)
    } else {
      for (var i = 0; i < uhide_XIAN.length; i++) {
        if (uhide_XIAN[i] == item.id) {
          uhide_XIAN.splice(i, 1)
        }
      }
    }
    _this.setData({
      jobList: this.data.jobList,
      uhide_XIAN: uhide_XIAN,
      page: 1
    })
    if (this.data.uhide_XIAN.length == 2) {
      uhide_XIAN = [3]
    }
    //最低价格

    var slider1Value = _this.data.slider1Value * 10000
    //最高
    var slider2Value = _this.data.slider2Value * 10000
    var params = "";
    for (let i in this.data.selectedParams) {
      params += i + '=' + this.data.selectedParams[i].join(',') + '&';
    }
    wx.request({
      url: https + '/product/screen?' + params,
      data: {
        page: _this.data.page,
        pagenum: _this.data.pagenum, //一页的数据量
        channelid: _this.data.id,
        currency: _this.data.currency,
        type: uhide_XIAN.join(','), //1:推荐   2:现艇  3:全部
        length_m_min: this.data.least_M, // 最小长度  单位m
        length_m_max: this.data.maximum_M, // 最大长度  单位m
        length_ft_min: this.data.least_FT, // 最小长度  单位ft
        length_ft_max: this.data.maximum_FT, // 最小长度  单位ft
        price_min: slider1Value, // 最低价格
        price_max: slider2Value, // 最高价格
        brand: this.data.app_id2.join(',') // 品牌
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        'openid': wx.getStorageInfoSync("openid"),
        'skey': wx.getStorageInfoSync("skey"),
      },

      method: "get",
      success: function(res) {
        wx.hideLoading() //隐藏 loading 提示框
        if (res.data.data.length > 0) {
          _this.setData({
            isHide: true
          })
        } else {
          _this.setData({
            isHide: false
          })
        }
        var productList = res.data.data
        _this.setData({
          productList: productList,
          uhide: 0,
          saixuan: true,
          filtrate: false,
          filtrate2: false,
        })
      },
      fail: function() {
        console.log("fail")
      }
    })
  },




  //类型筛选
  clickform: function(e) {
    var https = config.http_url;
    const _this = this;
    _this.setData({
      page: 1,
      id:e.currentTarget.dataset.id
    })
    //最低价格
    // console.log(e)
    var slider1Value = _this.data.slider1Value * 10000
    //最高
    var slider2Value = _this.data.slider2Value * 10000
    var params = "";
    for (let i in this.data.selectedParams) {
      params += i + '=' + this.data.selectedParams[i].join(',') + '&';
    }
    var id = e.currentTarget.dataset.id
    var types = e.currentTarget.dataset.types
    wx.request({
      url: https + '/product/screen?' + params, //写自己的服务器
      data: {
        channelid: e.currentTarget.dataset.id,
        page: _this.data.page,
        currency: _this.data.currency,
        pagenum: _this.data.pagenum, //一页的数据量
        length_m_min: this.data.least_M, // 最小长度  单位m
        length_m_max: this.data.maximum_M, // 最大长度  单位m
        length_ft_min: this.data.least_FT, // 最小长度  单位ft
        length_ft_max: this.data.maximum_FT, // 最小长度  单位ft
        price_min: slider1Value, // 最低价格
        price_max: slider2Value, // 最高价格
        brand: this.data.app_id2.join(',') // 品牌
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        "openid": wx.getStorageSync('openid'),
        "skey": wx.getStorageSync('skey'),
      },
      method: "get",
      success: function(res) {
        if (res.data.data.length < 1) {
          wx.showToast({
            title: '暂无数据~',
            icon: "none"
          })
        }
        var productList = res.data.data
        _this.setData({
          productList: productList,
          uhide: 0,
          uhide2: '99',
          key: id,
          types: types
        })
      },
      fail: function() {
        console.log("fail")
      }
    })
  },

  gotoscreen(e) { //跳转筛选页面
    var id = this.data.id
    var name = this.data.name
    wx.navigateTo({
      url: '../screen/screen?id=' + id + '&name=' + name,
    })
  },
  ShowState: function(e) {
    var that = this;
    var toggleBtnVal = that.data.uhide
    var num = e.currentTarget.dataset.num
    if (toggleBtnVal == num) {
      that.setData({
        uhide: 0,
        uhide2: 0
      })
    } else {
      that.setData({
        uhide: num,
        uhide2: '99'
      })
    }
  },

  ShowState5: function(e) {
    let id = e.currentTarget.dataset.id
    let pindex = e.currentTarget.dataset.pindex
    var paramsList_id = this.data.paramsList_id
    for (let i = 0; i < this.data.paramsList.length; i++) {
      if (this.data.paramsList[i].id == id) {
        if (this.data.paramsList[i].checked == true) {
          this.data.paramsList[i].checked = false;
        } else {
          this.data.paramsList[i].checked = true;
        }
      }
    }
    this.setData({
      paramsList: this.data.paramsList,
    })
  },
  ShowState2(e) {
    var that = this;
    var toggleBtnVal = that.data.uhide
    var id = e.currentTarget.dataset.id
    if (toggleBtnVal == id) {
      that.setData({
        uhide: 0
      })
    } else {
      that.setData({
        uhide: id,
      })
    }
  },
  ShowState3(e) {
    var that = this;
    var toggleBtnVal2 = that.data.uhide2
    var id = e.currentTarget.dataset.id
    if (toggleBtnVal2 == id) {
      that.setData({
        uhide2: 0
      })
    } else {
      that.setData({
        uhide2: id,
      })
    }
  },
  getdatalist: function(message) {
    wx.showNavigationBarLoading() //在当前页面显示导航条加载动画
    wx.showLoading({ //显示 loading 提示框
      title: message,
    })
    var https = config.http_url;
    const _this = this;

    var id = _this.data.id
    var name = _this.data.name

    wx.request({ //列表渲染
      url: https + '/product/index?id=' + id, //写自己的服务器
      data: {
        page: _this.data.page,
        currency: _this.data.currency,
        pagenum: _this.data.pagenum //一页的数据量
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        "openid": wx.getStorageSync('openid'),
        "skey": wx.getStorageSync('skey'),
      },
      method: "get",
      success: function(res) {
        var contentlistTem = _this.data.productList;
        var productList = res.data.data.productList; //列表页


        wx.hideNavigationBarLoading() //在当前页面隐藏导航条加载动画
        wx.hideLoading() //隐藏 loading 提示框
        if (productList.length >= 1) {
          _this.setData({
            isHide: true
          })
        } else {
          _this.setData({
            isHide: false
          })
        }
        if (res.data.data.productList.length > 0) {

          var productList = res.data.data.productList; //列表页
          _this.setData({
            channelList: res.data.data.channelList,
            productList: contentlistTem.concat(productList)
          })
        }

      },
      fail: function() {
        console.log("fail")
      }

    })
    //设置导航栏为对应导航
    wx.setNavigationBarTitle({
      title: (name != '' ? name : '') + '列表'
    })
  },
  shaixuanid() { //品牌筛选接口
    var https = config.http_url;
    var that = this;
    wx.request({
      url: https + '/brand/codeList', //写自己的服务器
      data: {
        id: that.data.id
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        "openid": wx.getStorageSync('openid'),
        "skey": wx.getStorageSync('skey'),
      },
      method: "get",
      success: function(res) {
        // console.log(res.data.data)
        var pinpai_list = res.data.data

        that.setData({
          pinpai_list: res.data.data
        })

      },
      fail: function() {
        console.log("fail")
      }

    })
  },
  //获取文字信息
  getPy: function(e) { //点击跳转指定位置
    this.setData({
      hidden: false,
      showPy: e.target.id,
    })
  },
  //触发全部开始选择
  tStart: function() {
    this.setData({
      hidden: false
    })
  },

  //触发结束选择
  tEnd: function() {
    this.setData({
      hidden: true,
      scrollTopId: this.data.showPy
    })
  },
  checkboxChange: function(e) {
    console.log('checkbox发生change事件，携带value值为：', e.detail.value)
    var _this = this
    var app_id2 = _this.data.app_id2
    var id = e.currentTarget.id
    if (e.detail.value != '') {
      app_id2.push(id)
    } else {
      for (var i = 0; i < app_id2.length; i++) {
        if (app_id2[i] == id) {
          app_id2.splice(i, 1)
        }
      }
    }
  },
  deletelist(e) { //重置
    var checked = this.data.checked
    this.setData({
      app_id2: [],
      checked: false
    })
  },
  show: function() {
    this.setData({
      filtrate: true
    })
  },
  none: function() {
    this.setData({
      filtrate: false
    })

  },
  show2: function() {
    this.setData({
      filtrate2: true
    })
  },
  none2: function() {
    this.setData({
      filtrate2: false
    })

  },
  // listClass() {
  //   var https = config.http_url;
  //   const _this = this;
  //   wx.request({ //列表渲染
  //     url: https + '/product/index?id=' + _this.data.id, //写自己的服务器
  //     data: {
  //       page: 1,
  //       pagenum: _this.data.pagenum, //一页的数据量
  //       currency: _this.data.currency
  //     },
  //     header: {
  //       "Content-Type": "application/x-www-form-urlencoded",
  //       "openid": wx.getStorageSync('openid'),
  //       "skey": wx.getStorageSync('skey'),
  //     },
  //     method: "get",
  //     success: function(res) {
  //       // var channelList = res.data.data.channelList //从此次请求筛选类型
  //       // var paramsList = res.data.data.paramsList //从此次请求第三级筛选类型
  //       _this.setData({
  //         productList: res.data.data.productList,
  //         // channelList: channelList,
  //         // paramsList: paramsList,
  //         // exchangeRate: res.data.data.exchangeRate
  //       })
  //     },
  //     fail: function() {
  //       console.log("fail")
  //     }

  //   })
  // },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var https = config.http_url;
    const _this = this;
    var id = options.id
    var name = options.name
    _this.setData({
      id: id,
      cid:id,
      name: name,
      // brand: options.brand,
      // saixuan: options.saixuan,
      // saixuan2: options.saixuan2,
    })
    // _this.listClass()
    _this.getdatalist('正在加载数据...');
    _this.shaixuanid()
    //设置导航栏为对应导航
    wx.setNavigationBarTitle({
      title: (name != '' ? name : '') + '列表'
    })


  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {},

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
    var that = this;
    var page = that.data.page + 1; //获取当前页数并+1
    that.setData({
      page: page, //更新当前页数
    })
    var uhide_XIAN = ''
    if (this.data.uhide_XIAN.length == 2) {
      uhide_XIAN = [3]
    } else {
      uhide_XIAN = this.data.uhide_XIAN
    }
    var https = config.http_url;
    var _this = this
    //最低价格
    var slider1Value = _this.data.slider1Value * 10000
    //最高
    var slider2Value = _this.data.slider2Value * 10000
    var params = "";
    for (let i in this.data.selectedParams) {
      params += i + '=' + this.data.selectedParams[i].join(',') + '&';
    }
    wx.request({
      url: https + '/product/screen?' + params,
      data: {
        page: _this.data.page,
        pagenum: _this.data.pagenum, //一页的数据量
        channelid: _this.data.id,
        type: uhide_XIAN.join(','), //1:推荐   2:现艇  3:全部
        length_m_min: this.data.least_M, // 最小长度  单位m
        length_m_max: this.data.maximum_M, // 最大长度  单位m
        length_ft_min: this.data.least_FT, // 最小长度  单位ft
        length_ft_max: this.data.maximum_FT, // 最小长度  单位ft
        currency: _this.data.currency,
        price_min: slider1Value, // 最低价格
        price_max: slider2Value, // 最高价格
        brand: this.data.app_id2.join(',') // 品牌

      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        'openid': wx.getStorageInfoSync("openid"),
        'skey': wx.getStorageInfoSync("skey"),
      },

      method: "get",
      success: function(res) {
        var arr1 = _this.data.productList; //从data获取当前datalist数组

        if (res.data.data.length < 1) {
          wx.showToast({
            title: '没有更多了~',
            icon: 'none',
            duration: 1500
          })
        }
        var productList = res.data.data
        arr1 = arr1.concat(productList); //合并数组
        _this.setData({
          productList: arr1 //合并后更新productList
        })

      },
      fail: function() {
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