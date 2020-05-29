// 中间发布按钮跳转页
// pages/middle/middle.js

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
      showCapsule: 0, //是否显示左上角图标   1表示显示    0表示不显示
      title: '发布', //导航栏 中间的标题
      white: '', // 是就显示白的，不是就显示黑的。
      address: '', // 加个背景 不加就是没有
    },
    height: app.globalData.navheight,
    isIphoneX: app.globalData.isIphoneX,
    //tabbar
    tabbar: {},
  },
  // 修改函数节流
  goToRelease: util.throttle(function (e){
    let type = e.currentTarget.dataset.type
    var identity = wx.getStorageSync('identity') ? wx.getStorageSync('identity') : 1;
      if (identity == 1) {
        wx.showToast({
          title: '暂不支持参与者发布活动',
          icon: 'none',
          duration: 1000
        })
        setTimeout(() => {
          wx.navigateTo({
            url: '../business/business'
          })
        }, 1000)
      } else {
        wx.navigateTo({
          url: `../releaseActivity/releaseActivity?type=${type}`
        })
      }
  }, 1000),
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    this.setData({
      tabbar: app.editTabbar()
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