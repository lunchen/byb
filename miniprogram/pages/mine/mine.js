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
    identity:1,       //1参与方 2主办方
    participantInfo: {},
    sponsorInfo: {},
    loginShow: 0,
  },
  changeFLogin: function (e) {
    // 获取从底部打开登录弹窗
    this.setData({
      loginShow: e.detail.loginShow
    })
  },
  openLogin: function (e) {
    // 获取从底部打开登录弹窗
    this.setData({
      loginShow: 4
    })
  },
  changeIdentity(e){
    var identity = e.currentTarget.dataset.identity
    var token = wx.getStorageSync("token") ? JSON.parse(wx.getStorageSync("token")):''
    console.log(e)
    if (token == ""){
      this.openLogin()
      return
    }
    if (!token.token) {
      wx.showToast({
        title: '您未开通主办方权限，如需开通主办方权限请点击商务洽谈联系我们。',
        icon: 'none',
        duration: 5000
      })
      return
    } else {
      this.setData({
        identity: identity
      })
    }
    if (identity==1){
      this.getParticipantInfo()
    } else if(identity == 2){
      this.getSponsorInfo()
    }
    
  },
  goToETicket(e) {
    var orderNo = e.currentTarget.dataset.orderno
    console.log(orderNo)
    wx.navigateTo({
      url: `../eTicket/eTicket?orderNo=${orderNo}`,
    })
  },
  goToPersonalCenter(e) {
    var token = wx.getStorageSync('token')?JSON.parse(wx.getStorageSync('token')):'';
    console.log(token)
    if (token == ''){
      this.openLogin()
    }else{
      wx.navigateTo({
        url: `../personalCenter/personalCenter`,
      })
    }
    
  },
  goToJoinerManage(e){
    var id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `../joinerManage/joinerManage?id=${id}`,
    })
  },
  goToReleaseActivity(e){
    var id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `../releaseActivity/releaseActivity?id=${id}`,
    })
  },
  onLoad: function (options) {
    app.editTabbar();
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: '#fff'
    });
    var _this = this
    this.getParticipantInfo()
    this.getSponsorInfo()
  },
  getParticipantInfo(){
    var _this = this
    apiServer.post('/app/my/user/index').then(res => {
      console.log("user");
      console.log(res.data);
      _this.setData({
        participantInfo: res.data.data
      })
    })
  },
  getSponsorInfo() {
    var _this = this
    apiServer.post('/app/my/org/index').then(res => {
      console.log("org");
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