// 线上体验编辑
const util = require('../../utils/util.js');
const apiServer = require('../../api/request.js');
//获取应用实例
const app = getApp()

Page({
  data: {
    //navbar
    navbarShow: true,
    // 导航头组件所需的参数
    nvabarData: {
      showCapsule: 1, //是否显示左上角图标   1表示显示    0表示不显示
      title: '线上体验编辑', //导航栏 中间的标题
      white: false, // 是就显示白的，不是就显示黑的。
      address: '' // 加个背景 不加就是没有
    },
    // 导航头的高度
    height: app.globalData.navheight,
    id: "",      //编辑的id 
    active: 0,
   
    firstkey: '',
    course:{},
    courseModel: {
      "activityId": '',
      "img": "",
      "imgList": [
        // {
        //   "id": '',
        //   "imgNo": "",
        //   "remark": "",
        //   "title": "",
        //   "type": 0,
        //   "url": ""
        // }
      ],
      "name": ""
    },
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  onBindfullscreenchange(e) {
    this.setData({
      navbarShow: !this.data.navbarShow
    })
  },
  bindGetUserInfo(e) {
    console.log(2)
  },
  delData(id) {
    var that = this;
    wx.showToast({
      title: '请稍后~',
      icon: 'loading',
      duration: 5000
    })
    if (id) {
      apiServer.post(`/app/org/update/index/online/experience/${id}`, '', "delete").then(res => {
        wx.showToast({
          title: '删除成功',
        })
        setTimeout(()=>{
          this.backHanel()
        },1000)
      })
    } else {
      wx.showToast({
        title: '删除成功',
      })
      setTimeout(() => {
        this.backHanel()
      }, 1000)
    }
  },
  deleteHandle1() {
    var that = this
    wx.showModal({
      title: '提示',
      content: '是否确认删除',
      cancelText: '取消',
      confirmText: '确定',
      success: function (res) {
        if (res.cancel) {
        } else if (res.confirm) {
          that.delData(that.data.id)
        }
      }
    })
  },
  backFn(e) {
    // 活动视频编辑后返回从storage获取单前编辑的新活动图片信息
    let getData = JSON.parse(wx.getStorageSync("addivList"));
    let prevData = getData.list;
    let prevkey = getData.key;
    this.setData({
      [`course.${prevkey}`]: prevData
    })
  },

  editVideoDesc: function (e) {
    // 跳转到视频编辑
    var firstkey = this.data.firstkey
    var index = e.currentTarget.dataset.index;
    var data = JSON.stringify({
      key: e.currentTarget.dataset.key,
      list: this.data.course[e.currentTarget.dataset.key]
    })
    wx.setStorageSync("addivList", data)
    wx.navigateTo({
      url: `../editVideoDesc/editVideoDesc`
    })
  },
  catchfn(){
    console.log(666)
  },
  onCoursenameChange(e){
    // 课程标题输入
    var index = e.currentTarget.dataset.index
    var value = e.detail
    this.setData({
      [`course.name`]: value,
    })
  },
  goToEditSchoolDetails(e) {
    wx.navigateTo({
      url: `../editSchoolDetails/editSchoolDetails`
    })
  },
  backHanel(){
    var pages = getCurrentPages(); // 当前页面
    var beforePage = pages[pages.length - 2]; // 前一个页面
    wx.navigateBack();
  },

  uploadTeacherLogo(e) {
    // 教师头像上传
    var that = this;
    util.uploadImg("teacherLogo").then(res => {
      that.setData({
        [`course.img`]: res.data.string
      })
    })
  },
  submit() {
    // 提交所有数据
    wx.showToast({
      title: '请稍后~',
      icon: 'loading',
      duration: 5000
    })
    var that = this
    var req = this.data.course
    apiServer.post(`/app/org/update/index/online/experience`,req).then(res => {
      wx.showToast({
        title: '资料提交成功',
      })
      setTimeout(()=>{
        this.backHanel()
      },1000)
    })
  },
  getData(id){
    var that = this;
    apiServer.post(`/app/org/update/index/online/experience/${id}`,'',"get").then(res => {
      that.setData({
        course: res.data.data,
      })
    })
  },
  onLoad: function (e) {
   
    wx.setNavigationBarColor({
      frontColor: '#000000',
      backgroundColor: '#fff'
    });
    let id = e ? e.id : '';
    this.setData({
      id: id
    })
    if(id){
      this.getData(id)
    }else{
      this.setData({
        course: this.data.courseModel
      })
    }
  },
  getUserInfo: function(e) {
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
})
