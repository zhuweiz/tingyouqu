// pages/map/map.js
var config = require('../../utils/config.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    //城市下拉
    citySelected: '',//定位城市
    city: '',
    brandId: '',//品牌id
    _py: ["hot", "A", "B", "C", "D", "E", "F", "G", "H", "J", "K", "L", "M", "N", "P", "Q", "R", "S", "T", "W", "X", "Y", "Z"],
    //搜索列表
    inputVal: '',
    searchList: [],
    map_list:[],
    recommend:[],//热门城市
    cityListShow: false,
    inputListShow: false,
    hidden: true,
    showPy: '#',
    sercherStorage: [], //最近搜索内容
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    var that = this;
    this.setData({
      brandId: options.id,
      citySelected: options.city,
    });
    var https = config.http_url;
    const _this = this;
    //渲染城市列表页
    wx.request({
      url: https + '/product/distributorCodeList', //写自己的服务器
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        "openid": wx.getStorageSync('openid'),
        "skey": wx.getStorageSync('skey'),
      },
      method: "get",
      success: function (res) {
        console.log(res.data.data)
        // var train_list = res.data.data; //从此次请求返回的数据中获取新数组
        _this.setData({
          map_list: res.data.data.list,
          recommend: res.data.data.recommend
        })

      },
      fail: function () {
        console.log("fail")
      }

    })
    let pages = getCurrentPages();
    let prevPage = pages[pages.length - 2]; 
    console.log(pages)
    console.log(prevPage)
  },

  //选择城市
  selectCity: function (e) {
    console.log(e)
    var name = e.currentTarget.dataset.name;
    var dataset = e.currentTarget.dataset;

    var searchData = this.data.sercherStorage;
    let arrnum = searchData.indexOf(name)
    console.log(arrnum)

    if (arrnum != -1) {
      // 删除已存在后重新插入至数组
      searchData.splice(arrnum, 1)
      searchData.unshift(name);

    } else {
      searchData.unshift(name);
      if (searchData.length >= 4) {//数组最大长度 多出删除
        searchData.splice(3, 1)
      }
    }
    wx.setStorageSync('cityname', searchData)



    this.setData({
      citySelected: dataset.fullname,
      cityListShow: false,
      inputListShow: false,
      historyListShow: true,
      location: {
        latitude: dataset.lat,
        longitude: dataset.lng
      }
    });
    let pages = getCurrentPages();//当前页面    （pages就是获取的当前页面的JS里面所有pages的信息）
    let prevPage = pages[pages.length - 2];//上一页面（prevPage 就是获取的上一个页面的JS里面所有pages的信息）
    console.log(prevPage)
    prevPage.setData({
      city: e.currentTarget.dataset.name,
      id: e.currentTarget.dataset.id,
    })
    wx.navigateBack({
      delta: 1,
    }) //回到上一个页面  仅适用于用navigateTo跳转过来的页面
    // wx.redirectTo({
    //   url: "../dealer/dealer?name=" + name + '&id=' + this.data.brandId
    // })
  },
  touchstart: function (e) {
    this.setData({
      index: e.currentTarget.dataset.index,
      Mstart: e.changedTouches[0].pageX
    });
  },
  touchmove: function (e) {
    var history = this.data.historyList;
    var move = this.data.Mstart - e.changedTouches[0].pageX;
    history[this.data.index].x = move > 0 ? -move : 0;
    this.setData({
      historyList: history
    });
  },
  openLocationsercher: function () {//获取搜索缓存
    this.setData({
      sercherStorage: wx.getStorageSync('cityname') || [],
      StorageFlag: true,
    })
  },
  touchend: function (e) {
    var history = this.data.historyList;
    var move = this.data.Mstart - e.changedTouches[0].pageX;
    history[this.data.index].x = move > 100 ? -180 : 0;
    this.setData({
      historyList: history
    });
  },
  //获取文字信息
  getPy: function (e) {//点击跳转指定位置
  console.log(e)
    this.setData({
      hidden: false,
      showPy: e.target.id,
    })
  },

  setPy: function (e) {
    this.setData({
      hidden: true,
      scrollTopId: this.data.showPy
    })
  },

  //滑动选择城市
  tMove: function (e) {
    var y = e.touches[0].clientY,
      offsettop = e.currentTarget.offsetTop;

    //判断选择区域,只有在选择区才会生效
    if (y > offsettop) {
      var num = parseInt((y - offsettop) / 12);
      this.setData({
        showPy: this.data._py[num]
      })
    };
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})