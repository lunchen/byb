// pages/getAuth/getAuth.js

const util = require('../../utils/util.js');
//获取应用实例
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //navbar
    // 导航头组件所需的参数
    nvabarData: {
      showCapsule: 1, //是否显示左上角图标   1表示显示    0表示不显示
      title: '微信授权登录', //导航栏 中间的标题
      white: '', // 是就显示白的，不是就显示黑的。
      address: '../../images/logintop.png', // 加个背景 不加就是没有
    },
    height: app.globalData.navheight,
    isIphoneX: app.globalData.isIphoneX,
    //tabbar
    tabbar: {},
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    showView: false,
  },
  // 修改函数节流
  goToGetAuthLogin: util.throttle(function (e){
    wx.navigateTo({
      url: `../getAuthLogin/getAuthLogin`
    })
  }, 2000),

  getuserinfo(e) {
    // 微信一键登录获取用户信息 提示授权
    var _this = this
    wx.getSetting({
      success(res) {
        if (res.authSetting['scope.userInfo']) {
          _this.goToGetAuthLogin()
        }
      }
    })
  },
  back(){
    wx.navigateBack()
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this
    this.setData({
      tabbar: app.editTabbar()
    })
    // 微信一键登录获取用户信息 提示授权
    wx.getSetting({
      success(res) {
        if (res.authSetting['scope.userInfo']) {
          _this.goToGetAuthLogin()
        }else{
          _this.setData({
            showView: true
          })
        }
      },fail(err) {
        _this.setData({
          showView: true
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    wx.hideTabBar()
    var needBack
    if (wx.getStorageSync("needBack") == ''){
      needBack = wx.getStorageSync("needBack")
    }else{
      needBack = JSON.parse(wx.getStorageSync("needBack"))
    }
    if (needBack == true) {
      wx.navigateBack({
      })
    }
    wx.setStorageSync("needBack", false)
   
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
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
})