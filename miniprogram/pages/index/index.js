// 主页
//index.js
const util = require('../../utils/util.js');
const apiServer = require('../../api/request.js');
//获取应用实例
const app = getApp()
Page({
  data: {
    //navbar
    // 导航头组件所需的参数
    nvabarData: {
      showCapsule: 0, //是否显示左上角图标   1表示显示    0表示不显示
      title: '首页', //导航栏 中间的标题
      white: true, // 是就显示白的，不是就显示黑的。
      address: '../../images/home_1@2x.png', // 加个背景 不加就是没有
      addressimg1: '../../images/home_1@2x.png', // 加个背景 不加就是没有
      addressimg2: '../../images/home_8@2x.png' // 加个背景 不加就是没有
    },
    // banner视频
    banner:{
      bannerVideoList:[],
      title:''
    },
    // 活动
    activityList: {
      activityList:[],
      selectList:[]
    },
    // 机构
    orgList: {
      orgList:[],
      selectList:[]
    },
    // 导航头的高度
    height: app.globalData.navheight,
    isIphoneX: app.globalData.isIphoneX,
    cmt: app.globalData.isIphoneX ? 27 : 22,
    onceToTop: false,
    scrollTop: 0,
    //tabbar
    tabbar: {},
    active: 0,
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    activeid: 0,    //正在播放的视频
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onplay(e){
    console.log(e)
  },
  toScan() {
    var _this = this
    wx.scanCode({
      success(res) {
        var data = JSON.parse(res.result)
        if(data.pathName == "核销"){
          _this.goToWriteOffOrder(data)
        }else{
          wx.showToast({
            title: '无法识别该二维码',
            icon: 'none',
            duration: 2000
          })
        }
      }
    })
  },
  videoPlay(){
    var activeId = wx.getStorageSync("index_activeVideo")
    this.setData({
      activeid: activeId
    })
  },
  videoParse() {
    wx.setStorageSync('index_activeVideo', this.data.activeid)
    this.setData({
      activeid: 10000
    })
  },
  goToVideoSwiper(e){

    var id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `../video-swiper/video-swiper?id=${id}&type=index`,
    })
  },
  goToWriteOffOrder(e) {
    var orderNo = e.orderNo
    wx.navigateTo({
      url: `../writeOffOrder/writeOffOrder?orderNo=${orderNo}`,
    })
  },
  goToActivityListSearch(e) {
    wx.navigateTo({
      url: `../activityListSearch/activityListSearch`,
    })
  },
  goToOrgListSearch() {
    wx.navigateTo({
      url: '../orgListSearch/orgListSearch',
    })
  },
  goToSearch() {
    wx.navigateTo({
      url: '../search/search',
    })
  },
  scrolltoupper(e){
    console.log(e)
  },
  scrollX(e){
    var activeid = this.data.activeid
    var left = e.detail.scrollLeft
    if (left>40){
      var newActive = parseInt((left - 40) / 140)+1
      if (activeid != newActive){
        this.setData({
          activeid: newActive
        })
      }
    }else{
      var newActive = 0
      if (activeid != newActive) {
        this.setData({
          activeid: newActive
        })
      }
    }
  },
  scrollY(e) {
    // 滚到上面后隐藏顶部背景
    if (e.detail.scrollTop > 100 && !this.data.onceToTop){
      this.setData({
        "nvabarData.address": this.data.nvabarData.addressimg2,
      })
      // "cmt": 1,
      // "onceToTop": true
      // this.setData({
      //   scrollTop: 0
      // })
    }else{
      this.setData({
        "nvabarData.address": this.data.nvabarData.addressimg1,
      })
    }
  },
  methods:{
  },
  activityClick(event) {
    var that = this;
    var select = this.data.activityList.selectList[event.detail.index].value
    apiServer.post(`/app/activity/list/index/select/${select}`).then(res => {
      console.log(res.data);
      that.setData({
        "activityList.activityList": res.data.data.list
      })
    })
  },
  orgListClick(event) {
    var that = this;
    var select = this.data.orgList.selectList[event.detail.index].value
    apiServer.post(`/app/org/list/index/select/${select}`).then(res => {
      console.log(res.data);
      that.setData({
        "orgList.orgList": res.data.data.list
      })
    })
  },
  comingTo(options){
    var data = {}
    var strs = decodeURIComponent(options.scene)
    var pages = getCurrentPages()
    var currentPage = pages[pages.length - 1]
  },
  onLoad: function (e) {
    this.comingTo(e)
    var that = this;
    wx.setStorageSync('index_activeVideo', 0)
    app.editTabbar();
    this.setData({
      tabbar: app.editTabbar()
    })
    wx.setStorageSync('activeVideo', 0)
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: '#fff'
    });
  },
  onShow: function () {
    wx.hideTabBar()
    var that = this;
    this.videoPlay()
    apiServer.post('/app/index/info2').then(res => {
      console.log(res.data);
      that.setData({
        banner: res.data.data.banner,
        activityList: res.data.data.activityList,
        orgList: res.data.data.orgList,
      })
    })
  },
  onHide(){
    this.videoParse()
    console.log(7878)
  }
})
