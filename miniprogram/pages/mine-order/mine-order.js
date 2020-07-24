// 我的订单
// pages/mine-order/mine-order.js
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
      backreload: false,
      showCapsule: 1, //是否显示左上角图标   1表示显示    0表示不显示
      title: '我的订单', //导航栏 中间的标题
      white: true, // 是就显示白的，不是就显示黑的。
      address: '', // 加个背景 不加就是没有
    },

    // 导航头的高度
    height: app.globalData.navheight,
    isIphoneX: app.globalData.isIphoneX,
    cmt: app.globalData.isIphoneX ? 20 : 24,
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
    orderStatusSelectList:[],
    orderSelected:0,
    orderReq:{
      "nub": 1,
      "size": 999,
      "status": ''
    },
    fxTotal:0
  },
  getfenxiaoTotal(){
    var _this = this
    apiServer.post('/app/order/share/total').then(res => {
      _this.setData({
        fxTotal: res.data.data.amount,
      })
    }).catch(err => {
    })
  },
  getfenxiao(){
    var _this = this
    var req = {
      "nub": _this.data.fenxiaoNub,
      "size": 999
    }
    apiServer.post('/app/order/share/list', req).then(res => {
      console.log(_this.data.fenxiao.length)
      if (_this.data.fenxiaoNub>1){
        var data = _this.data.fenxiao
        data.push(...res.data.data.list)
        // _this.setData({
        //   fenxiaoNub: _this.data.fenxiaoNub + 1
        // })
      }else{
        var data = res.data.data.list
      }
      console.log(data)
      _this.setData({
        fenxiao: data,
      })
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
      this.getfenxiaoTotal()
      this.getfenxiao()
    }
  },
  tabOrderChange(e){
    var index = e.currentTarget.dataset.index;
    var value = e.currentTarget.dataset.value
    this.setData({
      orderSelected: index,
      'orderReq.status': value
    })
    this.getParticipantInfo()
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
      // wx.navigateTo({
      //   url: `../personalCenter/personalCenter`,
      // })
    }
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
  onLoad: function (options) {
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: '#fff'
    });
  },
  getParticipantInfo(){
    var _this = this
    let req = this.data.orderReq
    apiServer.post('/app/my/user/order/list',req).then(res => {
      _this.setData({
        'participantInfo.orderList': res.data.data.list
      })
    }).catch(err=>{
    })
  },
  
  getOrderSelect(){
    var _this = this
    apiServer.post('/app/my/user/order/status/select','','get').then(res => {
      _this.setData({
        orderStatusSelectList: res.data.data.list
      })
      console.log(res.data.data)
    }).catch(err=>{
      
    })
  },
  onShow: function () {
    var bg
    
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
    this.getOrderSelect()
    this.getParticipantInfo()
    this.getfenxiao()
    this.getfenxiaoTotal()
    
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