const app = getApp()
Component({
  properties: {
    needChooseCourse: {
      //是否需要选择课程  true 表示父组件为学校主页 false 表示父组件为活动详情
      type: Boolean,
      value: true,
    },
    loginShow: {
      //loginShow  预约课程弹窗状态 1登录 2选课程 3不用选课程 4填姓名手机号提交
      type: Number,
      value: 0,
    },
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

    appointBtn:function() {
      // 点击出发父组件事件并传值
      // 微信默认toast
      // wx.showToast({
      //   title: '333',
      //   icon: 'loading',
      //   duration: 1000
      // })
      var needLogin = true
      if (needLogin){
        this.triggerEvent('changeFLogin', {
          loginShow: 1
        })
      } else if (!needLogin && this.needChooseCourse){
        this.triggerEvent('changeFLogin', {
          loginShow: 2
        })
      }else{
        this.triggerEvent('changeFLogin', {
          loginShow: 3
        })
      }
    },
    
    //返回到首页
    // _backhome() {
    //   wx.switchTab({
    //     url: '/pages/index/index'
    //   })
    // }
  }
})