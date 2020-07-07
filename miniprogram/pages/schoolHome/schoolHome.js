// 学校主页
//schoolHome.js
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
      backreload: true, // 该页面返回的上一个页面是否刷新
      showCapsule: 1, //是否显示左上角图标   1表示显示    0表示不显示
      title: '学校主页', //导航栏 中间的标题
      white: false, // 是就显示白的，不是就显示黑的。
      address: '../../images/home_8@2x.png' // 加个背景 不加就是没有
    },
    // 导航头的高度
    height: app.globalData.navheight,
    cmt: app.globalData.cmt,

    swiperWidth: wx.getSystemInfoSync().windowWidth,
    background: ['demo-text-1', 'demo-text-2', 'demo-text-3'],
    signUpType: false,  //确定是免费true 还是花费false 
    loginShow: 0,   //打开报名弹窗参数
    // 视频
    indicatorDots: true,
    vertical: false,
    autoplay: false,
    interval: 2000,
    duration: 500,
    indicatorColor: "#bbb",
    indicatorActiveColor: "#fff",
    current: 0,
    // 地图标记
    longitudeCenter: 113.324520,
    latitudeCenter: 23.099994,
    markers: [{
      iconPath: "../../images/marker@2x.png",
      id: 0,
      latitude: 23.099994,
      longitude: 113.324520,
      width: 20,
      height: 26,
      label: {
        content: '',  //文本
        color: '#FF0202',  //文本颜色
        borderRadius: 3,  //边框圆角
        borderWidth: 1,  //边框宽度
        borderColor: '#FF0202',  //边框颜色
        bgColor: '#ffffff',  //背景色
        padding: 5,  //文本边缘留白
        textAlign: 'center'  //文本对齐方式。有效值: left, right, center
      }
    }],
    // 划线
    polyline: [{
      points: [{
        longitude: 113.3245211,
        latitude: 23.10229
      }, {
        longitude: 113.324520,
        latitude: 23.21229
      }],
      color: "#000000",
      width: 2,
      dottedLine: true
    }],
    showEditBtn: false,   //是否显示学校编辑按钮
    schoolHomeData: {},
    activeid: 0,
    identity: wx.getStorageSync('identity') ? wx.getStorageSync('identity') : 1,       //1参与方 2主办方
    id:'',
    activityListData:'',
    windowWidth: wx.getSystemInfoSync().windowWidth,
    canvasImgShow: false,
    canvasImg:'',
    firstPage: false,
    canIUseSaveImg: ''
  },
  
  previewImage: function (e) {
    console.log(e)
    var imgArr = [this.data.canvasImg];
    wx.previewImage({
      current: imgArr[0],     //当前图片地址
      urls: imgArr,               //所有要预览的图片的地址集合 数组形式
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  closeCanvasImgShow(){
    this.setData({
      canvasImgShow: false
    })
  },
  // 滑块
  swiperChange(e) {
    var that = this;
    var current = e.detail.current
    if (e.detail.source == 'touch') {
      // wx.createVideoContext('myVideo' + that.data.current).stop()
      that.setData({
        current: e.detail.current,
        activeid: that.data.schoolHomeData.orgBannerList[e.detail.current].id
      })

      that.getActivityDetailsData(that.data.schoolHomeData.orgBannerList[this.data.current].id)
    }
  }, 
  // 地图
  regionchange(e) {
    console.log(e.type)
  },
  markertap(e) {
    console.log(e.markerId)
  },

  videoErrorCallback: function (e) {
    console.log('视频错误信息:' + e.detail.errMsg);
  },
  goToBusiness(e) {
    wx.navigateTo({
      url: `../business/business`,
    })
  },
  goToVideoTop(e) {
    var id = e.currentTarget.dataset.id
    var index = e.currentTarget.dataset.index
    wx.navigateTo({
      url: `../videoTop/videoTop?id=${id}&type=course&index=${index}`,
    })
  },
  goToVideoSwiper(e) {
    var id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `../myVideoSwiper/myVideoSwiper?id=${id}&type=course`,
    })
  },
  goToVideoFull(e) {
    var id = e.currentTarget.dataset.id
    var index = e.currentTarget.dataset.index
    wx.navigateTo({
      url: `../videoFull/videoFull?id=${id}&type=course&index=${index}`,
    })
  },
  goToActivityDetails: function (e) {
    var id = e.currentTarget.dataset.id
    
    wx.navigateTo({
      url: `../activityDetails/activityDetails?id=${id}`
    })
  },
  goToSchoolDetails: function(e) {
    var id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `../schoolDetails/schoolDetails?id=${id}`
    })
  },
  goToEditSchoolDetails(e) {
    wx.navigateTo({
      url: `../editSchoolDetails/editSchoolDetails`
    })
  },
  changeSignUpType: function (e) {
    // 底部按钮 true 为免费预约 false 花费
    this.setData({
      signUpType: e.detail.signUpType
    })
  },
  changeFLogin: function (e) {
    // 获取从底部打开报名弹窗
    this.setData({
      loginShow: e.detail.loginShow
    })
  },
  getActivityDetailsData(activityId) {
    var that = this;
    if (activityId){
      apiServer.post(`/app/activity/info/${activityId}`).then(res => {
        that.setData({
          "activityListData": res.data.data
        })
      })
    }
  },
  getData(id) {
    var that = this;
    apiServer.post(`/app/org/index/${id}`).then(res => {
      wx.setStorageSync("aliveData", JSON.stringify(res.data.data))
      if (res.data.data.orgBannerList[0]) {
        that.setData({
          activeid: res.data.data.orgBannerList[0].id,
        })
        that.getActivityDetailsData(res.data.data.orgBannerList[this.data.current].id)
      }
      that.setData({
        schoolHomeData: res.data.data,
        markers: [{
          iconPath: "../../images/marker@2x.png",
          id: 0,
          latitude: res.data.data.addr.latitude,
          longitude: res.data.data.addr.longitude,
          width: 20,
          height: 26,
        }],
        latitudeCenter: res.data.data.addr.latitude,
        longitudeCenter: res.data.data.addr.longitude
      })
    })
  },
  onLoad: function (e) {
    var that = this
    let pages = getCurrentPages(); //获取当前页面js里面的pages里的所有信息。
    const currentPage = pages[pages.length - 1]
    if (pages.length == 1){
      this.setData({
        firstPage: true
      })
    }
    console.log(e)
    wx.setStorageSync('schoolHome_activeVideo', 0)
    wx.setNavigationBarColor({
      frontColor: '#000000',
      backgroundColor: '#fff'
    });

    this.setData({
      mapCtx : wx.createMapContext('myMap')
    })
    let id = e ? e.id : '';
    if(e){
      if (e.scene) {
        console.log('scene')
        console.log(e)
        var strs = decodeURIComponent(e.scene)
        id = strs.split("=")[1]
      }
    }else{
      id = wx.getStorageSync('schoolHomeId')
    }
    wx.setStorageSync('schoolHomeId', id)

    if(id){
      this.setData({
        id: id
      })
    }

    // 直接打开预约
    if (e && e.open == 3) {
      this.setData({
        loginShow: 3,
        signUpType: true
      })
    }
    // 判断是否自己的机构
    var token = wx.getStorageSync("token") ? JSON.parse(wx.getStorageSync("token")).token : '';
    var identity = wx.getStorageSync('identity') ? wx.getStorageSync('identity') : 1;
    if (token && identity==2) {
      var sponsorId
      if (wx.getStorageSync("myOrgMes")) {
        sponsorId = JSON.parse(wx.getStorageSync("myOrgMes")).org.id;
        if (e && e.id == sponsorId){
          that.setData({
            showEditBtn : true
          })
        }
      } else {
        apiServer.post('/app/my/org/index').then(res => {
          app.globalData.orgMes = res.data.data;
          sponsorId = res.data.data.org.id
          if (e && e.id == sponsorId) {
            that.setData({
              showEditBtn: true
            })
          }
        })
      }
      
    }
  },
  onReady: function () {
  },
  onBindfullscreenchange(e) {
    this.setData({
      navbarShow: !this.data.navbarShow
    })
  },
  videoPlay() {
    // 页面返回时自动部分上一次播放视频
    var activeId = wx.getStorageSync("schoolHome_activeVideo") ? wx.getStorageSync("schoolHome_activeVideo"):0
    this.setData({
      activeid: activeId
    })
  },
  videoParse() {
    wx.setStorageSync('schoolHome_activeVideo', this.data.activeid)
    this.setData({
      activeid: 10000
    })
  },
  onShow() {

    this.videoPlay()
    if (this.data.id) {
      this.getData(this.data.id)
    }
  },
  onHide() {
    this.videoParse()
  },
  imgLoaded(e) {
    this.setData({
      imageHeight: e.detail.height,
      imageWidth: e.detail.width
    })
  },
  // 生成朋友圈图片
  shareFriend(){
    this.getPoster()
  },
  getPoster() {
    var _this = this
    wx.showToast({
      title: '图片生成中~',
      icon: 'loading',
      duration: 2000
    })
    apiServer.post(`/app/org/poster/${this.data.id}`, '', 'get').then(res => {
      wx.showToast({
        icon: 'none',
        duration: 1
      })
      this.setData({
        canvasImg: res.data.data.string,
        canvasImgShow: true,
        shareShow: false
      })
    })
  },

  // 保存图片
  async saveToPhoto() {

    var _this = this

    wx.showToast({
      title: '图片下载中~',
      icon: 'loading',
      duration: 50000
    });
    var url = await util._getLocalSrc(this.data.canvasImg)
    _this.setData({
      downloadUrl: url,
    })
    wx.getSetting({
      success: (res) => {
        console.log(res)
        if (res.authSetting['scope.writePhotosAlbum'] == false) {
          // 已经拒绝重新唤起
          _this.setData({
            canIUseSaveImg: false,
          })
          wx.showToast({
            title: "保存图片需要您的授权哦,请点击授权后再保存图片~",
            icon: "none"
          });
          console.log("已经拒绝重新唤起")
        } else if (!res.authSetting['scope.writePhotosAlbum']) {
          wx.authorize({
            scope: "scope.writePhotosAlbum",
            success() {
              wx.showToast({
                title: "授权成功~",
                icon: "none"
              });

              wx.saveImageToPhotosAlbum({
                filePath: _this.data.downloadUrl,
                success(res) {
                  wx.showToast({
                    title: "保存成功~",
                    icon: "none"
                  });
                }
              })
            },
            fail(e) {
              wx.showToast({
                title: "保存需要您的授权哦~",
                icon: "none"
              });

              _this.setData({
                canIUseSaveImg: false,
              })
            }
          });
        } else {
          wx.saveImageToPhotosAlbum({
            filePath: _this.data.downloadUrl,
            success(res) {
              wx.showToast({
                title: "保存成功~",
                icon: "none"
              });
            }
          })
        }
      }
    })

  },
  // 弹出授权设置
  openSetting(e) {
    var _this = this
    console.log("唤起中")
    console.log(e)
    if (e.detail.authSetting["scope.writePhotosAlbum"] == true) {
      wx.showToast({
        title: '授权成功',
        icon: 'success',
        duration: 1000
      })
      this.setData({
        canIUseSaveImg: true,
      })
    } else {
      wx.showToast({
        title: '授权失败',
        icon: 'none',
        duration: 1000
      })
    }
  },
  onShareAppMessage: function (ops) {
    var json = encodeURIComponent(JSON.stringify({ a: 1 }));
    if (ops.from === 'button') {
      // 来自页面内转发按钮
      console.log(ops.target)
    }
    return {
      title: '报1 报',
      path: '/pages/schoolHome/schoolHome?id=' + this.data.id,
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
