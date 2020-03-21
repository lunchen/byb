//schoolHome.js
const util = require('../../utils/util.js')
//获取应用实例
const app = getApp()

Page({
  data: {
    //navbar
    // 导航头组件所需的参数
    nvabarData: {
      showCapsule: 1, //是否显示左上角图标   1表示显示    0表示不显示
      title: '学校主页', //导航栏 中间的标题
      white: false, // 是就显示白的，不是就显示黑的。
      address: '../../images/home_8@2x.png' // 加个背景 不加就是没有
    },
    // 导航头的高度
    height: app.globalData.navheight,
    cmt: app.globalData.cmt,

    swiperWidth: wx.getSystemInfoSync().windowWidth,
    background: ['demo-text-1', 'demo-text-2', 'demo-text-3'],
    // 视频
    indicatorDots: true,
    vertical: false,
    autoplay: false,
    interval: 2000,
    duration: 500,
    indicatorColor: "#bbb",
    indicatorActiveColor: "#fff",
    current: 0,
    // 地图标记
    longitudeCenter: 113.324520,
    latitudeCenter: 23.099994,
    markers: [{
      iconPath: "../../images/location.png",
      id: 0,
      latitude: 23.099994,
      longitude: 113.324520,
      width: 50,
      height: 50
    }],
    // 划线
    polyline: [{
      points: [{
        longitude: 113.3245211,
        latitude: 23.10229
      }, {
        longitude: 113.324520,
        latitude: 23.21229
      }],
      color: "#000000",
      width: 2,
      dottedLine: true
    }],
    schoolHomeData:{},
  },
  // 滑块
  swiperChange(e) {
    var that = this;
    if (e.detail.source == 'touch') {
      wx.createVideoContext('myVideo' + that.data.current).stop()
      that.setData({
        current: e.detail.current
      })
      wx.createVideoContext('myVideo' + e.detail.current).play()
    }
  }, 
  regionchange(e) {
    console.log(e.type)
  },
  markertap(e) {
    console.log(e.markerId)
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  videoErrorCallback: function (e) {

    console.log('视频错误信息:' + e.detail.errMsg);

  },
  onLoad: function (e) {
    wx.setNavigationBarColor({
      frontColor: '#000000',
      backgroundColor: '#fff'
    });
    var that = this;
    let id =1;
    if (!e.id) {
      wx.request({
        url: util.apiUrl(`/org/index/${id}`),
        method: 'post',
        data: {
        },
        header: {
          'content-type': 'application/json' // 默认值
        },
        success(res) {
          console.log(res.data)
          that.setData({
            schoolHomeData: res.data.data,
            markers: [{
              iconPath: "../../images/location.png",
              id: 0,
              latitude: res.data.data.addr.latitude,
              longitude: res.data.data.addr.longitude,
              width: 50,
              height: 50
            }],
            latitudeCenter: res.data.data.addr.latitude,
            longitudeCenter: res.data.data.addr.longitude
          })
        }
      })
    }
  },
  onReady: function () {
    // wx.createVideoContext('myVideo' + 0).play();
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }
})
