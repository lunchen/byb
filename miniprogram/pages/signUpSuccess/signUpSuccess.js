// 报名成功分享页
// signUpSuccess.js
const util = require('../../utils/util.js')
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
    show:true
  },
  showPopup() {
    this.setData({ show: true });
  },

  onClose() {
    this.setData({ show: false });
  },

  onLoad: function (options) {

    var that = this;
    wx.setNavigationBarColor({
      frontColor: '#000000',
      backgroundColor: '#ffffff'
    });
    console.log(6666)
    console.log(options)

    // wx.could.init();
    // const db = wx.cloud.database();

    // db.collection('region').limit(1).get()
    //   .then(res => {
    //     if (res.data && res.data.length > 0) {
    //       this.setData({
    //         areaList: res.data[0]
    //       });
    //     }
    //   })
    //   .catch(err => {
    //     console.log(err);
    //   });
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
    console.log(123123)
    console.log(ops)
    if (ops.from === 'button') {
      // 来自页面内转发按钮
      console.log(ops.target)
    }
    return {
      title: '分享卡片',
      path: '/pages/signUpSuccess/signUpSuccess?share=' + json,
      imageUrl: "../../images/huodong.png",
      success: function (res) {
        // 转发成功
        console.log("转发成功:" + JSON.stringify(res));

      },
      fail: function (res) {
        // 转发失败
        console.log("转发失败:" + JSON.stringify(res));
      }
    }
    // console.log(123)
    // var options = {
    //   title:123,
    //   path:'',
    //   imageUrl: 'https://enlist-dev.oss-cn-hangzhou.aliyuncs.com/test/2020/03/21/logo.png'
    // }
    // wx.onShareAppMessage(options)

  },
})