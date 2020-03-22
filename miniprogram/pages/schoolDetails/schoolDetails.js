//schoolDetails.js
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
      title: '学校详情', //导航栏 中间的标题
      white: false, // 是就显示白的，不是就显示黑的。
      address: '' // 加个背景 不加就是没有
    },
    // 导航头的高度
    height: app.globalData.navheight,

    active: 0,
    schoolDetails: {},

    loginShow: 4
  },
  //事件处理函数
  goToSchoolHome: function (e) {
    var id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `../schoolHome/schoolHome?id=${id}`
    })
  },
  methods: {
  },
  onLoad: function (e) {
    wx.setNavigationBarColor({
      frontColor: '#000000',
      backgroundColor: '#fff'
    });
    var that = this;
    let id = e.id ? e.id : 1;
    if (id) {
      console.log(id)
      apiServer.post(`/app/org/info/${id}`).then(res => {
        console.log(res.data);
        that.setData({
          schoolDetails: res.data.data,
        })
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
