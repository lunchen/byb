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
    address1: '../../images/participantBg.png', // 加个背景 不加就是没有
    address2: '../../images/sponsorBg.png', // 加个背景 不加就是没有
    nvabarData: {
      showCapsule: 0, //是否显示左上角图标   1表示显示    0表示不显示
      title: '我的', //导航栏 中间的标题
      white: true, // 是就显示白的，不是就显示黑的。
      address: '../../images/participantBg.png', // 加个背景 不加就是没有
    },

    // 导航头的高度
    height: app.globalData.navheight,
    isIphoneX: app.globalData.isIphoneX,
    cmt: app.globalData.isIphoneX ? 20 : 24,
    //tabbar
    tabbar: {},
    identity: wx.getStorageSync('identity') ? parseInt(wx.getStorageSync('identity')) : 1 ,       //1参与方 2主办方
    participantInfo: {},
    sponsorInfo: {},
    loginShow: 0,
    
    active: 0,
    // 活动
    participant: {
      selectList: [{
        label: "全部订单"
      },
      {
        label: "分销订单"
      }]
    },
    fenxiaoNub:1,
    fenxiao:[],
    userShareFlg: wx.getStorageSync('userShareFlg') ? parseInt(wx.getStorageSync('userShareFlg')) : 0
  },
  
  openLogin: function (e) {
    wx.navigateTo({
      url: '../getAuth/getAuth',
    })
  },
  changeIdentity(e){
    var identity = e.currentTarget.dataset.identity
    var token = wx.getStorageSync("token") ? JSON.parse(wx.getStorageSync("token")):''
    if (token == ""){
      this.openLogin()
      return
    }
    if (!token.token) {
      wx.showToast({
        title: '您未开通主办方权限，如需开通主办方权限请点击商务洽谈联系我们。',
        icon: 'none',
        duration: 1000
      })
      return
    } else {
      this.setData({
        identity: identity
      })
      wx.setStorageSync('identity', identity)
      app.editTabbar()
    }
    var bg
    if (identity == 1) {
      this.getParticipantInfo()
      bg = this.data.address1
    } else if (identity == 2) {
      bg = this.data.address2
      this.getSponsorInfo()
    }else{
      bg = this.data.address1
    }
    console.log(bg)
    this.setData({
      "nvabarData.address": bg
    })
    
  },
  goToContactUs(){
    if(util.checkLogin()){
      wx.navigateTo({
        url: `../contactUs/contactUs`
      })
    }else{
      this.openLogin()
    }
    
  },
  goToOrgOrder(){
    if(util.checkLogin()){
      wx.navigateTo({
        url: `../org-order/org-order`
      })
    }else{
      this.openLogin()
    }
    
  },
  goToJoinfenxiao(){
    // if(this.data.userShareFlg == 1){
    //   wx.showToast({
    //     title: '您已经是分销员了哦~',
    //     icon:'none',
    //     duration: 1500
    //   })
    // }else{
      
    // }
    if(util.checkLogin()){
      wx.navigateTo({
        url: `../joinfenxiao/joinfenxiao`
      })
    }else{
      this.openLogin()
    }
  },
  goToMineOrder(){
    if(util.checkLogin()){
      wx.navigateTo({
        url: `../mine-order/mine-order`
      })
    }else{
      this.openLogin()
    }
  },
  goToOutCash(){
    wx.navigateTo({
      url: `../cashOut/cashOut`
    })
  },

  goToEditSchoolHome(e) {
    //去学校编辑或编辑中心
    var id = e.currentTarget.dataset.id;
    // wx.navigateTo({
    //   url: `../editSchoolHome/editSchoolHome?id=${id}`
    // })
    wx.navigateTo({
      url: `../editCenter/editCenter?id=${id}`
    })
  },
  goToFeedback(e) {
    wx.navigateTo({
      url: `../feedback/feedback`
    })
  },
  goToPersonalCenter(e) {
    var token = wx.getStorageSync('token')?JSON.parse(wx.getStorageSync('token')):'';
    if (token == ''){
      this.openLogin()
    }else{
      wx.navigateTo({
        url: `../personalCenter/personalCenter`,
      })
    }
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
      _this.setData({
        participantInfo: res.data.data,
        userShareFlg:res.data.data.shareFlg
      })
      wx.setStorageSync('userShareFlg', res.data.data.shareFlg)
      wx.setStorageSync('userInfo', JSON.stringify(res.data.data.user))
    }).catch(err=>{
      _this.setData({
        identity: wx.getStorageSync('identity') ? wx.getStorageSync('identity') : 1
      })
    })
  },
  getSponsorInfo() {
    var _this = this
    apiServer.post('/app/my/org/index').then(res => {
      _this.setData({
        sponsorInfo: res.data.data
      })
      wx.setStorageSync("myOrgMes", JSON.stringify(res.data.data))
    }).catch(err => {
      _this.setData({
        identity: wx.getStorageSync('identity') ? wx.getStorageSync('identity') : 1
      })
    })
  },
  onShow: function () {
    wx.hideTabBar()
    var bg
    if (wx.getStorageSync('identity') == 2) {
      bg = this.data.address2
    }else{
      bg = this.data.address1
    }
    this.setData({
      participantInfo: {},
      sponsorInfo: {},
      fenxiao: [],
      identity: wx.getStorageSync('identity') ? wx.getStorageSync('identity') : 1,
      "nvabarData.address": bg
    })
    var _this = this
    this.renews()
  },
  renews: function () {
    this.setData({
      participantInfo: {},
      sponsorInfo: {},
      fenxiao: []
    })
    var _this = this
    var token = wx.getStorageSync("token") ? JSON.parse(wx.getStorageSync("token")) : '';
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