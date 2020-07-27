// pages/dealer/dealer.js
var config = require('../../utils/config.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    HTTP: config.HTTP,//图片路径
    brandName:[],//产品名字
    brandId:'',//品牌id
    name:'默认排序',
    city:'',
    cname:'',
    uhide: 0, //箭头旋转/隐藏显示
    flag: true,//遮罩
    list:[],
    latitude:'',//纬度
    longitude:'',//经度
  },
 
  advisory(e){//点击拨打
    console.log(e)
    var phone = e.currentTarget.dataset.phone
    wx.makePhoneCall({
      phoneNumber: phone,
    })
  },
  none2(){
    this.setData({
      uhide: 0,
    })
  },
  ShowState: function (e) {
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
  clickform: function (e) {
    var https = config.http_url;
    const _this = this;
    var name = e.currentTarget.dataset.name 
    _this.setData({
      uhide: 0,
      name: name
    })
  },
  click: function (e) {
    var latitude = Number(e.currentTarget.dataset.latitude)
    var longitude = Number(e.currentTarget.dataset.longitude)
    var name = e.currentTarget.dataset.name
    console.log(e)
    console.log(latitude)
    console.log(longitude)
    wx.openLocation({
      latitude: latitude,
      longitude: longitude,
      scale: 15,
      name: name,
      // address: '(常兴店)'
    })
  },



  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var https = config.http_url;
    const _this = this;

    console.log(this.latitude)
  
    // 查看是否授权
    wx.getSetting({
      success: function (res) {
        if (res.authSetting['scope.userInfo']) {
        } else {
          // 用户没有授权
          wx.redirectTo({
            url: '/pages/reg/reg',
          })
        }
      }
    })


    if (options.name ){
      this.setData({
        city: options.name,
      })
    }else{
      var city = wx.getStorageSync('city');
      this.setData({
        city: city,
      })
    }
    this.setData({
      // city: city,
      brandId: options.id,
      cname: options.cname
    })
    console.log(city)
    console.log(this.data.city)
    var brandId = options.id
    console.log(options)
    let pages = getCurrentPages();
    let prevPage = pages[pages.length - 2];
    console.log(pages)
    console.log(prevPage.options)
    prevPage.setData({  // 将我们想要传递的参数在这里直接setData。上个页面就会执行这里的操作。
      id: prevPage.options.id,
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
    var https = config.http_url;
    const _this = this;
    wx.getLocation({
      type: 'wgs84',
      success: (res) => {
        var latitude = res.latitude
        var longitude = res.longitude
        var speed = res.speed
        var accuracy = res.accuracy
        this.setData({ latitude: latitude, longitude: longitude })
        console.log(latitude)
        console.log(longitude)
        wx.showLoading({
          title: '加载中~',
        })

        wx.request({//经销商
          url: https + '/product/distributor',
          data: {
            id: this.data.brandId,
            city: this.data.city,
            longitude: longitude,  // 经度
            latitude: latitude   // 纬度

          },
          header: {
            "Content-Type": "application/x-www-form-urlencoded",
            "openid": wx.getStorageSync('openid'),
            "skey": wx.getStorageSync('skey'),
          },
          method: "get",
          success: function (res) {
            wx.hideLoading()
            console.log(res.data)
            if (res.data.code != 0) {
              console.log('1')
              _this.setData({
                flag: false,//遮罩
              })
            }
            if (res.data.data.list.length == 0) {
              _this.setData({
                flag: false,//遮罩
              })
            } else {
              _this.setData({
                brandName: res.data.data.brandName,
                list: res.data.data.list,
                flag: true,//遮罩
              })
            }


          },
          fail: function () {
            console.log("fail")
          }

        })

      }
    })

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