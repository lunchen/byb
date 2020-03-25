// 电子票
// pages/mine/mine.js
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
      title: '电子票', //导航栏 中间的标题
      white: 'white', // 是就显示白的，不是就显示黑的。
      address: '../../images/home_8@2x.png', // 加个背景 不加就是没有
    },

    // 导航头的高度
    height: app.globalData.navheight,
    isIphoneX: app.globalData.isIphoneX,
    qrCodeUrl: "",  //要改成线上图片
    eTicketData:{}
  },

  onClose() {
    this.setData({ show: false });
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
  onLoad: function (e) {
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: '#000000'
    });
    var _this = this;
    console.log(e)
    let orderNo = e.orderNo ? e.orderNo : 1;
    if (orderNo) {
      apiServer.post(`/app/my/user/qrCode/orderNo/${orderNo}`).then(res => {
        console.log(res.data);
        _this.setData({
          eTicketData: res.data.data,
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
  onShareAppMessage: function () {

  }
})