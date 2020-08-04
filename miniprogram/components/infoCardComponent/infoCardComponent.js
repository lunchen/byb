// 活动信息卡
const app = getApp()
Component({
  properties: {
    infoCardrData: {
      type: Object,
      value: {},
      observer: function (newVal, oldVal) { 
      }
    },
    infoCardType: {
      type: Number,
      value: 1  //1显示价格 2不显示价格 默认1
    },
    ifRencent: {
      type: Boolean,
      value: false  //1显示价格 2不显示价格 默认1
    },
  },
  data: {
    height: '',
    //默认值  默认显示左上角
    navbarData: {
      showCapsule: 1
    },
    imageWidth: wx.getSystemInfoSync().windowWidth, // 背景图片的高度
    imageHeight: '' // 背景图片的长度，通过计算获取
  },
  onLoad(){
    console.log(this.properties)
  },
  attached: function () {
    // 获取是否是通过分享进入的小程序
    this.setData({
      share: app.globalData.share
    })
  },
  methods: {
    // 返回上一页面
    _navback() {
      wx.navigateBack()
    },
    // 计算图片高度
    imgLoaded(e) {
      this.setData({
        imageHeight:
          e.detail.height *
          (wx.getSystemInfoSync().windowWidth / e.detail.width)
      })
    }
  }
})