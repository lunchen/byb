// 商务洽谈页
//business.js
const util = require('../../utils/util.js')
const apiServer = require('../../api/request.js');
//获取应用实例
const app = getApp()

Page({
  data: {
    //navbar
    // 导航头组件所需的参数
    nvabarData: {
      showCapsule: 1, //是否显示左上角图标   1表示显示    0表示不显示
      title: '意见反馈', //导航栏 中间的标题
      white: false, // 是就显示白的，不是就显示黑的。
      address: '' // 加个背景 不加就是没有
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
    
    activityDetails:{},
    telephone:'',
    wechat: "",
    req:{
      name: '',
      telephone:'',
    },
    remark:'',
  },
  //事件处理函数
  textareaIpt(e) {
    // 机构简介
    var value = e.detail.value
    this.setData({
      "remark": value
    });
  },
  //事件处理函数
  goToSchoolHome: function() {
    wx.navigateTo({
      url: '../schoolHome/schoolHome'
    })
  },
  onLoad: function (e) {
    var that = this;
    wx.setNavigationBarColor({
      frontColor: '#000000',
      backgroundColor: '#fff'
    });
    apiServer.post(`/app/call/me`).then(res => {
      that.setData({
        telephone: res.data.data.telephone,
        wechat: res.data.data.wechat,
      })
    })
  },
  mesIpt(e){
    var key = e.currentTarget.dataset.key
    this.setData({
      [`req.${key}`]: e.detail.value
    })
  },
  submit(){
    var req = {remark: this.data.remark}
    console.log(req)
    apiServer.post(`/app/my/user/feedback`, req).then(res => {
      wx.showToast({
        title: '您宝贵的意见已提交成功，感谢您对小报的支持~',
        icon: 'none',
        duration: 3000
      })
    })
  },
  getUserInfo: function(e) {
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  makePhoneCall: function (e) {
    var that = this
    // var tel = e.currentTarget.dataset.tel
    wx.makePhoneCall({
      phoneNumber: this.data.telephone,
      success: function () {
        console.log('拨打成功')
      },
      fail: function () {
        console.log('拨打失败')
      }
    })
  },
  onShareAppMessage: function (ops) {
    var json = encodeURIComponent(JSON.stringify({ a: 1 }));
    if (ops.from === 'button') {
      // 来自页面内转发按钮
      console.log(ops.target)
    }
    return {
      title: '报1 报',
      path: '/pages/business/business',
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
