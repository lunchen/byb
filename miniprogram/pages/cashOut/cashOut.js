// cash-out.js
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
      title: '提现申请', //导航栏 中间的标题
      white: '', // 是就显示白的，不是就显示黑的。
      address: '', // 加个背景 不加就是没有
    },
    // 时间选择
    value: '',
    minHour: 10,
    maxHour: 20,
    minDate: new Date(1960, 1, 1).getTime(),
    maxDate: new Date(2030, 12, 12).getTime(),
    currentDate: new Date().getTime(),
    show: false,
    time1: '',
    time2: '',
    picker: '',
    formatter(type, value) {
      if (type === 'year') {
        return `${value}年`;
      } else if (type === 'month') {
        return `${value}月`;
      }
      return value;
    },
    // 导航头的高度
    height: app.globalData.navheight,
    isIphoneX: app.globalData.isIphoneX,
    cmt: app.globalData.isIphoneX ? 20 : 24,
    req: {
      name: '',
      bankCard: '',
      idCard: '',
      outCash:'',
    },
    price:''
  },
  methods:{
  },
  nameIpt(e) {
    this.setData({
      "req.name": e.detail.value
    })
  },
  bankCardIpt(e) {
    this.setData({
      "req.bankCard": e.detail.value
    })
  },
  idCardIpt(e) {
    this.setData({
      "req.idCard": e.detail.value
    })
  },
  outCashIpt(e) {
    this.setData({
      "req.outCash": e.detail.value
    })
  },
  subConfim(){
    if (typeof this.data.req.name == '') {
      wx.showToast({
        title: '请输入开卡人姓名',
        icon: 'none',
        duration: 1000
      })
      return
    }
    if (typeof this.data.req.bankCard == '') {
      wx.showToast({
        title: '请输入银行卡号',
        icon: 'none',
        duration: 1000
      })
      return
    }
    if (typeof this.data.req.idCard == '') {
      wx.showToast({
        title: '请输入身份证号',
        icon: 'none',
        duration: 1000
      })
      return
    }
    
    var _this = this
    wx.showModal({
      title: '警告！',
      content: '请确认提交申请信息正确无误！',
      success: function (res) {
        if (res.cancel) {
        } else if (res.confirm) {
          _this.sub()
        }
      }
    })
  },
  suoha(){
    this.setData({
      "req.outCash": this.data.price
    })
  },
  sub(){
    var _this = this;
    var req = {
      "bankcard": this.data.req.bankCard,
      "idcard": this.data.req.idCard,
      "name": this.data.req.name,
      "price": this.data.req.outCash
    }
    apiServer.post('/app/my/org/cash/out/apply', req).then(res => {
      wx.showToast({
        title: '提现申请提交成功！',
        icon: 'none',
        duration: 1000
      })
      _this.getData()
    })

  },
  onLoad: function (options) {

    var _this = this;
    wx.setNavigationBarColor({
      frontColor: '#000000',
      backgroundColor: '#fff'
    });
    this.getData()
  },
  getData(){
    var _this = this;
    apiServer.post('/app/my/org/cash/out/apply/info').then(res => {
      _this.setData({
        "req.name": res.data.data.name,
        "req.bankCard": res.data.data.bankcard,
        "req.idCard": res.data.data.idcard,
        "price": res.data.data.price,
      })
    })
  },
  onReady: function () {

  },
  onShow: function () {

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