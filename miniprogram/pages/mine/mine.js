// 我的
// pages/mine/mine.js
const util = require('../../utils/util.js')
const apiServer = require('../../api/request.js');
//获取应用实例
const app = getApp()
Page({
  data: {
    //navbar
    // 导航头组件所需的参数
    nvabarData: {
      showCapsule: 0, //是否显示左上角图标   1表示显示    0表示不显示
      title: '首页', //导航栏 中间的标题
      white: true, // 是就显示白的，不是就显示黑的。
      address: '../../images/participant_1@2x.png', // 加个背景 不加就是没有
    },

    // 导航头的高度
    height: app.globalData.navheight,
    isIphoneX: app.globalData.isIphoneX,
    cmt: app.globalData.isIphoneX ? 20 : 24,
    //tabbar
    tabbar: {},
    identity:2,       //1参与方 2主办方
    participantInfo: {},
    sponsorInfo: {},
  },
  changeIdentity(e){
    var identity = e.currentTarget.dataset.identity
    console.log(e)
    this.setData({
      identity: identity
    })
  },
  goToETicket(e) {
    var orderNo = e.currentTarget.dataset.orderno
    console.log(orderNo)
    wx.navigateTo({
      url: `../eTicket/eTicket?orderNo=${orderNo}`,
    })
  },
  goToPersonalCenter(e) {
    wx.navigateTo({
      url: `../personalCenter/personalCenter`,
    })
  },
  onLoad: function (options) {
    app.editTabbar();
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: '#fff'
    });
    var _this = this
    apiServer.post('/app/my/user/index').then(res => {
      // console.log(res.data);
      _this.setData({
        participantInfo: res.data.data
      })
    })
    apiServer.post('/app/my/org/index').then(res => {
      console.log(res.data);
      _this.setData({
        sponsorInfo: res.data.data
      })
    })
  },
  onReady: function () {

  },
  onShow: function () {
    wx.hideTabBar()
  },
  onHide: function () {

  },
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})