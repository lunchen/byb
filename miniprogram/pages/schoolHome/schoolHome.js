// 学校主页
//schoolHome.js
const util = require('../../utils/util.js');
const apiServer = require('../../api/request.js');
//获取应用实例
const app = getApp()

Page({
  data: {
    //navbar
    // 导航头组件所需的参数
    nvabarData: {
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
      height: 26
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
    activeid:0
  },
  // 滑块
  swiperChange(e) {
    var _this = this;
    if (e.detail.source == 'touch') {
      wx.createVideoContext('myVideo' + _this.data.current).stop()
      _this.setData({
        current: e.detail.current,
        activeid: e.detail.current
      })
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
  goToSchoolDetails: function(e) {
    var id = e.currentTarget.dataset.id
    util.setId(id)
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
  onLoad: function (e) {

    wx.setStorageSync('schoolHome_activeVideo', 0)
    wx.setNavigationBarColor({
      frontColor: '#000000',
      backgroundColor: '#fff'
    });
    var _this = this;
    let id = e.id ? e.id : 1;
    if (id) {
      console.log(id)
      apiServer.post(`/app/org/index/${id}`).then(res => {
        console.log(res.data);
        wx.setStorageSync("aliveData", JSON.stringify(res.data.data))
        _this.setData({
          schoolHomeData: res.data.data,
          markers: [{
            iconPath: "../../images/marker@2x.png",
            id: 0,
            latitude: res.data.data.addr.latitude,
            longitude: res.data.data.addr.longitude,
            width: 20,
            height: 26
          }],
          latitudeCenter: res.data.data.addr.latitude,
          longitudeCenter: res.data.data.addr.longitude
        })
      })
    }
    var token = wx.getStorageSync("token") ? JSON.parse(wx.getStorageSync("token")).token : '';
    console.log(token)
    if(token) {
      var sponsorId
      if (app.globalData.orgMes) {
        sponsorId = app.globalData.orgMes.org.id;
        if (e.id == sponsorId){
          _this.setData({
            showEditBtn : true
          })
        }
      } else {
        apiServer.post('/app/my/org/index').then(res => {
          console.log("org");
          console.log(res.data);
          app.globalData.orgMes = res.data.data;
          sponsorId = res.data.data.org.id
          if (e.id == sponsorId) {
            _this.setData({
              showEditBtn: true
            })
          }
        })
      }
      
    }
  },
  onReady: function () {
    // wx.createVideoContext('myVideo' + 0).play();
  },
  asd(){
    var _this = this
    wx.downloadFile({
      url: app.globalData.userInfo.avatarUrl,
      success: function (res1) {

        //缓存头像图片
        _this.setData({
          portrait_temp: res1.tempFilePath
        })
        //缓存canvas绘制小程序二维码
        wx.downloadFile({
          url: _this.data.qrcode,
          success: function (res2) {
            console.log('二维码：' + res2.tempFilePath)
            //缓存二维码
            _this.setData({
              qrcode_temp: res2.tempFilePath
            })
            console.log('开始绘制图片')
            _this.drawImage();
            wx.hideLoading();
            setTimeout(function () {
              _this.canvasToImage()
            }, 200)
          }
        })
      }
    })
  },
  drawImage() {
    //绘制canvas图片
    var _this = this
    const ctx = wx.createCanvasContext('myCanvas')
    var bgPath = '../../../images/share_bg.png'
    var portraitPath = _this.data.portrait_temp
    var hostNickname = app.globalData.userInfo.nickName

    var qrPath = _this.data.qrcode_temp
    var windowWidth = _this.data.windowWidth
    _this.setData({
      scale: 1.6
    })
    //绘制背景图片
    ctx.drawImage(bgPath, 0, 0, windowWidth, _this.data.scale * windowWidth)

    //绘制头像
    ctx.save()
    ctx.beginPath()
    ctx.arc(windowWidth / 2, 0.32 * windowWidth, 0.15 * windowWidth, 0, 2 * Math.PI)
    ctx.clip()
    ctx.drawImage(portraitPath, 0.7 * windowWidth / 2, 0.17 * windowWidth, 0.3 * windowWidth, 0.3 * windowWidth)
    ctx.restore()
    //绘制第一段文本
    ctx.setFillStyle('#ffffff')
    ctx.setFontSize(0.037 * windowWidth)
    ctx.setTextAlign('center')
    ctx.fillText(hostNickname + ' 正在参加疯狂红包活动', windowWidth / 2, 0.52 * windowWidth)
    //绘制第二段文本
    ctx.setFillStyle('#ffffff')
    ctx.setFontSize(0.037 * windowWidth)
    ctx.setTextAlign('center')
    ctx.fillText('邀请你一起来领券抢红包啦~', windowWidth / 2, 0.57 * windowWidth)
    //绘制二维码
    ctx.drawImage(qrPath, 0.64 * windowWidth / 2, 0.75 * windowWidth, 0.36 * windowWidth, 0.36 * windowWidth)
    //绘制第三段文本
    ctx.setFillStyle('#ffffff')
    ctx.setFontSize(0.037 * windowWidth)
    ctx.setTextAlign('center')
    ctx.fillText('长按二维码领红包', windowWidth / 2, 1.36 * windowWidth)
    ctx.draw();
  },
  canvasToImage() {
    var _this = this
    wx.canvasToTempFilePath({
      x: 0,
      y: 0,
      width: _this.data.windowWidth,
      height: _this.data.windowWidth * _this.data.scale,
      destWidth: _this.data.windowWidth * 4,
      destHeight: _this.data.windowWidth * 4 * _this.data.scale,
      canvasId: 'myCanvas',
      success: function (res) {
        console.log('朋友圈分享图生成成功:' + res.tempFilePath)
        wx.previewImage({
          current: res.tempFilePath, // 当前显示图片的http链接
          urls: [res.tempFilePath] // 需要预览的图片http链接列表
        })
      },
      fail: function (err) {
        console.log('失败')
        console.log(err)
      }
    })
  },
  goToVideoSwiper(e) {
    var id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `../video-swiper/video-swiper?id=${id}&type=course`,
    })
  },
  videoPlay() {
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
  },
  onHide() {
    this.videoParse()
  }
})
