const app = getApp()
Component({
  properties: {
    ashowType: {
      //ashowType   由父页面传递的数据，变量名字自命名
      type: Boolean,
      value: true,
      observer: function (newVal, oldVal) { }
    }
  },
  data: {
    qrCodeUrl: "./icon/qrCode.png",  //要改成线上图片
    showType: false,
    display: false
  },
  attached: function () {
    // 获取是否是通过分享进入的小程序
    this.setData({
      share: app.globalData.share
    })
    // 定义导航栏的高度   方便对齐
    this.setData({
      height: app.globalData.height
    })
  },
  methods: {
    // 返回上一页面
    _navback() {
      wx.navigateBack()
    },
    // 计算图片高度
    imgLoaded(e) {
      this.setData({
        imageHeight:
          e.detail.height *
          (wx.getSystemInfoSync().windowWidth / e.detail.width)
      })
    },
    onTransitionEnd: function(){
      var _this = this
      setTimeout(function () { 
        if (!_this.data.showType && _this.data.display) {
          _this.setData({ display: false });
        }
       }, 300);
    },
    previewImg: function (e) {
      var imgArr = [this.data.qrCodeUrl];
      wx.previewImage({
        current: imgArr[0],     //当前图片地址
        urls: imgArr,               //所有要预览的图片的地址集合 数组形式
        success: function (res) { },
        fail: function (res) { },
        complete: function (res) { },
      })
    },

    closeBtn: function () {
      this.setData({
        "showType": false
      });
      this.onTransitionEnd();
    },
    showBtn: function () {
      var _this = this;
      this.setData({
        "display": true
      })
      setTimeout(function () {
        _this.setData({
          "showType": true,
        })
      }, 20);
    },
    //返回到首页
    // _backhome() {
    //   wx.switchTab({
    //     url: '/pages/index/index'
    //   })
    // }
  }
})