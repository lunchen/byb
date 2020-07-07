// 订单详情
// orderDetails.js
const util = require('../../utils/util.js')
const apiServer = require('../../api/request.js');
var cdata = 0
//获取应用实例
const app = getApp()
Page({
  data: {
    //navbar
    // 导航头组件所需的参数
    nvabarData: {
      showCapsule: 1, //是否显示左上角图标   1表示显示    0表示不显示
      title: '订单详情', //导航栏 中间的标题
      white: '', // 是就显示白的，不是就显示黑的。
      address: '', // 加个背景 不加就是没有
    },

    // 导航头的高度
    height: app.globalData.navheight,
    isIphoneX: app.globalData.isIphoneX,
    orderDetails:[],
    showTime:'00:00:00:00',
    canCalc:true,
    sti:'',
    orderNo: ''
  },
  onLoad: function (e) {
    wx.setNavigationBarColor({
      frontColor: '#000000',
      backgroundColor: '#fff'
    });
    var that = this;
    let orderNo = e ? e.orderNo : '';
    if (orderNo) {
      that.setData({
        orderNo: orderNo
      })
      
    }
  },
  goToETicket(e) {
    var orderNo = e.currentTarget.dataset.orderno
    wx.navigateTo({
      url: `../eTicket/eTicket?orderNo=${orderNo}`,
    })
  },
  copy() {
  
    wx.setClipboardData({
      data: this.data.orderDetails.group.groupUrl,
      success: function (res) {
        wx.getClipboardData({
          success: function(res) {
            wx.showToast({
              title: '活动链接复制成功，赶快邀请好友参与拼团吧~',
              icon: "none"
            })
          }
        })
      }
    })
  },
  countTime(){
    var that = this
    var countDownFn = (e)=>{
      var time = parseInt(e / 10)
      var timeList = [];
      if (time > 0 && that.data.canCalc) {
        timeList[0] = parseInt(time / 60 / 60 / 100);
        time = time - timeList[0] * 60 * 60 * 100;
        timeList[0] = timeList[0] < 10 ? '0' + timeList[0] : timeList[0];
        timeList[1] = parseInt(time / 60 / 100);
        time = time - timeList[1] * 60 * 100;
        timeList[1] = timeList[1] < 10 ? '0' + timeList[1] : timeList[1];
        timeList[2] = parseInt(time / 100);
        time = time - timeList[2] * 100;
        timeList[2] = timeList[2] < 10 ? '0' + timeList[2] : timeList[2];
        timeList[3] = time;
        timeList[3] = timeList[3] < 10 ? '0' + timeList[3] : timeList[3];
        return timeList.join(':');
      }
    }
    that.setData({
      sti: setInterval(function () {
        cdata = cdata - 10
        that.setData({
          showTime: countDownFn(cdata)
        })
      }, 10)
    })
  },
  onReady: function () {

  },
  onShow: function () {
    let that = this
    apiServer.post(`/app/order/info/id/${this.data.orderNo}`).then(res => {
      console.log(res.data);
      that.setData({
        orderDetails: res.data.data,
      })
      cdata = that.data.orderDetails.group.millisecond
      if (that.data.orderDetails.group && that.data.orderDetails.group.millisecond>0){
        setTimeout(() => {
          that.countTime()
        }, 1000)
      }
    })
  },
  onHide: function () {
    clearInterval(this.data.sti)
  },
  onUnload: function () {
    clearInterval(this.data.sti)
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