// 底部报名 客服 预约 按钮
const apiServer = require('../../api/request.js');
const app = getApp()
Component({
  properties: {
    type: {   // 1线下活动 2线上活动
      type: Number | String,
      value: 1,
    },
    needChooseCourse: {
      //是否需要选择课程  true 表示父组件为学校主页需要选 false 表示父组件为活动详情不用选
      type: Boolean,
      value: false,
    },
    loginShow: {
      //loginShow  预约课程弹窗状态  1选课程 2不用选课程
      type: Number,
      value: 0,
    },
    wxqecode:{
      //wxqecode  微信图片
      type: String,
      value: '',
    },
    telephone:{
      //telephone  联系的手机号
      type: String,
      value: '',
    },
  },
  data: {
    qrCodeUrl: "./icon/qrCode.png",  //要改成线上图片
    showType: false,   // 客服小弹窗bg显示控制
    display: false,   // 客服小弹窗显示控制
  },
  attached: function () {
    // 获取是否是通过分享进入的小程序
    this.setData({
      share: app.globalData.share
    })
    var _this = this
    
  },
  onLoad(){
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
      var imgArr = [this.data.wxqecode];
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
    shareFriend:function(e){
      this.triggerEvent('shareFriend', {})
    },
    appointBtn:function(e) {
      // 打开触发父组件打开报名弹窗
      this.freeBtn(e)
      if (this.data.needChooseCourse) {
        this.triggerEvent('changeFLogin', {
          loginShow: 1
        })
      } else {
        this.triggerEvent('changeFLogin', {
          loginShow: 2
        })
      }
    },
    freeAppointBtn: function (e) {
      // 打开触发父组件打开报名弹窗
      this.freeBtn(e)
      this.triggerEvent('changeFLogin', {
        loginShow: 3
      })
    },
    freeBtn(e){
      this.triggerEvent('changeSignUpType', {
        signUpType: e.currentTarget.dataset.freetype
      })
    },
    makePhoneCall: function () {
      var that = this
      wx.makePhoneCall({
        phoneNumber: that.data.telephone,
        success: function () {
          console.log('拨打成功')
        },
        fail: function () {
          console.log('拨打失败')
        }
      })
    },
    //返回到首页
    // _backhome() {
    //   wx.switchTab({
    //     url: '/pages/index/index'
    //   })
    // }
  }
})