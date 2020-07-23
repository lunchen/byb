// 搜索页
// joinfenxiao.js
const util = require('../../utils/util.js');
const apiServer = require('../../api/request.js');
//获取应用实例
const app = getApp()

Page({
  data: {
    //navbar
    // 导航头组件所需的参数
    nvabarData: {
      showCapsule: 1, //是否显示左上角图标   1表示显示    0表示不显示
      title: '分销推广员', //导航栏 中间的标题
      white: false, // 是就显示白的，不是就显示黑的。
      address: '' // 加个背景 不加就是没有
    },
    // 导航头的高度
    height: app.globalData.navheight,
    value: '',
    searchTheme: [],
    
    activityList: [],
    req: {
      "keyword": "",
      "nub": 1,
      "size": 6
    },
    refresherTriggered: false,
    loadingMore: false,
    loadingMoreText: "加载中...",
    imageWidth: wx.getSystemInfoSync().windowWidth, // 背景图片的高度
    imageHeight: '', // 背景图片的长度，通过计算获取
    imageHeight1: '', // 背景图片的长度，通过计算获取
    show: false,
  },
  // 计算图片高度
  imgLoaded(e) {
    console.log(e)
    this.setData({
      imageHeight:
        e.detail.height * (wx.getSystemInfoSync().windowWidth / e.detail.width)
    })
  },
  // 计算图片高度
  imgLoaded1(e) {
    console.log(e)
    this.setData({
      imageHeight1:
        e.detail.height * (wx.getSystemInfoSync().windowWidth / e.detail.width)
    })
  },
  bindHandle(){
    var _this = this
    apiServer.post(`/app/my/user/sharer/apply`).then(res => {
      this.setData({
        show: true
      })
  
      wx.showToast({
        title: '您已成功开通分销员身份',
        icon: 'none',
        duration: 1000
      })
      setTimeout(()=>{
        _this.goToMine()
      },1000)
    })
  },
  goToMine(){
    wx.switchTab({
      url: `../mine/mine`,
    })
  },
  onClose(){
    this.setData({
      show: false
    })
  },
  onLoad: function () {
    var that = this;
    wx.setNavigationBarColor({
      frontColor: '#000000',
      backgroundColor: '#fff'
    });
  },
  onShareAppMessage: function (ops) {
    var json = encodeURIComponent(JSON.stringify({ a: 1 }));
    if (ops.from === 'button') {
      // 来自页面内转发按钮
      console.log(ops.target)
    }
    return {
      title: '报1 报',
      path: '/pages/search/search',
      imageUrl: "",
      success: function (res) {
        // 转发成功
        console.log("转发成功:" + JSON.stringify(res));

      },
      fail: function (res) {
        // 转发失败
        console.log("转发失败:" + JSON.stringify(res));
      }
    }

  },
})
