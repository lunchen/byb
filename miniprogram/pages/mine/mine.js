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
    identity: wx.getStorageSync('identity') ? wx.getStorageSync('identity') : 1 ,       //1参与方 2主办方
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
  },
  getfenxiao(){
    var _this = this
    var req = {
      "nub": _this.data.fenxiaoNub,
      "size": 999
    }
    apiServer.post('/app/order/share/list', req).then(res => {
      if (res.data.data.list.length>0){
        var data = _this.data.fenxiao
        data.push(...res.data.data.list)
        _this.setData({
          fenxiao: data
        })
        _this.setData({
          fenxiaoNub: _this.data.fenxiaoNub + 1
        })
      }
    }).catch(err => {
    })
  },
  tabChange(e){
    var index = e.currentTarget.dataset.index;
    this.setData({
      active: index
    })
    if (index == 0) {
      this.getParticipantInfo()
    }
    if(index == 1){
      this.getfenxiao()
    }
  },
  
  changeFLogin: function (e) {
    // 获取从底部打开登录弹窗
    this.setData({
      loginShow: e.detail.loginShow
    })
  },
  openLogin: function (e) {
    // 获取从底部打开登录弹窗
    // this.setData({
    //   loginShow: 4
    // })
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
      this.getfenxiao()
    } else if (identity == 2) {
      bg = this.data.address2
      this.getSponsorInfo()
    }else{
      bg = this.data.address1
    }
    this.setData({
      "nvabarData.address": bg
    })
    
  },
  goToOutCash(){
    wx.navigateTo({
      url: `../cashOut/cashOut`
    })
  },
  goToReEditActivity(e) {
    var id = e.currentTarget.dataset.id
    var status = e.currentTarget.dataset.status
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
    //去学校编辑或编辑中心
    var id = e.currentTarget.dataset.id;
    // wx.navigateTo({
    //   url: `../editSchoolHome/editSchoolHome?id=${id}`
    // })
    wx.navigateTo({
      url: `../editCenter/editCenter?id=${id}`
    })
  },
  goToOrderDetails(e) {
    var orderNo = e.currentTarget.dataset.orderno;
    var index = e.currentTarget.dataset.index;
    if (this.data.participantInfo.orderList[index].statusName == "待支付" || this.data.participantInfo.orderList[index].statusName == "支付中") {
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
    if (this.data.participantInfo.orderList[index].statusName == "待支付" || this.data.participantInfo.orderList[index].statusName == "支付中"){
      this.goToConfirmOrder(e)
      return
    }
    if (this.data.participantInfo.orderList[index].statusName == "支付超时") {
      return
    }
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
  removeBtn(e){
    var id = e.currentTarget.dataset.id
    var _this = this
    wx.showModal({
      title: '提示',
      content: '是否否删除该活动',
      success: function (res) {
        if (res.cancel) {
        } else if (res.confirm) {
          apiServer.post(`/app/my/org/activity/remove/${id}`).then(res => {
            wx.showToast({
              title: '活动删除成功',
              icon: 'none',
              duration: 1000
            })
            _this.renews()
          }).catch(err => {
            wx.showToast({
              title: "操作失败",
              icon: 'none',
              duration: 1000
            })
          })
        }
      }
    })
  },
  publishBtn(e){
    var _this = this
    var id = e.currentTarget.dataset.id
    var publishFlg = e.currentTarget.dataset.publishflg
    var title,content

    if (publishFlg == 1){
      title = "是否重新上架活动"
      content = "重新上架前请确认活动时间"
    }else{
      title = "提示"
      content = "是否确认下架活动"
    }
    wx.showModal({
      title: title,
      content: content,
      success: function (res) {
        if (res.cancel) {
        } else if (res.confirm) {
          _this.publishApi({ id, publishFlg})
        }
      }
    })
  },
  publishApi(req){
    var _this = this,
        toast
    if (req.publishFlg==1){
      toast = "上架成功"
    }else {
      toast = "下架成功"
    }
    apiServer.post('/app/activity/publish',req).then(res => {
      wx.showToast({
        title: toast,
        icon: 'none',
        duration: 1000
      })
      _this.renews()
    }).catch(err => {
      wx.showToast({
        title: "操作失败",
        icon: 'none',
        duration: 1000
      })
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
        participantInfo: res.data.data
      })
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
      this.getfenxiao()
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