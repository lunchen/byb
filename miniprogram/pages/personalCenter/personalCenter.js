// 个人中心编辑
// personalCenter.js
const util = require('../../utils/util.js')
//获取应用实例
const app = getApp()
Page({
  data: {
    //navbar
    // 导航头组件所需的参数
    nvabarData: {
      showCapsule: 1, //是否显示左上角图标   1表示显示    0表示不显示
      title: '个人中心', //导航栏 中间的标题
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
    areaList:'',
    showList: {
      nameShow: false,
      genderShow: false,
      birthShow: false,
    },
    gender: 1, //1男 0 女
    nameValue: "",
    birthValue: "",
    storeAddress: ""   //地图页直接设好数据 将需要的地址数据设置到setAddress
  },
  methods:{
  },
  toMap() {
    var index = this.data.viewIndex
    wx.navigateTo({
      url: `../../pages/shopMap/shopMap?index=${index}`
    })
  },
  setAddress(e) {
    console.log(e)
    var index = e.index
    var address = e.storeAddress
    // 地图页返回并执行的方法
    
  },
  confirm(event) {
    var time = util.formatDate(event.detail,"yyyy-mm-dd");
      console.log(time)
    // 时间选择确定
  },
  onNameValueChange(e){
    this.setData({
      nameValue: e.detail
    })
  },
  confirmName(){
    this.setData({
      "showList.nameShow": false
    })
  },
  checkShow(e){
    var key = e.detail.showTrueList[0]
    var _this = this
    this.setData({
      ["showList." + key]:false
    })
  },
  showPopup() {
    this.setData({ show: true });
  },
  chooseGender(e){
    // 选择性别按钮
    var sex = e.currentTarget.dataset.gender
    console.log(e)
    this.setData({
      gender: sex
    })
  },
  openHandle(e) {
    var key = e.currentTarget.dataset.key
    // 打开弹窗 还有赋值操作
    this.setData({
      ["showList." + key]: true
    })
  },
  chooseGenderHandle(){
    // 调接口
    this.setData({
      "showList.genderShow": false
    })
  },
  onCloseGender() {
    this.setData({ "showList.genderShow": false });
  },
  onCloseUsername() {
    this.setData({ "showList.nameShow": false });
  },
  onCloseBirth() {
    this.setData({ "showList.birthShow": false });
  },
  loginOut(){
    console.log("退出");
  },
  onLoad: function (options) {

    var _this = this;
    wx.setNavigationBarColor({
      frontColor: '#000000',
      backgroundColor: '#fff'
    });

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
  onShareAppMessage: function () {

  }
})