//index.js
const util = require('../../utils/util.js')
//获取应用实例
const app = getApp()

Page({
  data: {
    //navbar
    // 导航头组件所需的参数
    nvabarData: {
      showCapsule: 1, //是否显示左上角图标   1表示显示    0表示不显示
      title: '活动详情', //导航栏 中间的标题
      white: false, // 是就显示白的，不是就显示黑的。
      address: '../../images/home_8@2x.png' // 加个背景 不加就是没有
    },
    // 导航头的高度
    height: app.globalData.navheight,

    //tabbar
    tabbar: {},
    value: '',
    
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    
    activityDetails:{}
  },
  //事件处理函数
  goToSchoolHome: function() {
    wx.navigateTo({
      url: '../schoolHome/schoolHome'
    })
  },
  onLoad: function (e) {
    var that = this;
    let id = 1;
    if(!e.id){
      wx.request({
        url: util.apiUrl(`/activity/info/${id}`),
        method: 'post',
        data: {
        },
        header: {
          'content-type': 'application/json' // 默认值
        },
        success(res) {
          console.log(res.data);
          that.setData({
            "activityListData": res.data.data
          })
        }
      })
    }
    console.log(e)
    wx.setNavigationBarColor({
      frontColor: '#000000',
      backgroundColor: '#fff'
    });
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
