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
      title: '我的', //导航栏 中间的标题
      white: true, // 是就显示白的，不是就显示黑的。
      address: '../../images/participant_1@2x.png', // 加个背景 不加就是没有
    },

    // 导航头的高度
    height: app.globalData.navheight,
    isIphoneX: app.globalData.isIphoneX,
    cmt: app.globalData.isIphoneX ? 20 : 24,
    //tabbar
    tabbar: {},
    identity: wx.getStorageSync('identity') ? wx.getStorageSync('identity') : 1 ,       //1参与方 2主办方
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
      wx.setStorageSync('identity', identity)
    }
    if (identity==1){
      this.getParticipantInfo()
    } else if(identity == 2){
      this.getSponsorInfo()
    }
    
  },
  goToReEditActivity(e) {
    var id = e.currentTarget.dataset.id
    var status = e.currentTarget.dataset.status
    console.log(e)
    console.log(status)
    if (status == 1){
      wx.showToast({
        title: '正在进行中的活动请下架后再编辑',
        icon: 'none',
        duration: 2000
      })
      return
    }
    wx.navigateTo({
      url: `../reEditActivity/reEditActivity?id=${id}`,
    })
  },
  goToActivityDetails(e) {
    var id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `../activityDetails/activityDetails?id=${id}`
    })
  },
  goToEditSchoolHome(e) {
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `../editSchoolHome/editSchoolHome?id=${id}`
    })
  },
  goToOrderDetails(e) {
    var orderNo = e.currentTarget.dataset.orderno;
    console.log(orderNo);
    var index = e.currentTarget.dataset.index;
    if (this.data.participantInfo.orderList[index].statusName == "待支付") {
      this.goToConfirmOrder(e);
      return
    }
    wx.navigateTo({
      url: `../orderDetails/orderDetails?orderNo=${orderNo}`,
    })
  },
  goToETicket(e) {
    var orderNo = e.currentTarget.dataset.orderno
    var activityId = e.currentTarget.dataset.actvityid
    var index = e.currentTarget.dataset.index
    console.log(e)
    if (this.data.participantInfo.orderList[index].statusName == "待支付"){
      this.goToConfirmOrder(e)
      return
    }
    console.log(orderNo)
    wx.navigateTo({
      url: `../eTicket/eTicket?orderNo=${orderNo}&id=${activityId}`,
    })
  },
  goToConfirmOrder(e) {
    var orderNo = e.currentTarget.dataset.orderno
    wx.navigateTo({
      url: `../confirmOrder/confirmOrder?orderNo=${orderNo}`,
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
    var type = e.currentTarget.dataset.type
    wx.navigateTo({
      url: `../joinerManage/joinerManage?id=${id}&type=${type}`,
    })
  },
  goToReleaseActivity(e){
    var id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `../releaseActivity/releaseActivity?id=${id}`,
    })
  }, 
  goToSchoolHome(e) {
    var id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `../schoolHome/schoolHome?id=${id}`,
    })
  },
  goToBusiness(e) {
    wx.navigateTo({
      url: '../business/business'
    })
  },
  xiajia(){

  },
  onLoad: function (options) {
    app.editTabbar();
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: '#fff'
    });
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
      app.globalData.orgMes = res.data.data
    })
  },
  onShow: function () {
    wx.hideTabBar()
    this.setData({
      participantInfo: {},
      sponsorInfo: {},
      identity : wx.getStorageSync('identity') ? wx.getStorageSync('identity') : 1
    })
    var _this = this
    this.renews()
  },
  renews: function () {
    this.setData({
      participantInfo: {},
      sponsorInfo: {}
    })
    var _this = this
    var token = wx.getStorageSync("token") ? JSON.parse(wx.getStorageSync("token")) : '';
    console.log(token)
    var identity = this.data.identity;
    if (token.authorization && identity == "1"){
      this.getParticipantInfo()
    }
    if (token.token && identity == "2") {
      this.getSponsorInfo()
    }
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
})