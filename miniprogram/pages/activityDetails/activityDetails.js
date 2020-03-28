// 活动详情
//index.js
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
      title: '活动详情', //导航栏 中间的标题
      white: false, // 是就显示白的，不是就显示黑的。
      address: '../../images/home_8@2x.png' // 加个背景 不加就是没有
    },
    // 导航头的高度
    height: app.globalData.navheight,

    activityDetails:{},
    loginShow: 0,
    signUpType: false,
  },
  changeSignUpType: function (e) {
    // 底部按钮 true 为免费预约 false 花费
    this.setData({
      signUpType: e.detail.signUpType
    })
  },
  //事件处理函数
  goToSchoolHome: function (e) {
    var id = e.currentTarget.dataset.id
    util.setId(id)
    wx.navigateTo({
      url: `../schoolHome/schoolHome?id=${id}`
    })
  },
  changeFLogin: function (e) {
    // 获取从底部3按钮获取的报课弹窗状态  底部按钮组件还需要获取用户登录状态
    // 状态1：需登录，2：由学校主页打开需要选择课程，3：由活动详情页打开不用选取课程直接，4：填写姓名电话和基础
    this.setData({
      loginShow: e.detail.loginShow
    })
  },
  onLoad: function (e) {
    wx.setNavigationBarColor({
      frontColor: '#000000',
      backgroundColor: '#fff'
    });

    var that = this;
    let id = e.id ? e.id : 4;
    if (id) {
      console.log(id)
      apiServer.post(`/app/activity/info/${id}`).then(res => {
        console.log(res.data);
        // 设置选中的活动信息用于报名
        var activitySelected = {
          price: res.data.data.info.price,
          value: res.data.data.info.id,
          label: res.data.data.info.name
        }
        wx.setStorageSync("activitySelected", JSON.stringify(activitySelected))
        that.setData({
          "activityListData": res.data.data
        })
      })
    }
  },
  getUserInfo: function(e) {
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }
})
