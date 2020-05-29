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
    activeid: 0,
    identity: wx.getStorageSync('identity') ? wx.getStorageSync('identity') : 1,       //1参与方 2主办方
    id:1,
    activityListData:'',
    windowWidth: wx.getSystemInfoSync().windowWidth
  },
  // 滑块
  swiperChange(e) {
    console.log(e)
    var _this = this;
    var current = e.detail.current
    if (e.detail.source == 'touch') {
      wx.createVideoContext('myVideo' + _this.data.current).stop()
      _this.setData({
        current: e.detail.current,
        activeid: e.detail.current
      })

      _this.getActivityDetailsData(_this.data.schoolHomeData.orgBannerList[this.data.current].id)
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
  goToVideoSwiper(e) {
    var id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `../video-swiper/video-swiper?id=${id}&type=course`,
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
  getActivityDetailsData(activityId){
    var _this = this;
    apiServer.post(`/app/activity/info/${activityId}`).then(res => {
      console.log(res.data);
      _this.setData({
        "activityListData": res.data.data
      })
    })
  },
  getSchoolHomeData(id) {
    var _this = this;
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
      _this.getActivityDetailsData(res.data.data.orgBannerList[this.data.current].id)
    })
  },
  onLoad: function (e) {

    this.getSchoolHomeData(9)
    wx.setStorageSync('schoolHome_activeVideo', 0)
    wx.setNavigationBarColor({
      frontColor: '#000000',
      backgroundColor: '#fff'
    });
    var _this = this;
    let id = e ? e.id : '1';
    this.setData({
      id:id
    })
    if (e.open == 3) {
      this.setData({
        loginShow: 3,
        signUpType: true
      })
    }
    var token = wx.getStorageSync("token") ? JSON.parse(wx.getStorageSync("token")).token : '';
    console.log(token)
    var identity = wx.getStorageSync('identity') ? wx.getStorageSync('identity') : 1;
    if (token && identity==2) {
      var sponsorId
      if (wx.getStorageSync("myOrgMes")) {
        sponsorId = JSON.parse(wx.getStorageSync("myOrgMes")).org.id;

        console.log("e.id")
        console.log(wx.getStorageSync("myOrgMes"))

        console.log(e.id)
        if (e.id == sponsorId){

          console.log("sponsorId true")
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
    // this.asd()
  },
  asd(){
    var _this = this
    wx.downloadFile({
      url: "https://enlist-dev.oss-cn-hangzhou.aliyuncs.com/orgicon/2020/04/03/2b8n56s7OhsOgIIDzk4w2v1-*fGnjw-6h1Wi5vw2sOjycKyZIjE3TfkalPTFmZjbIDN78TVzXqlSFKezQ1JMTA$$.jpg",
      success: function (res1) {

        //缓存头像图片
        _this.setData({
          portrait_temp: res1.tempFilePath
        })
        //缓存canvas绘制小程序二维码
        wx.downloadFile({
          url:  "https://enlist-dev.oss-cn-hangzhou.aliyuncs.com/editVideo/2020/04/04/WlGp4RUYNk5mNaH762KWbTIWnxOspqtOCkxhzj-a1v*tP0N0PKUp54w5cvHilfp9.png",
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
              // _this.canvasToImage()
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
    var bgPath = '../../images/home_1@2x.png'
    var portraitPath = _this.data.portrait_temp
    var hostNickname = app.globalData.userInfo.nickName

    var qrPath = _this.data.qrcode_temp
    var windowWidth = _this.data.windowWidth
    _this.setData({
      scale: 1
    })
    //绘制背景图片
    ctx.drawImage(bgPath, 0, 0, windowWidth,200)

    //绘制头像
    ctx.save()
    ctx.beginPath()
    ctx.arc(windowWidth / 2, 100, 60, 0, 2 * Math.PI)
    ctx.clip()
    ctx.drawImage(portraitPath,  windowWidth / 2 -60, 200/2-60, 120, 120)
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
    if (this.data.id) {
      console.log("show")
      console.log(this.data.id)
      this.getSchoolHomeData(this.data.id)
    }
  },
  onHide() {
    this.videoParse()
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
  onShow() {
    
  },
  imgLoaded(e) {
    this.setData({
      imageHeight: e.detail.height,
      imageWidth: e.detail.width
    })
    console.log("保存图片的尺寸")

    console.log(e)
  },
  huahua() {
    console.log(this.data.activityListData)
    console.log(this.data.schoolHomeData)
    // this.onSaveToPhone()
    this.drawGoodsPoster()
  },
  // 获取存图片到相册权限
  onSaveToPhone() {
    let that = this;
    wx.getSetting({
      success: (res) => {
        console.log(JSON.stringify(res))
        if (res.authSetting['scope.writePhotosAlbum'] == false){
          console.log(0)
          // 已经拒绝重新唤起
          that.openSetting()
        } else if (!res.authSetting['scope.writePhotosAlbum']) {
          console.log(1)
          wx.authorize({
            scope: "scope.writePhotosAlbum",
            success() {
              wx.showToast({
                title: "授权成功~",
                icon: "none"
              });
            },
            fail(e) {
              wx.showToast({
                title: "保存需要您的授权哦~",
                icon: "none"
              });
              reject(e);
            }
          });
        } else {
        }
      }
    })
  },
  // 弹出授权设置
  openSetting() {

    var _this = this
    wx.openSetting({
      success: function (dataAu) {
        if (dataAu.authSetting["scope.writePhotosAlbum"] == true) {
          wx.showToast({
            title: '授权成功',
            icon: 'success',
            duration: 1000
          })
        } else {
          wx.showToast({
            title: '授权失败',
            icon: 'none',
            duration: 1000
          })
        }
      }
    })
  },
  // 获取都dom信息
  nodeRect(selector, root) {
    var _this = this
    if (_this.query === undefined) {
      _this.query = wx.createSelectorQuery();
    }
    return new Promise((resolve, reject) => {
      try {
        _this.query
          .select(selector)
          .boundingClientRect(rect => {
            if (!root) {
              rect.left = rect.left - _this.data.originX;
              rect.top = rect.top - _this.data.originY;
            }
            resolve(rect);
          })
          .exec();
      } catch (e) {
        console.error("获取节点" + selector + "信息失败");
        reject(e);
      }
    });
  },
  // 下载需要图片
  _getLocalSrc(url) {
    var _this = this
    console.log("url", url);

    return new Promise((resolve, reject) => {
      // 保存网络图片到本地缓存
      if(url){
        wx.downloadFile({
          url,
          success(res) {
            console.log("下载的东西")
            console.log(res)
            if (res.statusCode !== 200) {
              wx.showToast({
                title: "保存二维码到本地失败",
                icon: "none"
              });
              reject(res);
            } else {
              resolve(res.tempFilePath);
            }
          },
          fail(e) {
            reject(e);
          }
        });
      }else{
        resolve('');
      }
      
    });
  },
  // 统一下载
  getGoodsNeedImgSrc() {
    var _this = this
    const { QrcodeUrl, p } = _this.data;
    return Promise.all([
      _this._getLocalSrc(_this.data.schoolHomeData.img),
      _this._getLocalSrc(_this.data.schoolHomeData.logo),
      _this._getLocalSrc("https://enlist-prod.oss-cn-hangzhou.aliyuncs.com/png/detail_3@3x.png"),
      _this._getLocalSrc("https://enlist-prod.oss-cn-hangzhou.aliyuncs.com/png/school_4@3x.png"),
      _this._getLocalSrc(_this.data.schoolHomeData.wechatQrcode),
    ]);
  },
  // 画图
  drawGoodsPoster() {
    wx.showLoading();
    var _this = this
    return new Promise(async (resolve, reject) => {
      try {
        let [
          topImgSrc,
          logoSrc,
          icon1Src,
          icon2Src,
          qrCodeSrc
        ] = await _this.getGoodsNeedImgSrc();
        let course = []
        // console.log(_this.data.schoolHomeData.courseList)
        // _this.data.schoolHomeData.courseList.map(item => {
        //   course.push(_this._getLocalSrc(item.img))
        // })
        // console.log(course)
        const p = _this.data.p;

        var ratio = 750 / wx.getSystemInfoSync().windowWidth;

        _this.setData({
          originX: 0,
          originY: 0
        });
        console.log("开始画画");

        const ctx = wx.createCanvasContext("myCanvas");

        /**
         * r：获取到的dom节点的位置大小信息
         * 后面覆盖前面
         */
        // 画背景
        let r = await _this.nodeRect("#imgView");
        // 设原点坐标
        _this.setData({
          originX: 0,
          originY: 0
        });
        // console.log('背景rect', r);

        const canvasWidth = wx.getSystemInfoSync().windowWidth;
        const canvasHeight = 960 / ratio;
        ctx.setFillStyle("#ffffff");
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);
        var topHeight = 400 / ratio
        // 画bill
        if (_this.data.imageHeight / _this.data.imageWidth > 600/ratio/canvasWidth){
          var billWidth = canvasWidth
          var billHeight = _this.data.imageHeight / _this.data.imageWidth * canvasWidth
          var billTop = (topHeight  - billHeight) / 2
          ctx.save()
          ctx.beginPath()
          ctx.rect(0, 0, canvasWidth, topHeight)
          ctx.clip()
          ctx.drawImage(topImgSrc, 0, billTop, billWidth, billHeight)
          ctx.restore()
        } else {
          var billHeight = topHeight
          var billWidth = _this.data.imageWidth / _this.data.imageHeight * 600 / ratio
          var billLeft = (canvasWidth - billWidth) / 2
          ctx.save()
          ctx.beginPath()
          ctx.rect(0, 0, canvasWidth, topHeight / ratio)
          ctx.clip()
          ctx.drawImage(topImgSrc, billLeft, 0, billWidth, billHeight)
          ctx.restore()
        }

        ctx.save()
        
        ctx.setFillStyle("#f5f5f5");

        var Point = function (x, y) {
          return { x: x, y: y };
        };

        function Rect(x, y, w, h) {
          return { x: x, y: y, width: w, height: h };
        }

        function drawRoundedRect(rect, r, ctx) {
          var ptA = Point(rect.x + r, rect.y);
          var ptB = Point(rect.x + rect.width, rect.y);
          var ptC = Point(rect.x + rect.width, rect.y + rect.height);
          var ptD = Point(rect.x, rect.y + rect.height);
          var ptE = Point(rect.x, rect.y);

          ctx.beginPath();

          ctx.moveTo(ptA.x, ptA.y);
          ctx.arcTo(ptB.x, ptB.y, ptC.x, ptC.y, r);
          ctx.arcTo(ptC.x, ptC.y, ptD.x, ptD.y, r);
          ctx.arcTo(ptD.x, ptD.y, ptE.x, ptE.y, r);
          ctx.arcTo(ptE.x, ptE.y, ptA.x, ptA.y, r);

          ctx.setFillStyle("#f5f5f5");
          ctx.fill();
          // ctx.stroke();
        }

        var rect = Rect(40 / ratio, topHeight + 40/ratio, canvasWidth-80/ratio, 280 / ratio);
        // 画圆角矩形
        drawRoundedRect(rect, 5, ctx);

        ctx.setTextBaseline("top");
        ctx.setFontSize(30 / ratio);
        ctx.setFillStyle("#333");

        var textTop = topHeight + 100/ratio;
        if (logoSrc){
          ctx.drawImage(logoSrc, (40 + 20) / ratio, textTop-20/ratio, 60 / ratio, 60 / ratio)
          ctx.fillText(_this.data.schoolHomeData.name, (40 + 100) / ratio, textTop);
          textTop += 70 / ratio
        }

        var text = ""
        if (_this.data.schoolHomeData.remark) {
          text = _this.data.schoolHomeData.remark
          text = text.length > 18 ? text.slice(0, 17) : text
        }else{
          text = " "
        }
        ctx.setFontSize(28 / ratio);
        ctx.setFillStyle("#666");
        ctx.drawImage(icon1Src, (40 + 20) / ratio, textTop - 10 / ratio, 40 / ratio, 40 / ratio)
        ctx.fillText(text, (40 + 80) / ratio, textTop);
        textTop += 60 / ratio

        if (_this.data.schoolHomeData.addr.addr) {
          text = _this.data.schoolHomeData.addr.addr
          text = text.length > 18 ? text.slice(0, 17) : text
        } else {
          text = " "
        }
        ctx.setFontSize(28 / ratio);
        ctx.setFillStyle("#666");

        ctx.drawImage(icon2Src, (40 + 20) / ratio, textTop - 10 / ratio, 40 / ratio, 40 / ratio)
        ctx.fillText(_this.data.schoolHomeData.addr.addr, (40 + 80) / ratio, textTop);
        textTop += 60 / ratio

        // 底部黄色
        ctx.setFillStyle("#ffcf1b");
        ctx.setFontSize(30 / ratio);
        ctx.fillRect(0, canvasHeight - 200 / ratio, canvasWidth, 200 / ratio)
        ctx.setFillStyle("#fff");
        ctx.setTextBaseline("top");
        if (_this.data.schoolHomeData.telephone) {
          text = _this.data.schoolHomeData.telephone
          text = text.length > 18 ? text.slice(0, 17) : text
        } else {
          text = " "
        }
        ctx.fillText("联系电话：" + text, r.left + 10 / ratio, canvasHeight - (200 - 60) / ratio);
        if (_this.data.schoolHomeData.wechat) {
          text = _this.data.schoolHomeData.wechat
          text = text.length > 18 ? text.slice(0, 17) : text
        } else {
          text = " "
        }
        ctx.fillText("微信号：" + text, r.left + 10 / ratio, canvasHeight - (200 - 120) / ratio);
        if (qrCodeSrc){
          ctx.drawImage(qrCodeSrc, canvasWidth - 205 / ratio, canvasHeight - (200 - 20) / ratio, 130 / ratio, 130 / ratio);
          ctx.setFillStyle("#fff");
          ctx.setFontSize(28 / ratio);
          ctx.setTextBaseline("top");
          ctx.fillText("免费约课", canvasWidth - 198 / ratio, canvasHeight - (200 - 160) / ratio);
        }
        // r = await _this.nodeRect("#courseList");


        console.log("开始绘制...");
        await _this._drawCanvas({
          canvasWidth,
          canvasHeight,
          ctx
        });
        wx.hideLoading();
        resolve();
      } catch (e) {
        reject(e);
      }
    });
  },

  // 画图绘制到canvas
  _drawCanvas({ canvasWidth = 680, canvasHeight = 1030, ctx }) {

    var _this = this
    return new Promise((resolve, reject) => {
      // 绘制到canvas
      ctx.draw(true, () => {
        setTimeout(() => {
          cb();
        }, 300);
        const cb = () => {
          _this.setData({
            isCanvasDrawed: true
          });
          // 将canvas存入本地
          wx.canvasToTempFilePath({
            x: 0,
            y: 0,
            width: canvasWidth,
            height: canvasHeight,
            destWidth: canvasWidth * 2,
            destHeight: canvasHeight * 2,
            canvasId: "myCanvas",
            success(res) {
              console.log("canvasToTempFilePath res", res);
              if (res.errMsg !== "canvasToTempFilePath:ok") {
                reject();
                wx.showToast({
                  title: "保存canvas到缓存失败,请稍后再试",
                  icon: "none"
                });
              } else {
                resolve();
                _this.posterPath = res.tempFilePath;
              }
            },
            fail(e) {
              console.error(e);
            }
          });
        };
      });
    });
  },
  // 画图 给活动用
  drawGoodsPoster1() {

    var _this = this
    return new Promise(async (resolve, reject) => {
      try {
        let [
          topImgSrc,
          QrcodeSrc
        ] = await _this.getGoodsNeedImgSrc();
        let course = []
        console.log(_this.data.schoolHomeData.courseList)
        _this.data.schoolHomeData.courseList.map(item=>{
          course.push(_this._getLocalSrc(item.img))
        })
        console.log(course)
        const p = _this.data.p;

        let ratio = _this.ratio;
        if (!ratio) {
          ratio = 750 / wx.getSystemInfoSync().windowWidth;
          _this.ratio = ratio;
        }

        _this.setData({
          originX: 0,
          originY: 0
        });
        console.log("开始画画");

        const ctx = wx.createCanvasContext("myCanvas");

        /**
         * r：获取到的dom节点的位置大小信息
         * 后面覆盖前面
         */
        // 画背景
        let r = await _this.nodeRect("#imgView");
        // 设原点坐标
        _this.setData({
          originX: r.left,
          originY: r.top
        });
        // console.log('背景rect', r);

        const canvasWidth = wx.getSystemInfoSync().windowWidth;
        const canvasHeight = 1000/ratio;
        ctx.setFillStyle("#ffffff");
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);
        
        // 画商品
        r = await _this.nodeRect("#imgView");
        ctx.drawImage(topImgSrc, r.left, r.top, r.width, r.height);
        ctx.save()
        r = await _this.nodeRect("#card");
        ctx.setFillStyle("#f5f5f5");

        var Point = function (x, y) {
          return { x: x, y: y };
        };

        function Rect(x, y, w, h) {
          return { x: x, y: y, width: w, height: h };
        }

        function drawRoundedRect(rect, r, ctx) {
          var ptA = Point(rect.x + r, rect.y);
          var ptB = Point(rect.x + rect.width, rect.y);
          var ptC = Point(rect.x + rect.width, rect.y + rect.height);
          var ptD = Point(rect.x, rect.y + rect.height);
          var ptE = Point(rect.x, rect.y);

          ctx.beginPath();

          ctx.moveTo(ptA.x, ptA.y);
          ctx.arcTo(ptB.x, ptB.y, ptC.x, ptC.y, r);
          ctx.arcTo(ptC.x, ptC.y, ptD.x, ptD.y, r);
          ctx.arcTo(ptD.x, ptD.y, ptE.x, ptE.y, r);
          ctx.arcTo(ptE.x, ptE.y, ptA.x, ptA.y, r);

          ctx.setFillStyle("#f5f5f5");
          ctx.fill();
          // ctx.stroke();
        }

        var rect = Rect(r.left, r.top, r.width, r.height - 120 / ratio);

        drawRoundedRect(rect, 5, ctx);
        // ctx.fillRect(r.left, r.top, r.width, r.height-120/ratio);
        ctx.setTextBaseline("top");
        ctx.setFontSize(30 / ratio);
        ctx.setFillStyle("#333");
        ctx.fillText(_this.data.activityListData.info.name, r.left + 50 / ratio, r.top + 60 / ratio);

        ctx.setFontSize(28 / ratio);
        ctx.setFillStyle("#666");
        ctx.fillText(_this.data.activityListData.info.betweenTime, r.left + 50 / ratio, r.top + 120 / ratio);

        ctx.fillText(_this.data.activityListData.info.addr.addr, r.left + 50 / ratio, r.top + 180 / ratio);

        ctx.fillText("已报名" + _this.data.activityListData.info.joinCount + "人/" + _this.data.activityListData.info.totalJoin, r.left + 50 / ratio, r.top + 240 / ratio);

        // 底部黄色
        ctx.setFillStyle("#ffcf1b");
        ctx.setFontSize(30 / ratio);
        ctx.fillRect(0, canvasHeight - 200 / ratio, canvasWidth, 200 / ratio)
        ctx.setFillStyle("#fff");
        ctx.setTextBaseline("top");
        ctx.fillText("联系电话：" + _this.data.activityListData.org.telephone, r.left + 10 / ratio, canvasHeight - (200 - 60) / ratio);
        ctx.fillText("微信号：" + _this.data.activityListData.org.wechat, r.left + 10 / ratio, canvasHeight - (200 - 120) / ratio);

        ctx.drawImage(QrcodeSrc, canvasWidth - 205 / ratio, canvasHeight - (200 - 20)/ratio, 130 / ratio, 130 / ratio);
        ctx.setFillStyle("#fff");
        ctx.setFontSize(28 / ratio);
        ctx.setTextBaseline("top");
        ctx.fillText("免费约课", canvasWidth - 198 / ratio, canvasHeight - (200-160)/ratio);
        // r = await _this.nodeRect("#courseList");


        console.log("开始绘制...");
        await _this._drawCanvas({
          canvasWidth,
          canvasHeight,
          ctx
        });
        wx.hideLoading();
        resolve();
      } catch (e) {
        reject(e);
      }
    });
  },
  // 生成前校验
  beforeSave() {
    var _this = this
    return new Promise((resove, reject) => {
      if (!_this.data.isQrcodeLoaded) {
        reject("二维码未加载完成");
        wx.showToast({
          title: "请等待二维码加载哦~",
          icon: "none"
        });
      } else {
        resove();
      }
    });
  },
  // 二维码image bindload事件
  QrcodeLoaded(e) {
    var _this = this
    _this.setData({
      isQrcodeLoaded: true
    });
  },
})
