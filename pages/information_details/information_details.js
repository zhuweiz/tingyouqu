var app = getApp();
Page({

  /**
   * 页面的初始数据
   * user开头的数据都是楼主的
   */
  data: {
    wantID: 0,
    userID: 0, //userID
    replyUserID: 0, //回复哪个人的userID 默认等于楼主id
    replyName: "",
    count: 0,
    content: "",
    imgUrl: "",
    time: "",
    title: "",
    userName: "",
    userImg: "",
    limit: 5,
    wantReplay: [],
    contentInp: "",
    replyInp: "",
    focus: false,
    check: true, //默认显示我来评论input
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      wantID: options.id
    })
    this.getWantDetail();
  },

  getWantDetail() {
    let params = {
      wantID: this.data.wantID,
      offset: 0,
      limit: this.data.limit
    }
    app.getWantDetail(params).then(res => {
      let wantDetail = [];
      for (var i = 0; i < res.data.wantDetail.length; i++) {
        if (res.data.wantDetail[i].pid === 0) {
          wantDetail = res.data.wantDetail[i]
          res.data.wantDetail.splice(i, 1)
        }
      }
      this.setData({
        wantReplay: res.data.wantDetail,
        count: wantDetail.count,
        content: wantDetail.content,
        imgUrl: wantDetail.imgUrl,
        time: wantDetail.time,
        title: wantDetail.title,
        userName: wantDetail.userName,
        userImg: wantDetail.userImg,
        userID: wantDetail.userID,
        replyUserID: wantDetail.userID,
      })
    })
  },

  onReachBottom: function () {
    this.data.limit = this.data.limit + 4
    this.getWantDetail();
  },
  //触摸事件切换到回复楼主
  touchstar: function () {
    this.setData({
      check: true,
      focus: false,
      contentInp: "",
      replyInp: "",
    })
  },
  /**评论输入框 */
  contentInp(e) {
    this.setData({
      contentInp: e.detail.value
    })
  },
  /**答复输入框 */
  replyInp(e) {
    this.setData({
      replyInp: e.detail.value
    })
  },

  /**消息图片点击 */
  addWantImg() {
    this.setData({
      focus: true,
    })
  },
  addWant() {
    if (this.data.contentInp.length > 100) {
      wx.showToast({
        title: '请将字数控制在100字以内哦',
        icon: "none",
        duration: 1000,
        mask: true,
      })
    } else {
      if (this.data.replyUserID === this.data.userID && this.data.check === true) {
        this.addComment();
      } else {
        this.addReply();
      }
    }
  },

  /**发表评论 */
  addComment() {
    let params = {
      pID: this.data.wantID,
      userID: app.globalData.userID,
      content: this.data.contentInp,
      replyUserID: this.data.userID,
      type: 1,
      state: true
    }
    app.addReply(params).then(res => {
      if (res.state === 1) {
        this.setData({
          contentInp: ""
        })
        wx.showToast({
          title: '评论成功',
          icon: "none",
          duration: 1000,
          mask: true,
        })
        this.getWantDetail();
      }
    })
  },
  /**点击评论获取要回复的人的id */
  getReplyUserID(e) {
    let replyID = e.currentTarget.dataset.replyuserid;
    if (replyID === app.globalData.userID) {
      wx.showToast({
        title: '请不要回复自己哦',
        icon: "none",
        duration: 1000,
        mask: true,
      })
    } else {
      this.setData({
        replyUserID: replyID,
        replyName: e.currentTarget.dataset.replyname,
        focus: true,
        check: false
      })
    }
  },
  /**回复 */
  addReply() {
    let params = {
      pID: this.data.wantID,
      userID: app.globalData.userID,
      content: this.data.replyInp,
      replyUserID: this.data.replyUserID,
      type: 1,
      state: false
    }
    app.addReply(params).then(res => {
      if (res.state === 1) {
        this.setData({
          replyInp: "",
          check: true
        })
        wx.showToast({
          title: '评论成功',
          icon: "none",
          duration: 1000,
          mask: true,
        })
        this.getWantDetail();
      }
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (ops) {
    wx.showShareMenu({
      withShareTicket: true
    })
    return {
      title: 'xxxx',
      path: 'pages/wantDetail/wantDetail?id=' + this.data.wantID,
      imageUrl: "https://qhds.drefore.cn" + this.data.imgUrl,
      success: function (res) {
        console.log("success" + res)
      },
      fail: function (res) {
        console.log("fail" + res)
      }
    }
  },
})