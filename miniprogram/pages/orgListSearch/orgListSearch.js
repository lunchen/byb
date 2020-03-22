//orgListSearch.js
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
      title: '机构列表', //导航栏 中间的标题
      white: false, // 是就显示白的，不是就显示黑的。
      address: '' // 加个背景 不加就是没有
    },
    // 导航头的高度
    height: app.globalData.navheight,
    value: '',
    orgList: []
  },
  onChange(event) {
    this.setData({
      value: event.detail
    })
  },
  onSearch(){
    console.log(this.data.value)
  },
  onLoad: function () {
    var that = this;
    wx.setNavigationBarColor({
      frontColor: '#000000',
      backgroundColor: '#fff'
    });
    apiServer.post('/app/org/list/index/select/0').then(res => {
      console.log(res.data);
      that.setData({
        orgList: res.data.data.list,
      })
    })
  },
})
