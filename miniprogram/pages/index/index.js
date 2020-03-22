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
    bannerList:[
     
    ],
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
    cmt: app.globalData.isIphoneX ? 20 : 22,
    onceToTop: false,
    scrollTop: 0,
    //tabbar
    tabbar: {},
    active: 0,
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  toScan() {
    wx.scanCode({
      success(res) {
        console.log(res)
      }
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
  scrollY(e) {
    // 滚到上面后隐藏顶部背景
    if (e.detail.scrollTop > 74 && !this.data.onceToTop){
      this.setData({
        "nvabarData.address": this.data.nvabarData.addressimg2,
        "cmt": 1,
        "onceToTop": true
      })
      this.setData({
        scrollTop: 0
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
  onShow: function () {
    wx.hideTabBar()
  },
  onLoad: function () {
    var that = this;
    app.editTabbar();
    this.setData({
      tabbar: app.editTabbar()
    })

    apiServer.post('/app/index/info2').then(res=>{
      console.log(res.data);
      that.setData({
        bannerList: res.data.data.banner,
        activityList: res.data.data.activityList,
        orgList: res.data.data.orgList,
      })
    })

    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: '#fff'
    });
    
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
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
