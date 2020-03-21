//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    //navbar
    // 导航头组件所需的参数
    nvabarData: {
      showCapsule: 1, //是否显示左上角图标   1表示显示    0表示不显示
      title: '搜索', //导航栏 中间的标题
      white: false, // 是就显示白的，不是就显示黑的。
      address: '' // 加个背景 不加就是没有
    },
    // 导航头的高度
    height: app.globalData.navheight,
    value: '',
    searchTheme: [
      {
        value:0,
        name: "古典舞"

      },
      {
        value: 1,
        name: "桥边姑娘"

      },
      {
        value: 2,
        name: "左手指月"

      },
      {
        value: 3,
        name: "独舞"

      },
      {
        value: 4,
        name: "下山"

      },
      {
        value: 5,
        name: "桃李杯"
      }]
  },
  onLoad: function () {
    wx.setNavigationBarColor({
      frontColor: '#000000',
      backgroundColor: '#fff'
    });
  },
})