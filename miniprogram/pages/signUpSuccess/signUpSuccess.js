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
    orderData:''
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
    let orderNo = e.orderNo ? e.orderNo : 1;
    if (orderNo) {
      console.log(orderNo)
      apiServer.post(`/app/order/info/id/${orderNo}`).then(res => {
        console.log(res.data);
        that.setData({
          orderData: res.data.data
        })
      })
    }
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
    if (ops.from === 'button') {
      // 来自页面内转发按钮
      console.log(ops.target)
    }
    return {
      title: '分享卡片',
      path: '/pages/signUpSuccess/signUpSuccess?share=' + json,
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

  askAuth() {
    return new Promise((resolve, reject) => {
      utils.getAuthStatus("writePhotosAlbum").then(isAuthed => {
        if (isAuthed === "none") {
          // 无信息，弹授权
          wx.authorize({
            scope: "scope.writePhotosAlbum",
            success() {
              resolve();
            },
            fail(e) {
              page.initAuthStatus();
              wx.showToast({
                title: "保存需要您的授权哦~",
                icon: "none"
              });
              reject(e);
            }
          });
        } else if (isAuthed) {
          // 已同意，直接保存
          resolve();
        } else {
          // 已拒绝过，弹设置
          reject(res);
          page.openSetting();
        }
      });
    });
  },
  async tapSave() {
    try {
      await page.beforeSave(); // 生成前的校验
      await page.askAuth(); // 处理授权
      await page.drawPoster(); // 绘制海报
      await page.saveFile(); // 保存到本地
    } catch (e) {
      console.error(e);
    }
  },
  // 弹出授权设置
  openSetting() {
    wx.openSetting({
      success(e) {
        console.log(e);
      },
      fail(e) {
        console.error(e);
      }
    });
  },
  nodeRect(selector, root) {
    if (page.query === undefined) {
      page.query = wx.createSelectorQuery();
    }
    return new Promise((resolve, reject) => {
      try {
        page.query
          .select(selector)
          .boundingClientRect(rect => {
            if (!root) {
              rect.left = rect.left - page.data.originX;
              rect.top = rect.top - page.data.originY;
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
  _getLocalSrc(url) {
    console.log("url", url);

    return new Promise((resolve, reject) => {
      // 保存网络图片到本地缓存
      wx.downloadFile({
        url,
        success(res) {
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
    });
  },
  getGoodsNeedImgSrc() {
    const { QrcodeUrl, p } = page.data;
    return Promise.all([
      page._getLocalSrc("https://enlist-dev.oss-cn-hangzhou.aliyuncs.com/orgicon/2020/04/03/2b8n56s7OhsOgIIDzk4w2v1-*fGnjw-6h1Wi5vw2sOjycKyZIjE3TfkalPTFmZjbIDN78TVzXqlSFKezQ1JMTA$$.jpg"),
      page._getLocalSrc("https://enlist-dev.oss-cn-hangzhou.aliyuncs.com/orgicon/2020/04/03/2b8n56s7OhsOgIIDzk4w2v1-*fGnjw-6h1Wi5vw2sOjycKyZIjE3TfkalPTFmZjbIDN78TVzXqlSFKezQ1JMTA$$.jpg"),
      page._getLocalSrc("https://enlist-dev.oss-cn-hangzhou.aliyuncs.com/editVideo/2020/04/04/WlGp4RUYNk5mNaH762KWbTIWnxOspqtOCkxhzj-a1v*tP0N0PKUp54w5cvHilfp9.png")
    ]);
  },
  drawGoodsPoster() {
    return new Promise(async (resolve, reject) => {
      try {
        let [
          goodsImgSrc,
          titleBgSrc,
          QrcodeSrc
        ] = await page.getGoodsNeedImgSrc();

        const p = page.data.p;

        let ratio = page.ratio;
        if (!ratio) {
          ratio = 750 / wx.getSystemInfoSync().windowWidth;
          page.ratio = ratio;
        }

        console.log("开始画画");

        const ctx = wx.createCanvasContext("myCanvas");

        /**
         * r：获取到的dom节点的位置大小信息
         * 后面覆盖前面
         */
        // 画背景
        let r = await page.nodeRect("#goods");
        // 设原点坐标
        page.setData({
          originX: r.left,
          originY: r.top
        });
        // console.log('背景rect', r);

        const canvasWidth = r.width;
        const canvasHeight = r.height;
        ctx.setFillStyle(posterConfig.bgColor);
        ctx.fillRect(0, 0, r.width, r.height);

        // 画商品
        r = await page.nodeRect("#goodsImg");
        ctx.drawImage(goodsImgSrc, r.left, r.top, r.width, r.height);

        // 画标题一
        // 标题背景
        r = await page.nodeRect("#titleBg");
        ctx.drawImage(titleBgSrc, r.left, r.top, r.width, r.height);
        ctx.setTextBaseline("top");

        // 标题一文字
        // ctx.save()

        r = await page.nodeRect("#p1-1");
        // ctx.font = `sans-serif ${62/ratio}px bold`
        ctx.setFontSize(54 / ratio);
        ctx.setFillStyle("#fff");
        ctx.fillText(p.couponPriceUi + "元", r.left, r.top);
        r = await page.nodeRect("#p1-2");
        ctx.setFontSize(36 / ratio);
        ctx.fillText("券", r.left, r.top);

        r = await page.nodeRect("#p1-3");
        ctx.setFontSize(54 / ratio);
        // ctx.font = `${62/ratio}px sans-serif bold;`
        ctx.fillText("+" + p.rebatePriceUi + "元", r.left, r.top);

        r = await page.nodeRect("#p1-4");
        ctx.setFillStyle("#fff");
        ctx.setFontSize(36 / ratio);
        ctx.fillText("返利", r.left, r.top);
        // ctx.restore()

        // 画标题二
        // 标题二背景
        r = await page.nodeRect("#goodsDetail");
        ctx.setFillStyle("#fff");
        ctx.fillRect(r.left, r.top, r.width, r.height);
        // 标题二文字
        r = await page.nodeRect("#p2-1");
        // ctx.font = `sans-serif ${28/ratio}px bold`
        ctx.setFontSize(28 / ratio);
        ctx.setFillStyle("#000");
        ctx.fillText(p.couponName, r.left, r.top);

        r = await page.nodeRect("#p2-2");
        // ctx.font = `${28/ratio} sans-serif`
        ctx.setFontSize(28 / ratio);
        ctx.fillText(p.goodsName1, r.left, r.top);

        r = await page.nodeRect("#p2-3");
        ctx.fillText(p.goodsName2, r.left, r.top);

        // 画标题三
        ctx.setTextBaseline("bottom");
        r = await page.nodeRect("#p3-1");
        ctx.setFontSize(26 / ratio);
        ctx.setFillStyle("#F92E0C");
        ctx.fillText("到手价：￥", r.left, r.top + r.height);

        r = await page.nodeRect("#p3-2");
        ctx.setFontSize(38 / ratio);
        ctx.setFillStyle("#F92E0C");
        ctx.fillText(p.showPriceIntUi, r.left, r.top + r.height);

        r = await page.nodeRect("#p3-3");
        ctx.setFontSize(26 / ratio);
        ctx.setFillStyle("#F92E0C");
        ctx.fillText(p.showPriceFloatUi, r.left, r.top + r.height);

        r = await page.nodeRect("#p3-4");
        ctx.setFontSize(26 / ratio);
        ctx.setFillStyle("#999");
        ctx.fillText(p.marketPriceUi, r.left, r.top + r.height);
        // 画删除线
        ctx.fillRect(r.left, r.top + r.height / 2, r.width, 1);

        r = await page.nodeRect("#p3-5");
        ctx.setFontSize(26 / ratio);
        ctx.setFillStyle("#999");
        ctx.fillText(p.saleTextUi, r.left, r.top + r.height);

        // 画tips
        ctx.setTextBaseline("top");
        r = await page.nodeRect("#p4-1");
        ctx.setTextAlign("center");
        ctx.setFontSize(30 / ratio);
        ctx.setFillStyle("#fff");
        ctx.fillText(
          page.data.QrcodeText1,
          r.left + r.width / 2,
          r.top
        );

        r = await page.nodeRect("#p4-2");
        ctx.setFontSize(30 / ratio);
        ctx.fillText(
          page.data.QrcodeText2,
          r.left + r.width / 2,
          r.top
        );

        // 画二维码
        r = await page.nodeRect("#Qrcode");
        ctx.save();
        ctx.beginPath(); //开始绘制
        ctx.arc(
          r.width / 2 + r.left,
          r.width / 2 + r.top,
          r.width / 2,
          0,
          Math.PI * 2,
          false
        );
        ctx.setLineWidth(0);
        // ctx.stroke(); //画空心圆
        ctx.closePath();
        ctx.clip();
        ctx.drawImage(QrcodeSrc, r.left, r.top, r.width, r.height);
        ctx.restore(); //恢复之前保存的绘图上下文 恢复之前保存的绘图问下文即状态

        console.log("开始绘制...");

        await page._drawCanvas({
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
  _drawCanvas({ canvasWidth = 680, canvasHeight = 1030, ctx }) {
    return new Promise((resolve, reject) => {
      // 绘制到canvas
      ctx.draw(true, () => {
        setTimeout(() => {
          cb();
        }, 300);
        const cb = () => {
          page.setData({
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
                page.posterPath = res.tempFilePath;
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
  // 生成前校验
  beforeSave() {
    return new Promise((resove, reject) => {
      if (!page.data.isQrcodeLoaded) {
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
    page.setData({
      isQrcodeLoaded: true
    });
  },
})