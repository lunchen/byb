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
  goToIndex(){
    wx.switchTab({
      url: '../index/index',
    })
  },
  previewImage: function (e) {
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
    let orderNo = e ? e.orderNo : "";
    if (orderNo) {
      apiServer.post(`/app/order/info/id/${orderNo}`).then(res => {
        if (res.data.data.infoDetailList[0].activity.id === 0){
          var id = res.data.data.infoDetailList[0].org.id
          var isdefault = true
        }else{
          var id = res.data.data.infoDetailList[0].activity.id
          var isdefault = false
        }
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
  },
  // 生成朋友圈图片
  shareFriend() {
    // isdefault:true 分享 机构的 false 活动的
    if(this.data.isdefault){
      this.getPoster1()
    }else{
      this.getPoster()
    }
  },

  getPoster1() {
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

  getPoster() {
    var _this = this
    wx.showToast({
      title: '图片生成中~',
      icon: 'loading',
      duration: 2000
    })
    apiServer.post(`/app/activity/poster/${this.data.id}`, '', 'get').then(res => {
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