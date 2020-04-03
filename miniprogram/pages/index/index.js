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
    activeid: 0,    //正在播放的视频0
    qqmapsdk1: "W57BZ-JDB6X-XPA4H-Z76MI-73FF2-24BT4",
    qqmapsdk: "XIFBZ-MFRC3-LL73N-YT4ZG-ZIPJ6-YZBCG",
    myLocation: "定位中"
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
   
    that.getUserLocation()
  },
  onShow: function () {
    var that = this;

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
  },
  // 判断用户是否拒绝地理位置信息授权，拒绝的话重新请求授权
  getUserLocation: function (qqmapsdk) {
    console.log(qqmapsdk)
    let that = this;
    wx.getSetting({
      success: (res) => {
        console.log(JSON.stringify(res))
        // res.authSetting['scope.userLocation'] == undefined    表示 初始化进入该页面
        // res.authSetting['scope.userLocation'] == false    表示 非初始化进入该页面,且未授权
        // res.authSetting['scope.userLocation'] == true    表示 地理位置授权
        if (res.authSetting['scope.userLocation'] != undefined && res.authSetting['scope.userLocation'] != true) {
          wx.showModal({
            title: '请求授权当前位置',
            content: '需要获取您的地理位置，请确认授权',
            success: function (res) {
              if (res.cancel) {
                wx.showToast({
                  title: '拒绝授权',
                  icon: 'none',
                  duration: 1000
                })
              } else if (res.confirm) {
                wx.openSetting({
                  success: function (dataAu) {
                    if (dataAu.authSetting["scope.userLocation"] == true) {
                      wx.showToast({
                        title: '授权成功',
                        icon: 'success',
                        duration: 1000
                      })
                      //再次授权，调用wx.getLocation的API
                      that.getLocation();
                    } else {
                      wx.showToast({
                        title: '授权失败',
                        icon: 'none',
                        duration: 1000
                      })
                    }
                  }
                })
              }
            }
          })
        } else if (res.authSetting['scope.userLocation'] == undefined) {
          //调用wx.getLocation的API
          that.getLocation();
        }
        else {
          //调用wx.getLocation的API
          that.getLocation();
        }
      }
    })
  },
  // 获取定位当前位置的经纬度
  getLocation: function () {
    //你地址解析
    let that = this;
    //定位
    wx.getLocation({
      type: 'wgs84',
      success(res) {
        console.log(res)
        const latitude = res.latitude
        const longitude = res.longitude
        const speed = res.speed
        const accuracy = res.accuracy
        wx.request({
          url: `https://apis.map.qq.com/ws/geocoder/v1/?location=${latitude},${longitude}&key=${that.data.qqmapsdk}`,
          success: function (result) {
            console.log(result)
            // console.log(result.data.result.address_component.city)
            that.setData({
              myLocation: result.data.result.address_component.city
            })
          }
        })
        
      },
      fail(err) {
        //console.log(err)
        wx.hideLoading({});
        wx.showToast({
          title: '定位失败',
          icon: 'none',
          duration: 1500
        })
      }
    })
  },
  onShareAppMessage: function (ops) {
    var json = encodeURIComponent(JSON.stringify({ a: 1 }));
    if (ops.from === 'button') {
      // 来自页面内转发按钮
      console.log(ops.target)
    }
    return {
      title: '报一报',
      path: '/pages/index/index',
      imageUrl: "",
      success: function (res) {
        // 转发成功
        console.log("转发成功:" + JSON.stringify(res));

      },
      fail: function (res) {
        // 转发失败
        console.log("转发失败:" + JSON.stringify(res));
      }
    }

  },
})
