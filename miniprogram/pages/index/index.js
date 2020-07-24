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
      backreload: false,
      showCapsule: 0, //是否显示左上角图标   1表示显示    0表示不显示
      title: '首页', //导航栏 中间的标题
      white: true, // 是就显示白的，不是就显示黑的。
      address: '../../images/home_1@2x.png', // 加个背景 不加就是没有
      
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
    activityListIndex: 0,
    // 机构
    orgList: {
      orgList:[],
      selectList:[]
    },
    indexAdvertList:[],
    orgListIndex:0,
    // 导航头的高度
    height: app.globalData.navheight,
    isIphoneX: app.globalData.isIphoneX,
    cmt: app.globalData.isIphoneX ? 5 : 2,
    onceToTop: false,
    scrollTop: 0,
    //tabbar
    tabbar: {},
    active: 0,
    motto: 'Hello World',
    showlocation: false,
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    activeid: 0,    //正在播放的视频0
    identity: wx.getStorageSync('identity') ? wx.getStorageSync('identity') : 1, //1参与方 2主办方
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
          // _this.goToWriteOffOrder(data)
          _this.getScanOrderData(data)
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
  getScanOrderData(e){
    var _this = this
    var orderNo = e.orderNo
    apiServer.post(`/app/order/info/qrCode/${orderNo}`).then(res => {
      wx.setStorageSync("scanData", JSON.stringify(res.data.data))
      _this.goToWriteOffOrder(e)
    }).catch(err=>{
      wx.showToast({
        title: err.data.msg,
        icon: 'none',
        duration: 2000
      })
    })
  },
  videoParse() {
    wx.setStorageSync('index_activeVideo', this.data.activeid)
    this.setData({
      activeid: 10000
    })
  },
  goToPage(e) {
    var type = e.currentTarget.dataset.type   //1原图放大 2打开h5  3小程序内部页面  4其他图放大
    var uri = e.currentTarget.dataset.uri
    var code = e.currentTarget.dataset.code
    console.log(uri)
    console.log(type)
    if (type == 2) {
      wx.navigateTo({
        url: `/pages/h5v/h5v?id=${uri}`,
      })
    }
    if(type ==3){
      wx.navigateTo({
        url: `${code}`,
      })
    }
    if (type == 4) {
      var imgArr = [uri];
      wx.previewImage({
        current: imgArr[0],     //当前图片地址
        urls: imgArr,               //所有要预览的图片的地址集合 数组形式
        success: function (res) { },
        fail: function (res) { },
        complete: function (res) { },
      })
    }
  },
  goToVideoSwiper(e) {

    var id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `../myVideoSwiper/myVideoSwiper?id=${id}&type=index`,
    })
  },
  goToVideoTop(e) {

    var id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `../videoTop/videoTop?id=${id}&type=index`,
    })
  },
  goToVideoFull(e) {

    var id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `../videoFull/videoFull?id=${id}&type=index`,
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
    // if (e.detail.scrollTop > 100 && !this.data.onceToTop){
    //   this.setData({
    //     "nvabarData.address": this.data.nvabarData.addressimg2,
    //   })
    //   // "cmt": 1,
    //   // "onceToTop": true
    //   // this.setData({
    //   //   scrollTop: 0
    //   // })
    // }else{
    //   this.setData({
    //     "nvabarData.address": this.data.nvabarData.addressimg1,
    //   })
    // }
  },
  methods:{
  },
  activityClick(event) {
    var that = this;
    if (event && event.detail.index>=0){
      that.setData({
        "activityListIndex": event.detail.index
      })
    }
    var select = this.data.activityList.selectList[this.data.activityListIndex].value
    apiServer.post(`/app/activity/list/index/select/${select}`).then(res => {
      that.setData({
        "activityList.activityList": []
      })
      setTimeout(()=>{
        that.setData({
          "activityList.activityList": res.data.data.list
        },10000)
      })
    })
  },
  orgListClick(event) {
    var that = this;
    if (event && event.detail.index >= 0) {
      that.setData({
        "orgListIndex": event.detail.index
      })
    }
    var select = this.data.orgList.selectList[this.data.orgListIndex].value
    if (event && event.detail.title == "附近机构"){
      that.setData({
        showlocation: true
      })
      that.getUserLocation().then((res)=>{
        apiServer.nowLocation.getLocation()
        setTimeout(()=>{
          that.getSelect(select)
        },100)
        
      })
    }else{
      that.setData({
        showlocation: false
      })
      this.getSelect(select)
    }
   
  },
  getSelect(select){
    var that = this
    apiServer.post(`/app/org/list/index/select/${select}`).then(res => {
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
    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline']
    })
    // 绑定分享参数
  console.log('aaa')
  console.log(e)
    // this.comingTo(e)
    var that = this;
    wx.setStorageSync('index_activeVideo', 0)
    wx.setStorageSync('activeVideo', 0)
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: '#fff'
    });
   
    that.getUserLocation()
  },
  onShow: function () {

    this.setData({
      tabbar: app.editTabbar()
    })
    var that = this;
    this.setData({
      identity: wx.getStorageSync('identity') ? wx.getStorageSync('identity') : 1
    })
    wx.hideTabBar()
    var that = this;
    apiServer.post('/app/index/info2').then(res => {
      that.setData({
        banner: res.data.data.banner,
        'activityList.selectList': res.data.data.activityList.selectList,
        'orgList.selectList': res.data.data.orgList.selectList,
        'indexAdvertList': res.data.data.indexAdvertList,
      })
      that.orgListClick() 
      that.activityClick()
    }) 

  },
  onHide(){
    this.videoParse()
  },
  // 判断用户是否拒绝地理位置信息授权，拒绝的话重新请求授权
  getUserLocation: function (qqmapsdk) {
    let that = this;
    return new Promise((resolve,reject)=>{
      wx.getSetting({
        success: (res) => {
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
                        resolve()
                        that.getLocation();
                      } else {
                        wx.showToast({
                          title: '授权失败',
                          icon: 'none',
                          duration: 1000
                        })
                        reject()
                      }
                    }
                  })
                }
              }
            })
          } else if (res.authSetting['scope.userLocation'] == undefined) {
            //调用wx.getLocation的API
            resolve()

            that.getLocation();
          }
          else {
            resolve()
            //调用wx.getLocation的API
            that.getLocation();
          }
        }
      })
    })
    
  },
  // 获取定位当前位置的经纬度
  getLocation: function () {
    //逆地址解析
    let that = this;
    //定位
    wx.getLocation({
      type: 'wgs84',
      success(res) {
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
      title: '报1 报',
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
  //用户点击右上角分享朋友圈
	onShareTimeline: function () {
		return {
	      title: '报1 报',
	      query: {
	        id: 666
	      },
	      imageUrl: ''
	    }
	},
})
