// pages/train/train.js
const app = getApp()
var config = require('../../utils/config.js')
var WxParse = require('../../wxParse/wxParse.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    content:{},
    show_list:false,
    HTTP: config.HTTP,//图片路径
    getAppInfo: '',//判断手机 底部高度
    train_list:[],
    list_ting:[],
    collection: '',
    article:{},
    state:'',
    date: '',
    defImg:'',
    cid:'',//船只id
    imgs:[],
  },
  openpreviewImg() {
    this.selectComponent("#previewComponent").showPreview();
    this.setData({
      defImg: this.data.imgs[0],
    })
  },
  //日历
  onDisplay(e) {
    
    this.setData({ show: true, cid: e.currentTarget.dataset.cid});
  },
  // 点击报名
  baoming(){
    var https = config.http_url;
    const _this = this;
    wx.showLoading({
      title: '加载中~',
    })
    wx.request({
      url: https + '/trip/selectBoat?id=' + _this.data.id, //写自己的服务器
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        "openid": wx.getStorageSync('openid'),
        "skey": wx.getStorageSync('skey'),
      },
      method: "get",
      success: function (res) {
        wx.hideLoading()
        console.log(res.data.data)
        var arr1 = res.data.data; //从此次请求返回的数据中获取新数组
        _this.setData({
          list_ting: arr1 //合并后更新train_list
        })
      },
      fail: function () {
        console.log("fail")
      }

    })


    this.setData({ show_list: true });
  },
  quxiao_list(){
    this.setData({ show_list: false });
  },
  onClose() {
    this.setData({ show: false });
  },
  formatDate(date) {
    date = new Date(date);
    var yue = date.getMonth() + 1
    var ri = date.getDate()
    if (yue >= 10) {
        yue = yue;
    } else {
       yue = '0' + yue;
    }
    if (ri >= 10) {
      ri = ri;
    } else {
      ri = '0' + ri;
    }
    
    return `${yue}-${ri}`;
  },
  onConfirm(event) {
    this.setData({
      show: false,
      date: this.formatDate(event.detail)
    });
    var myDate = event.detail
    var shijian = myDate.getFullYear()+'-' + this.formatDate(event.detail)
    // console.log(this.formatDate(event.detail))
    console.log(shijian)
    // var timearr = event.detail.replace(" ", ":").replace(/\:/g, "-").split("-");
    // var timestr = "" + timearr[0] + "/" + timearr[1] + "/" + timearr[2]
    // console.log(timearr)
    wx.navigateTo({
      url: '../train_order/train_order?shijian=' + shijian +'&id=' +this.data.cid,
    })
    this.setData({ show_list: false });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中~',
    })
    console.log(options)
    var id = options.id
    var getAppInfo = app.globalData.bottom; //获取底部高度
    var https = config.http_url;
    const _this = this;
    this.setData({
      getAppInfo: getAppInfo,
      id: options.id
    })
    //渲染培训详情
    wx.request({
      url: https + '/trip/product?id=' + id, //写自己的服务器
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        "openid": wx.getStorageSync('openid'),
        "skey": wx.getStorageSync('skey'),
      },
      method: "get",
      success: function (res) {
        wx.hideLoading()
        console.log(res.data.data)
        var arr1 = res.data.data; //从此次请求返回的数据中获取新数组

        _this.setData({
          imgs: res.data.data.images,
          state: res.data.data.state,
          article: res.data.data.content, //产品介绍
          collection: res.data.data.collection,//收藏
          train_list: arr1 //合并后更新train_list
        })
        WxParse.wxParse('article', 'html', _this.data.article, _this, 5);
      },
      fail: function () {
        console.log("fail")
      }

    })
  },

  //收藏功能
  haveSave(e) {
    var https = config.http_url;
    var _this = this
    var shouchang_id = this.data.id
    console.log(shouchang_id)
    if (!this.data.collection == true) {
      wx.request({
        url: https + '/member/collection', //写自己的服务器
        data: {
          id: shouchang_id,
          from: 4
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
            collection: 1
          })

        },
        fail: function () {
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
          id: shouchang_id,    // 商品id
          from: 4 // 来源 1:产品  2:活动  3:礼品
        },
        header: {
          "Content-Type": "application/x-www-form-urlencoded",
          "openid": wx.getStorageSync('openid'),
          "skey": wx.getStorageSync('skey'),
        },
        method: "post",
        success: function (res) {
          _this.setData({
            collection: 0
          })
          wx.showToast({
            title: '已取消收藏',
          });

        },
        fail: function () {
          console.log("fail")
        }
      })
      wx.showToast({
        title: '已取消收藏',
      });
    }
  },


  previewImg: function (e) { //点击全屏预览图片
    console.log(e.currentTarget.dataset.index);
    var index = e.currentTarget.dataset.index;

    var HTTP = this.data.HTTP
    var imgArr = this.data.imgs;
    var imgArr3 = []
    for (var i = 0; i < imgArr.length; i++) {
      var imgArr2 = HTTP + imgArr[i].split(",")
      imgArr3[i] = imgArr2
      console.log(imgArr2)
    }
    wx.previewImage({
      current: imgArr3[index], //当前图片地址
      urls: imgArr3, //所有要预览的图片的地址集合 数组形式
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})