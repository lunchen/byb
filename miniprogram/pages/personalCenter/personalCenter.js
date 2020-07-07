// 个人中心编辑
// personalCenter.js
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
      logoutShow: false
    },
    gender: 1, //1男 2 女
    nameValue: "",
    birthValue: "",
    storeAddress: "",   //地图页直接设好数据 将需要的地址数据设置到setAddress
    participantInfo:'',
    req: {
      "addr": {
        "addr": "",
        "city": "",
        "district": "",
        "id": 0,
        "latitude": 0,
        "longitude": 0,
        "name": "",
        "place": "",
        "placeNo": "",
        "province": ""
      },
      "birthday": "",
      "heardImg": "",
      "nickName": "",
      "sex": '',
      "sexName": "",
      "userNo": ""
    }
  },
  methods:{
  },
  getInfo() {
    var _this = this;
    apiServer.post('/app/user/info').then(res => {
      _this.setData({
        participantInfo: res.data.data
      })
    })
  },
  updataInfo() {
    var _this = this;
    var req = this.data.participantInfo
    if(req.addr == ""){
      req.addr = {}
    }
    apiServer.post('/app/user/update', req).then(res => {
      console.log("user");
      _this.getInfo()
    })
  },
  uploadTeacherLogo(e) {
    // 教师头像上传
    var index = e.currentTarget.dataset.index;
    var that = this;
    wx.chooseImage({
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success(res) {
        let src = res.tempFiles[0];
        wx.uploadFile({
          url: apiServer.apiUrl(`/picture/upload/userIcon`),
          method: 'post',
          filePath: src.path,
          name: 'file',
          file: src,
          data: {},
          header: {
            'content-type': 'application/json',
            "Authorization": apiServer.getToken("authorization"),
            "token": apiServer.getToken("token"),
            "appRole": apiServer.getIdentity(),
          },
          success(res) {
            var data = JSON.parse(res.data)
            that.setData({
              [`participantInfo.heardImg`]: data.data.string
            });
            that.updataInfo()
          }
        })
      }
    })
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
    this.setData({
      [`participantInfo.addr.addr`]: address.addr,
      [`participantInfo.addr.longitude`]: address.longitude,
      [`participantInfo.addr.latitude`]: address.latitude,
      [`participantInfo.addr.name`]: address.title,
      [`participantInfo.addr.province`]: address.province,
      [`participantInfo.addr.city`]: address.city,
      [`participantInfo.addr.district`]: address.district,
      [`participantInfo.addr.place`]: address.province + address.city + address.district
    })
    this.updataInfo()
  },
  confirm(event) {
    var time = util.formatDate(event.detail,"yyyy-mm-dd");
    this.setData({
      "showList.nameShow": false,
      "participantInfo.birthday": time
    })
    this.onCloseAll()
    this.updataInfo()
    // 时间选择确定
  },
  onNameValueChange(e){
    this.setData({
      nameValue: e.detail
    })
  },
  confirmName(){
    this.setData({
      "showList.nameShow": false,
      "participantInfo.nickName": this.data.nameValue
    })
    this.updataInfo()
  },
  confirmGenderHandle(){
    this.setData({
      "showList.genderShow": false,
      "participantInfo.sex": this.data.gender,
      "participantInfo.sexName": this.data.gender==1?"男":"女"
    })
    this.updataInfo()
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
    this.setData({
      gender: sex
    })
  },
  openHandle(e) {
    var key = e.currentTarget.dataset.key
    // 打开弹窗 还有赋值操作
    this.setData({
      ["showList." + key]: true,
      gender: this.data.req.sex,

    })
  },
  chooseGenderHandle(){
    // 调接口
    this.setData({
      "showList.genderShow": false
    })
  },
  onCloseAll(){
    this.setData({ 
      "showList.genderShow": false,
      "showList.nameShow": false,
      "showList.birthShow": false,
      "showList.logoutShow": false
    });

  },
  openLogout(){
    // this.setData({
    //   "showList.logoutShow": true
    // })
    var _this = this
    wx.showModal({
      title: '请选择',
      content: '是否确认退出',
      success: function (res) {
        if (res.cancel) {
        } else if (res.confirm) {
          _this.logout()
        }
      }
    })
  },
  logout(){
    console.log("退出");
    var _this = this;
    wx.clearStorageSync()
    this.onCloseAll();
    this.setData({
      participantInfo: this.data.req
    })
    wx.showToast({
      title: '退出成功',
      icon: 'none',
      duration: 1000
    })
    setTimeout(()=>{
      _this.goToMine()
    },500)
  },
  goToMine(e) {
    wx.switchTab({
      url: `../mine/mine`,
    })
  },
  onLoad: function (options) {

    var _this = this;
    wx.setNavigationBarColor({
      frontColor: '#000000',
      backgroundColor: '#fff'
    });
    this.getInfo()
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