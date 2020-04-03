// 活动搜索页
//activityListSearch.js
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
      title: '活动列表', //导航栏 中间的标题
      white: false, // 是就显示白的，不是就显示黑的。
      address: '' // 加个背景 不加就是没有
    },
    // 导航头的高度
    height: app.globalData.navheight,
    value: '',
    // 活动数据
    activityList: [

    ],
  },
  onChange(event) {
    this.setData({
      value: event.detail
    })
  },
  onSearch() {
    var that = this;
    let keyword = this.data.value
    apiServer.post('/app/activity/list', { keyword: keyword}).then(res => {
      console.log(res.data);
      that.setData({
        activityList: res.data.data.list,
      })
    })
  },
  onLoad: function () {
    var that = this;
    wx.setNavigationBarColor({
      frontColor: '#000000',
      backgroundColor: '#fff'
    });
    apiServer.post('/app/activity/list').then(res => {
      console.log(res.data);
      that.setData({
        activityList: res.data.data.list,
      })
    })
  },
  onShareAppMessage: function (ops) {
    var json = encodeURIComponent(JSON.stringify({ a: 1 }));
    if (ops.from === 'button') {
      // 来自页面内转发按钮
      console.log(ops.target)
    }
    return {
      title: '报一报',
      path: '/pages/activityListSearch/activityListSearch',
      imageUrl: "",
      success: function (res) {
        // 转发成功
        console.log("转发成功:" + JSON.stringify(res));

      },
      fail: function (res) {
        // 转发失败
        console.log("转发失败:" + JSON.stringify(res));
      }
    }

  },
})
