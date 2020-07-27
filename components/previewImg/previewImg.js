var that;
const app = getApp()
var config = require('../../utils/config.js')
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    previewImgList: {
      type: Array,
      value: false
    },
    previewImg: {
      type: null,
      value: false
    },
  },
  attached: function () {
    that = this;
  },
  /**
   * 组件的初始数据
   */
  data: {
    HTTP: config.HTTP, //图片路径
    preview_box_top: 0,
    left: '0px;',
    touchS: [0, 0],
    touchE: [0, 0],
    index: 0,
    imgindex: 0,
    previewHideStatus: false,
    scale: 1,
    scaleObj: {
      scale: 1,
      x: 0,
      y: 0,
      yes: true
    },
    touchStartTime: 0,   // 触摸开始时间
    touchEndTime: 0,     // 触摸结束时间
    lastTapTime: 0,  // 最后一次单击事件点击发生时间
    lastTapTimeoutFunc: null, // 单击事件点击后要触发的函数
  },
  /**
   * 组件的方法列表
   */
  methods: {
    jingzhi(e) {
      console.log(e)
      let diffTouch = this.data.touchEndTime - this.data.touchStartTime;
      let curTime = e.timeStamp;
      let lastTime = this.data.lastTapDiffTime;
      this.data.lastTapDiffTime = curTime;

      //两次点击间隔小于300ms, 认为是双击
      let diff = curTime - lastTime;
      if (diff < 300) {
        console.log("double tap")
        clearTimeout(this.data.lastTapTimeoutFunc); // 成功触发双击事件时，取消单击事件的执行
        if (that.data.scale == 1) {
          that.setData({
            scale: 3
          })
        } else {
          that.setData({
            scale: 1
          })
        }
      } else {
        this.data.lastTapTimeoutFunc = setTimeout(function () {
          console.log("single tap")
          that.setData({ previewHideStatus: false })
          if (that.data.scaleObj.yes) {
            that.setData({ preview_box_top: '100%' })
          }
        }, 300);
      }
    },
    configqxClick(e) { this.setData({ scopeWritePhotosAlbum: e.detail }) },
    touchStart: function (e) {
      this.data.touchStartTime = e.timeStamp //时间点
      let sx = e.touches[0].pageX
      let sy = e.touches[0].pageY
      this.data.touchS = [sx, sy];
    },
    touchMove: function (e) {
      let start = this.data.touchS;
      let sx = e.touches[0].pageX;
      let sy = e.touches[0].pageY;
      this.data.touchE = [sx, sy];
    },
    touchEnd: function (e) {
      this.data.touchEndTime = e.timeStamp //时间点
      let start = this.data.touchS
      let end = this.data.touchE
      let scaleObj = this.data.scaleObj
      //如果((start[0] < end[0] - 50) && (scaleObj.scale==1&&scaleObj.x==0&&scaleObj.y==0)) //左滑动
      //如果((start[0] > end[0] + 50) && (scaleObj.scale==1&&scaleObj.x==0&&scaleObj.y==0)) //右滑动
      if (scaleObj.yes) {
        if (end[0] == 0) {
          console.log('点击')
          // this.data.previewHideStatus = false
        } else if ((start[0] < end[0] - 50) && (scaleObj.scale == 1 && scaleObj.x == 0 && scaleObj.y == 0)) {
          if (this.data.index !== 0) {
            this.data.index -= 1;
            this.data.imgindex -= 1;
            this.setData({ index: this.data.index, left: '-' + this.data.index + '00%;transition: all .5s;', imgindex: this.data.imgindex });
          }
        } else if ((start[0] > end[0] + 50) && (scaleObj.scale == 1 && scaleObj.x == 0 && scaleObj.y == 0)) {
          if (this.data.index !== this.data.previewImgList.length - 1) {
            this.data.index += 1;
            this.data.imgindex += 1;
            this.setData({ index: this.data.index, left: '-' + this.data.index + '00%;transition: all .5s;', imgindex: this.data.imgindex });
          }
        } else {
          console.log('下滑/上滑');
          this.setData({ preview_box_top: '100%' })
        }
        this.data.touchE = [0, 0];
      }

      setTimeout(() => {
        if (this.data.scaleObj.x == 0 && this.data.scaleObj.y == 0 && this.data.scaleObj.scale == 1) {
          console.log('yes is true');
          this.data.scaleObj.yes = true;
        }
      }, 500)
    },
    showPreview() {
      this.setData({ previewHideStatus: true, preview_box_top: 0 })
    },
    hidePreview() {
      this.setData({ previewHideStatus: false, preview_box_top: 0 })
    },
    onScale(e) {
      this.data.scaleObj = {
        scale: e.detail.scale,
        x: e.detail.x,
        y: e.detail.y,
        yes: false
      }
    },
    stopPageScroll() { return },
  },
  observers: {
    'previewImgList': function (arr) {
    },
    'previewImg': function (img) {
      this.data.previewImgList.map((item, index) => {
        if (item == img) {
          let imgindex = index;
          imgindex += 1;
          this.setData({ index: index, imgindex: imgindex, left: '-' + index + '00%;' })
        }
      })
    }
  },
})
