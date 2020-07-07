// 核销页
// writeOffOrder.js
const util = require('../../utils/util.js');
const apiServer = require('../../api/request.js');
//获取应用实例
const app = getApp()
Page({
  data: {
    //navbar
    // 导航头组件所需的参数
    nvabarData: {
      showCapsule: 1, //是否显示左上角图标   1表示显示    0表示不显示
      title: '核销订单', //导航栏 中间的标题
      white: '', // 是就显示白的，不是就显示黑的。
      address: '', // 加个背景 不加就是没有
    },

    // 导航头的高度
    height: app.globalData.navheight,
    isIphoneX: app.globalData.isIphoneX,
    confirmShow:false,
    orderData:'',
    writeOffOrderNo:''
  },
  showConfirm() {
    this.setData({
      confirmShow: true
    })
  },
  onCloseAll(){
    this.setData({
      confirmShow: false
    })
  },
  confirm(){
    this.writeOff()
  },
  onLoad: function (e) {
    var that = this;
    wx.setNavigationBarColor({
      frontColor: '#000000',
      backgroundColor: '#fff'
    }); 
    let orderNo = e ? e.orderNo : '';
    if (orderNo) {
      that.setData({
        writeOffOrderNo: orderNo,
        orderData: JSON.parse(wx.getStorageSync("scanData"))
      })
      // apiServer.post(`/app/order/info/qrCode/${orderNo}`).then(res => {
      //   console.log(res.data);
      //   that.setData({
      //     writeOffOrderNo: orderNo,
      //     orderData: res.data.data
      //   })
      // })
    }
  },
  writeOff(){
    // 核销订单
    wx.showToast({
      title: '订单核销:',
      icon: 'loading',
      duration: 5000
    })
    apiServer.post(`/app/my/org/order/off/${this.data.writeOffOrderNo}`).then(res => {
      wx.showToast({
        title: '核销成功,正在返回首页',
        icon: 'loading',
        duration: 2000
      })
      setTimeout(()=>{
        wx.switchTab({
          url: '../index/index'
        });
      },1500)
    }).catch(err=>{
      console.log(err)
      wx.showToast({
        title: '核销失败：' + err.data.msg,
        icon: 'none',
        duration: 4000
      })
    })
    this.onCloseAll()
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
})