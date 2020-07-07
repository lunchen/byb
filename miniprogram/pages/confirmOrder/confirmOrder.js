// 订单确认页
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
      title: '确认订单', //导航栏 中间的标题
      white: '', // 是就显示白的，不是就显示黑的。
      address: '', // 加个背景 不加就是没有
    },

    // 导航头的高度
    height: app.globalData.navheight,
    isIphoneX: app.globalData.isIphoneX,
    orderData:{},
    orderNo:'',
  },
  onLoad: function (e) {

    var that = this;
    wx.setNavigationBarColor({
      frontColor: '#000000',
      backgroundColor: '#fff'
    });
    let orderNo = e ? e.orderNo : '';
    that.setData({
      orderNo: orderNo
    })
    if (orderNo) {
      apiServer.post(`/app/order/info/id/${orderNo}`).then(res => {
        that.setData({
          orderData: res.data.data
        })
      })
    }
  },
  payBtn() {
    var _this = this,
        orderNo = _this.data.orderNo;
    if (this.data.orderData.price==0){
      wx.showToast({
        title: '',
        icon: 'loading',
        duration: 1000
      })
      setTimeout(() => {
        wx.navigateTo({
          url: `../signUpSuccess/signUpSuccess?orderNo=${orderNo}`,
        })
      }, 1500)
      return
    }
    var req = {
      "openId": wx.getStorageSync("openId"),
      "orderNo": orderNo
    }
    apiServer.post(`/app/order/unifiedorder`,req).then(res => {
      wx.requestPayment(
        {
          'timeStamp': JSON.stringify(res.data.data.timeStamp),
          'nonceStr': res.data.data.nonceStr,
          'package': res.data.data.packages,
          'signType': res.data.data.signType,
          'paySign': res.data.data.paySign,
          'success': function (res) {
            console.log("success")
            wx.showToast({
              title: '支付成功',
              icon: 'none',
              duration: 2000
            })
            setTimeout(()=>{
              wx.navigateTo({
                url: `../signUpSuccess/signUpSuccess?orderNo=${orderNo}`,
              })
            },1500)
           
           },
          'fail': function (res) { 
            wx.showToast({
              title: '支付已取消',
              icon: 'none',
              duration: 2000
            })
          },
          'complete': function (res) {
           }
        })
    })
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