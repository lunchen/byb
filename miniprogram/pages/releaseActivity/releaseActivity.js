//releaseActivity.js
const util = require('../../utils/util.js')
//获取应用实例
const app = getApp()

Page({
  data: {
    //navbar
    // 导航头组件所需的参数
    nvabarData: {
      showCapsule: 1, //是否显示左上角图标   1表示显示    0表示不显示
      title: '发活动', //导航栏 中间的标题
      white: false, // 是就显示白的，不是就显示黑的。
      address: '', // 加个背景 不加就是没有
    },
    // 时间选择
    minHour: 10,
    maxHour: 20,
    minDate: new Date().getTime(),
    maxDate: new Date(2030, 10, 1).getTime(),
    currentDate: new Date().getTime(),
    show: false,
    time1: '',
    time2: '',
    picker:'',
    radio1: 0,
    radio2: "0",
    radio2Value: '',
    radio3: "0",
    radio3Value: '',
    // 导航头的高度
    height: app.globalData.navheight,
  },
  //事件处理函数
  goToSchoolHome: function() {
    wx.navigateTo({
      url: '../schoolHome/schoolHome'
    })
  },
  getTime: function (event) {
    var d = event.target.dataset.timename
    this.setData({
      show: true,
      picker: event.target.dataset.timename
    });
  },
  onClose: function () {
    this.setData({
      show: false
    });
  },
  confirm(event) {
    var _this = this;
    var time = util.formatDate(event.detail)
    this.setData({
      currentDate: event.detail,
      show: false,
      [_this.data.picker]: time
    });
    if (this.data.time1 && this.data.time2 && this.data.time1 > this.data.time2){
      time = this.data.time1
      this.setData({
        time1: this.data.time2,
        time2: time
      });
    }
  },
  inOrOut(event) {
  
    this.setData({
      radio1: event.target.dataset.io
    });
  },
  onRadio2Change(event) {
    this.setData({
      radio2: event.detail
    });
  },
  onRadio3Change(event) {
    this.setData({
      radio3: event.detail
    });
  },
  onLoad: function (e) {
    wx.setNavigationBarColor({
      frontColor: '#000000',
      backgroundColor: '#fff'
    });
    var that = this;
    let id = 1;
    if (!e.id) {
      wx.request({
        url: util.apiUrl(`/org/info/${id}`),
        method: 'post',
        data: {
        },
        header: {
          'content-type': 'application/json' // 默认值
        },
        success(res) {
          console.log(res.data)
          that.setData({
            schoolDetails: res.data.data,
          })
        }
      })
    }
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }
})
