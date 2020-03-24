// 发布活动
// releaseActivity.js
const util = require('../../utils/util.js')
//获取应用实例
const app = getApp()

Page({
  data: {
    //navbar
    // 导航头组件所需的参数
    nvabarData: {
      showCapsule: 1, //是否显示左上角图标   1表示显示    0表示不显示
      title: '发活动', //导航栏 中间的标题
      white: false, // 是就显示白的，不是就显示黑的。
      address: '', // 加个背景 不加就是没有
    },
    
    // 导航头的高度
    height: app.globalData.navheight,
  },
  //事件处理函数
  goToSchoolHome: function() {
    wx.navigateTo({
      url: '../schoolHome/schoolHome'
    })
  },
  
  onLoad: function (e) {
    wx.setNavigationBarColor({
      frontColor: '#000000',
      backgroundColor: '#fff'
    });
    var that = this;
    let id = 1;
    if (!e.id) {
      wx.request({
        url: util.apiUrl(`/app/org/info/${id}`),
        method: 'post',
        data: {
        },
        header: {
          'content-type': 'application/json' // 默认值
        },
        success(res) {
          console.log(res.data)
          that.setData({
            schoolDetails: res.data.data,
          })
        }
      })
    }
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
