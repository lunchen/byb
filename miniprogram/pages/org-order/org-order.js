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
      showCapsule: 1, //是否显示左上角图标   1表示显示    0表示不显示
      title: '活动管理', //导航栏 中间的标题
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
    status:'',
    active:0,
    activeId:'',
    show: false,
    nop:'-1',
    baifenbi:'',
    shuzhi:'',
    maxhb:''
  },
  
  onRadioChange(e){
    console.log(e.detail)
    this.setData({
      "nop": e.detail,
      "baifenbi": '',
      "shuzhi": ''
    });
 
  },
  onfxIptChange: function(e) {
    var key = e.currentTarget.dataset.key
    var num = e.detail
    this.setData({
      [`${key}`]: num
    });
    
  },
  
  shuzhiblur(){
    var num = 0
    if(this.data.shuzhi<this.data.maxhb && this.data.shuzhi>=0){
      num = this.data.shuzhi
    }else{
      num = this.data.maxhb
    }
    this.setData({
      "shuzhi": num,
    })
  },
  baifenbiblur(){
    var num = 0
    if(this.data.baifenbi*1<30 && this.data.shuzhi*1>=0){
      num = this.data.baifenbi
    }else{
      num = 30
    }
    this.setData({
      "baifenbi": num,
    })
  },
  tabChange(e){
    var index = e.currentTarget.dataset.index;
    this.setData({
      active: index,
      status:this.data.orderStatusSelectList[index].value
    })
    this.getOrgOrder()
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
  fenxiaoBtn(e){
    var _this = this
    var id = e.currentTarget.dataset.id
    var price = e.currentTarget.dataset.price
    var shareFlg = e.currentTarget.dataset.shareflg
    console.log(shareFlg)
    if(price>0){
      if(shareFlg==0){
        this.setData({
          activeId:id,
          maxhb: price*0.3*10/10,
          show: true,
          nop: '-1',
          shuzhi:'',
          baifenbi:'',
        });
      }else{
        this.closefenxiao(id)
      }
    }else{
      wx.showToast({
        title: '请设置价格后再设置分销金额',
        icon: 'none',
        duration: 1000
      })
    }
   
  },
  setfenxiao(id,req){
    var _this = this
    apiServer.post(`/app/activity/share/${id}`,req).then(res => {
      wx.showToast({
        title: '分销设置成功',
        icon: 'none',
        duration: 1000
      })
      _this.setData({
        show: false
      })
      _this.getOrgOrder()
    }).catch(err => {
   
    })
  },
  openfenxiao(id,req){
    var _this = this
    apiServer.post(`/app/activity/share/publish/${id}/1`).then(res => {
      
      _this.setfenxiao(id,req)
    }).catch(err => {
   
    })
  },
  fenxiaoSub(){
    console.log(this.data.nop)
    var req={
      "amount": 0,
      "amountFlg": 0,
      "rate": 0,
      "rateFlg": 0
    }
    if(this.data.nop == true){
      req.rateFlg = 1
      req.rate = this.data.baifenbi
    }else if(this.data.nop != -1 && this.data.nop == false){
      req.amountFlg = 1
      req.amount = this.data.shuzhi
    }else{
      wx.showToast({
        title: '请设置分销金额后再提交',
        icon: 'none',
        duration: 1000
      })
    }
    this.openfenxiao(this.data.activeId,req)
    console.log(req)
  },
  onClose: function () {
    this.setData({
      show: false
    });
  },
  closefenxiao(id){
    var _this = this
    apiServer.post(`/app/activity/share/publish/${id}/0`).then(res => {
      wx.showToast({
        title: '已关闭分销',
        icon: 'none',
        duration: 1000
      })
      _this.getOrgOrder()
    }).catch(err => {
   
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
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: '#fff'
    });
  },
  getOrgOrder() {
    var _this = this
    apiServer.post(`/app/my/org/index/activity/${this.data.status}`,'','get').then(res => {
      _this.setData({
        sponsorInfo: res.data.data.list
      })
    }).catch(err => {
    })
  },
  
  getOrderSelect(){
    var _this = this
    apiServer.post('/app/my/org/index/activity/status/select','','get').then(res => {
      _this.setData({
        'orderStatusSelectList': res.data.data.list,
        status: res.data.data.list[this.data.active].value
      })
      _this.getOrgOrder()
    }).catch(err=>{
      
    })
  },
  onShow: function () {
   
    this.setData({
      sponsorInfo: {},
      identity: wx.getStorageSync('identity') ? wx.getStorageSync('identity') : 1,
    })
    var _this = this
    this.renews()
  },
  renews: function () {
    this.setData({
      sponsorInfo: {},

    })
    var _this = this
    this.getOrderSelect()
    
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