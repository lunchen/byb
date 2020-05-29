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
    canvasImg:''
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
    console.log(e)
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
  goToVideoTop(e) {
    var id = e.currentTarget.dataset.id
    var index = e.currentTarget.dataset.index
    wx.navigateTo({
      url: `../videoTop/videoTop?id=${id}&type=course&index=${index}`,
    })
  },
  goToVideoSwiper(e) {
    console.log(e)
    var id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `../my-video-swiper/video-swiper?id=${id}&type=course`,
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
        console.log(res.data);
        that.setData({
          "activityListData": res.data.data
        })
      })
    }
  },
  getData(id) {
    var that = this;
    apiServer.post(`/app/org/index/${id}`).then(res => {
      console.log(res.data);
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
      console.log(that.data.markers)
    })
  },
  onLoad: function (e) {
    var that = this
    console.log(99999)
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
          console.log(res.data);
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
      console.log("show")
      console.log(this.data.id)
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
    console.log(e)
  },
  // 生成朋友圈图片
  shareFriend(){
    // this.onSaveToPhone()
    this.drawGoodsPoster()
  },
  // 保存图片
  saveToPhoto() {
    var that = this
    wx.getSetting({
      success: (res) => {
        console.log(JSON.stringify(res))
        if (res.authSetting['scope.writePhotosAlbum'] == false) {
          // 已经拒绝重新唤起
          that.openSetting()
        } else if (!res.authSetting['scope.writePhotosAlbum']) {
          wx.authorize({
            scope: "scope.writePhotosAlbum",
            success() {
              wx.showToast({
                title: "授权成功~",
                icon: "none"
              });
              wx.saveImageToPhotosAlbum({
                filePath: that.data.canvasImg,
                success(res) {
                  console.log(res)
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
              reject(e);
            }
          });
        } else {
          wx.saveImageToPhotosAlbum({
            filePath: that.data.canvasImg,
            success(res) {
              console.log(res)
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
  // 获取存图片到相册权限
  onSaveToPhone() {
    let that = this;
    wx.getSetting({
      success: (res) => {
        console.log(JSON.stringify(res))
        if (res.authSetting['scope.writePhotosAlbum'] == false) {
          // 已经拒绝重新唤起
          wx.showModal({
            title: '请求授权保存图片到相册',
            content: '需要获取您的相册保存权限，请确认授权',
            success: function (res) {
              if (res.cancel) {
                wx.showToast({
                  title: '拒绝授权',
                  icon: 'none',
                  duration: 1000
                })
              } else if (res.confirm) {
                that.openSetting()
              }
            }
          })
        } else if (!res.authSetting['scope.writePhotosAlbum']) {
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

    var that = this
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
    var that = this
    if (that.query === undefined) {
      that.query = wx.createSelectorQuery();
    }
    return new Promise((resolve, reject) => {
      try {
        that.query
          .select(selector)
          .boundingClientRect(rect => {
            if (!root) {
              rect.left = rect.left - that.data.originX;
              rect.top = rect.top - that.data.originY;
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
    var that = this
    return new Promise((resolve, reject) => {
      // 保存网络图片到本地缓存
      if (url) {
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
      } else {
        resolve('');
      }

    });
  },
  // 学校主页xiaocanvas所需图片统一下载
  getGoodsNeedImgSrc() {
    var that = this
    const { QrcodeUrl, p } = that.data;
    return Promise.all([
      that._getLocalSrc(that.data.schoolHomeData.img),
      that._getLocalSrc(that.data.schoolHomeData.logo),
      that._getLocalSrc("https://enlist-prod.oss-cn-hangzhou.aliyuncs.com/png/detail_3@3x.png"),
      that._getLocalSrc("https://enlist-prod.oss-cn-hangzhou.aliyuncs.com/png/school_4@3x.png"),
      that._getLocalSrc(`https://enlist2-prod.oss-cn-hangzhou.aliyuncs.com/wechatorgqrcpde/${that.data.id}.jpg`),
    ]);
  },
  // 画图
  drawGoodsPoster() {
    wx.showLoading();
    var that = this
    return new Promise(async (resolve, reject) => {
      try {
        let [
          topImgSrc,
          logoSrc,
          icon1Src,
          icon2Src,
          qrCodeSrc
        ] = await that.getGoodsNeedImgSrc();
        let course = []
        const p = that.data.p;

        var ratio = 750 / wx.getSystemInfoSync().windowWidth;
        ratio = 1
        that.setData({
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
        // let r = await that.nodeRect("#imgView");
        // 设原点坐标
        that.setData({
          originX: 0,
          originY: 0
        });
        // console.log('背景rect', r);

        // const canvasWidth = wx.getSystemInfoSync().windowWidth;
        // const canvasHeight = 960 / ratio;
        const canvasWidth = 800;
        const canvasHeight = 960 / ratio;
        ctx.setFillStyle("#ffffff");
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);
        var topHeight = 400 / ratio
        // 画bill
        if (that.data.imageHeight / that.data.imageWidth > topHeight / canvasWidth) {
          var billWidth = canvasWidth
          var billHeight = that.data.imageHeight / that.data.imageWidth * canvasWidth
          var billTop = (topHeight - billHeight) / 2
          ctx.save()
          ctx.beginPath()
          ctx.rect(0, 0, canvasWidth, topHeight)
          ctx.clip()
          ctx.drawImage(topImgSrc, 0, billTop, billWidth, billHeight)
          ctx.restore()
        } else {

          var billHeight = topHeight
          var billWidth = that.data.imageWidth / that.data.imageHeight * topHeight
          var billLeft = (canvasWidth - billWidth) / 2
          ctx.save()
          ctx.beginPath()
          ctx.rect(0, 0, canvasWidth, topHeight)
          ctx.clip()

          ctx.drawImage(topImgSrc, billLeft, 0, billWidth, billHeight)
          ctx.restore()
        }

        ctx.save()

        ctx.setFillStyle("#f5f5f5");
        
        // 画圆角矩形，线条倾斜需修改 
        // var Point = function (x, y) {
        //   return { x: x, y: y };
        // };

        // function Rect(x, y, w, h) {
        //   return { x: x, y: y, width: w, height: h };
        // }

        // function drawRoundedRect(rect, r, ctx) {
        //   var ptA = Point(rect.x + r, rect.y);
        //   var ptB = Point(rect.x + rect.width, rect.y);
        //   var ptC = Point(rect.x + rect.width, rect.y + rect.height);
        //   var ptD = Point(rect.x, rect.y + rect.height);
        //   var ptE = Point(rect.x, rect.y);

        //   ctx.beginPath();

        //   ctx.moveTo(ptA.x, ptA.y);
        //   ctx.arcTo(ptB.x, ptB.y, ptC.x, ptC.y, r);
        //   ctx.arcTo(ptC.x, ptC.y, ptD.x, ptD.y, r);
        //   ctx.arcTo(ptD.x, ptD.y, ptE.x, ptE.y, r);
        //   ctx.arcTo(ptE.x, ptE.y, ptA.x, ptA.y, r);

        //   ctx.setFillStyle("#f5f5f5");
        //   ctx.fill();
        //   // ctx.stroke();
        // }

        // var rect = Rect(40 / ratio, topHeight + 40 / ratio, canvasWidth - 80 / ratio, 280 / ratio);
        // // 画圆角矩形
        // drawRoundedRect(rect, 5, ctx);

        
        ctx.fillRect(40 / ratio, topHeight + 40 / ratio, canvasWidth - 80 / ratio, 280 / ratio)

        ctx.setTextBaseline("top");
        ctx.setFontSize(30 / ratio);
        ctx.setFillStyle("#333");

        var textTop = topHeight + 100 / ratio;
        if (logoSrc) {
          ctx.drawImage(logoSrc, (40 + 20) / ratio, textTop - 20 / ratio, 60 / ratio, 60 / ratio)
          ctx.fillText(that.data.schoolHomeData.name, (40 + 100) / ratio, textTop);
          textTop += 70 / ratio
        }

        var text = ""
        if (that.data.schoolHomeData.remark) {
          text = that.data.schoolHomeData.remark
          text = text.length > 18 ? text.slice(0, 17) : text
        } else {
          text = " "
        }
        ctx.setFontSize(28 / ratio);
        ctx.setFillStyle("#666");
        // ctx.drawImage(icon1Src, (40 + 20) / ratio, textTop - 10 / ratio, 40 / ratio, 40 / ratio)
        ctx.fillText(text, (40 + 20) / ratio, textTop);
        textTop += 60 / ratio

        if (that.data.schoolHomeData.addr.addr) {
          text = that.data.schoolHomeData.addr.addr
          text = text.length > 18 ? text.slice(0, 17) : text
        } else {
          text = " "
        }
        ctx.setFontSize(28 / ratio);
        ctx.setFillStyle("#666");

        ctx.drawImage(icon1Src, (40 + 20) / ratio, textTop - 8 / ratio, 40 / ratio, 40 / ratio)
        ctx.fillText(text, (40 + 80) / ratio, textTop);
        textTop += 60 / ratio

        // 底部黄色
        ctx.setFillStyle("#ffcf1b");
        ctx.setFontSize(30 / ratio);
        ctx.fillRect(0, canvasHeight - 200 / ratio, canvasWidth, 200 / ratio)
        ctx.setFillStyle("#fff");
        ctx.setTextBaseline("top");
        if (that.data.schoolHomeData.telephone) {
          text = that.data.schoolHomeData.telephone
          text = text.length > 18 ? text.slice(0, 17) : text
        } else {
          text = " "
        }
        ctx.fillText("联系电话：" + text, (40 + 20) / ratio, canvasHeight - (200 - 60) / ratio);
        if (that.data.schoolHomeData.wechat) {
          text = that.data.schoolHomeData.wechat
          text = text.length > 18 ? text.slice(0, 17) : text
        } else {
          text = " "
        }
        ctx.fillText("微信号：" + text, (40 + 20) / ratio, canvasHeight - (200 - 120) / ratio);
        if (qrCodeSrc) {
          ctx.drawImage(qrCodeSrc, canvasWidth - 205 / ratio, canvasHeight - (200 - 20) / ratio, 130 / ratio, 130 / ratio);
          ctx.setFillStyle("#fff");
          ctx.setFontSize(28 / ratio);
          ctx.setTextBaseline("top");
          ctx.fillText("免费约课", canvasWidth - 198 / ratio, canvasHeight - (200 - 160) / ratio);
        }
        // r = await that.nodeRect("#courseList");

        console.log("开始绘制...");
        await that._drawCanvas({
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
  _drawCanvas({ canvasWidth = 400, canvasHeight = 480, ctx }) {
    console.log("绘制到canvas")
    var that = this
    return new Promise((resolve, reject) => {
      // 绘制到canvas
      ctx.draw(true, () => {
        setTimeout(() => {
          cb();
        }, 300);
        const cb = () => {
          console.log("下载")
          
          that.setData({
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
              that.setData({
                canvasImgShow: true,
                canvasImg: res.tempFilePath
              })
              if (res.errMsg !== "canvasToTempFilePath:ok") {
                reject();
                wx.showToast({
                  title: "保存canvas到缓存失败,请稍后再试",
                  icon: "none"
                });
              } else {
                resolve();
                that.posterPath = res.tempFilePath;
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
