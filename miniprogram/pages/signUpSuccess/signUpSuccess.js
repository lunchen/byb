// 报名成功分享页
// signUpSuccess.js
const util = require('../../utils/util.js')
const apiServer = require('../../api/request.js');
//获取应用实例
const app = getApp()
Page({
  data: {
    //navbar
    // 导航头组件所需的参数
    nvabarData: {
      showCapsule: 1, //是否显示左上角图标   1表示显示    0表示不显示
      title: '报一报', //导航栏 中间的标题
      white: '', // 是就显示白的，不是就显示黑的。
      address: '', // 加个背景 不加就是没有
    },

    // 导航头的高度
    height: app.globalData.navheight,
    isIphoneX: app.globalData.isIphoneX,
    cmt: app.globalData.isIphoneX ? 20 : 24,
    areaList:'',
    show:true,
    orderData: '',
    id: '',
    canvasImgShow: false,
    canvasImg: '',
    activityListData:'',
    isdefault: false,
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
  closeCanvasImgShow() {
    this.setData({
      canvasImgShow: false
    })
  },
  showPopup() {
    this.setData({ show: true });
  },

  onClose() {
    this.setData({ show: false });
  },

  onLoad: function (e) {

    var that = this;
    wx.setNavigationBarColor({
      frontColor: '#000000',
      backgroundColor: '#ffffff'
    });
    console.log(e)
    let orderNo = e.orderNo ? e.orderNo : "";
    if (orderNo) {
      console.log(orderNo)
      apiServer.post(`/app/order/info/id/${orderNo}`).then(res => {
        if (res.data.data.infoDetailList[0].activity.id === 0){
          var id = res.data.data.infoDetailList[0].org.id
          var isdefault = true
        }else{
          var id = res.data.data.infoDetailList[0].activity.id
          var isdefault = false
        }
        console.log(res.data);
        that.setData({
          orderData: res.data.data,
          id: id,
          isdefault: isdefault
        })
        if(that.data.isdefault){
          that.getSchoolHomeData()
        }else{
          that.getActivityListData()
        }
      })
    }
  },
  getActivityListData(){
    var that = this
    apiServer.post(`/app/activity/info/${that.data.id}`).then(res => {
      that.setData({
        "activityListData": res.data.data
      })
    })
  },
  getSchoolHomeData() {
    var that = this
    apiServer.post(`/app/org/index/${that.data.id}`).then(res => {
      that.setData({
        schoolHomeData: res.data.data,
      })
    })
  },
  imgLoaded(e) {
    this.setData({
      imageHeight: e.detail.height,
      imageWidth: e.detail.width
    })
    console.log("保存图片的尺寸")

    console.log(e)
  },
  // 生成朋友圈图片
  shareFriend() {
    // this.onSaveToPhone()
    if(this.data.isdefault){
      this.drawGoodsPoster1()
    }else{
      this.drawGoodsPoster()
    }
  },
  // 保存图片
  saveToPhoto() {
    var that = this
    wx.getSetting({
      success: (res) => {
        console.log(JSON.stringify(res))
        if (res.authSetting['scope.writePhotosAlbum'] == false) {
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
          console.log(0)
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
    console.log("url", url);

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
  // 统一下载
  getGoodsNeedImgSrc() {
    var that = this
    const { QrcodeUrl, p } = that.data;
    return Promise.all([
      that._getLocalSrc(that.data.activityListData.img.url),
      that._getLocalSrc("https://enlist-prod.oss-cn-hangzhou.aliyuncs.com/png/detail_1@3x.png"),
      that._getLocalSrc("https://enlist-prod.oss-cn-hangzhou.aliyuncs.com/png/detail_2@3x.png"),
      that._getLocalSrc("https://enlist-prod.oss-cn-hangzhou.aliyuncs.com/png/detail_3@3x.png"),
      that._getLocalSrc("https://enlist-prod.oss-cn-hangzhou.aliyuncs.com/png/school_4@3x.png"),
      that._getLocalSrc("https://enlist-prod.oss-cn-hangzhou.aliyuncs.com/png/detail_4@3x.png"),

      that._getLocalSrc(`https://enlist2-prod.oss-cn-hangzhou.aliyuncs.com/wechatactivityqrcpde/${that.data.id}.jpg`),
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
          icon1Src,
          icon2Src,
          icon3Src,
          icon4Src,
          icon5Src,
          qrCodeSrc
        ] = await that.getGoodsNeedImgSrc();
        let course = []
        // console.log(that.data.activityListData.courseList)
        // that.data.activityListData.courseList.map(item => {
        //   course.push(that._getLocalSrc(item.img))
        // })
        // console.log(course)
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
        const canvasWidth = 800;
        const canvasHeight = 1040 / ratio;
        ctx.setFillStyle("#ffffff");
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);
        var topHeight = 400 / ratio
        // 画bill
        if (that.data.imageHeight / that.data.imageWidth > topHeight / canvasWidth) {
          console.log(1)
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
          console.log(22222)

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


        ctx.fillRect(40 / ratio, topHeight + 40 / ratio, canvasWidth - 80 / ratio, 360 / ratio)

        ctx.setTextBaseline("top");
        ctx.setFontSize(30 / ratio);
        ctx.setFillStyle("#333");

        var textTop = topHeight + 100 / ratio;


        var text = ""
        if (that.data.activityListData.info.name) {
          text = that.data.activityListData.info.name
          text = text.length > 18 ? text.slice(0, 17) : text
        } else {
          text = " "
        }

        ctx.drawImage(icon1Src, (40 + 20) / ratio, textTop - 10 / ratio, 40 / ratio, 40 / ratio)
        ctx.fillText(text, (40 + 80) / ratio, textTop);
        textTop += 60 / ratio

        ctx.setFontSize(28 / ratio);
        ctx.setFillStyle("#666");

        if (that.data.activityListData.info.betweenTime) {
          text = that.data.activityListData.info.betweenTime
        } else {
          text = " "
        }
        ctx.drawImage(icon2Src, (40 + 20) / ratio, textTop - 10 / ratio, 40 / ratio, 40 / ratio)
        ctx.fillText(text, (40 + 80) / ratio, textTop);
        textTop += 60 / ratio


        if (that.data.activityListData.info.addr.addr) {
          text = that.data.activityListData.info.addr.addr
          text = text.length > 18 ? text.slice(0, 17) : text
        } else {
          text = " "
        }

        ctx.drawImage(icon3Src, (40 + 20) / ratio, textTop - 10 / ratio, 40 / ratio, 40 / ratio)
        ctx.fillText(text, (40 + 80) / ratio, textTop);
        textTop += 60 / ratio


        if (that.data.activityListData.info.joinCount || that.data.activityListData.info.totalJoin) {
          text = that.data.activityListData.info.joinCount
          text = "已报名 " + that.data.activityListData.info.joinCount + "人/" + that.data.activityListData.info.totalJoin
        } else {
          text = " "
        }

        ctx.drawImage(icon4Src, (40 + 20) / ratio, textTop - 10 / ratio, 40 / ratio, 40 / ratio)
        ctx.fillText(text, (40 + 80) / ratio, textTop);
        textTop += 60 / ratio


        if (that.data.activityListData.info.price) {
          text = that.data.activityListData.info.price
          text = text.length > 18 ? text.slice(0, 17) : text
        } else {
          text = " "
        }
        ctx.setFillStyle("#fe8800");
        ctx.drawImage(icon5Src, (40 + 20) / ratio, textTop - 10 / ratio, 40 / ratio, 40 / ratio)
        ctx.fillText(text, (40 + 80) / ratio, textTop);
        textTop += 60 / ratio

        // 底部黄色
        ctx.setFillStyle("#ffcf1b");
        ctx.setFontSize(30 / ratio);
        ctx.fillRect(0, canvasHeight - 200 / ratio, canvasWidth, 200 / ratio)
        ctx.setFillStyle("#fff");
        ctx.setTextBaseline("top");
        if (that.data.activityListData.org.telephone) {
          text = that.data.activityListData.org.telephone
          text = text.length > 18 ? text.slice(0, 17) : text
        } else {
          text = " "
        }
        ctx.fillText("联系电话：" + text, (40 + 20) / ratio, canvasHeight - (200 - 60) / ratio);
        if (that.data.activityListData.org.wechat) {
          text = that.data.activityListData.org.wechat
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

  // 学校主页xiaocanvas所需图片统一下载
  getGoodsNeedImgSrc1() {
    var that = this
    const { QrcodeUrl, p } = that.data;
    return Promise.all([
      that._getLocalSrc(that.data.schoolHomeData.img),
      that._getLocalSrc(that.data.schoolHomeData.logo),
      that._getLocalSrc("https://enlist-prod.oss-cn-hangzho0u.aliyuncs.com/png/detail_3@3x.png"),
      that._getLocalSrc("https://enlist-prod.oss-cn-hangzhou.aliyuncs.com/png/school_4@3x.png"),
      that._getLocalSrc(`https://enlist2-prod.oss-cn-hangzhou.aliyuncs.com/wechatorgqrcpde/${that.data.id}.jpg`),
    ]);
  },
  // 画图
  drawGoodsPoster1() {
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
        ] = await that.getGoodsNeedImgSrc1();
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

          console.log(billLeft)
          console.log(billWidth)
          console.log(billHeight)
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
        // ctx.drawImage(icon1Src, (40 + 20) / ratio, textTop - 5 / ratio, 40 / ratio, 40 / ratio)
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
        await that._drawCanvas1({
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
  _drawCanvas({ canvasWidth = 400, canvasHeight = 520, ctx }) {
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
  _drawCanvas1({ canvasWidth = 400, canvasHeight = 480, ctx }) {
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
            canvasId: "myCanvas1",
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
  onReady: function () {
  },
  onShow: function () {

  },
  onHide: function () {

  },
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */


  onShareAppMessage: function (ops) {
    var json = encodeURIComponent(JSON.stringify({ a: 1 }));
    
    if (this.data.isdefault) {
      // 来自页面内转发按钮
      var path = '/pages/schoolHome/schoolHome?id=' + this.data.id
    }else{
      var path = '/pages/activityDetails/activityDetails?id=' + this.data.id
    }
    return {
      title: '报1 报',
      path: path,
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