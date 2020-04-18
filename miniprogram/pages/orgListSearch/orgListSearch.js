// 机构列表
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
    orgList: [],
    req :{
      "keyword": '',
      "nub": 0,
      "size": 6
    }
  },
  onChange(event) {
    this.setData({
      "req.keyword": event.detail
    })
  },
  renewData(){
    this.setData({
      "req.nub": 0,
      orgList:[]
    })
  },
  onSearch(){
    this.getData()
  },
  comingTo(options) {
    var data = {}
    var strs = decodeURIComponent(options.scene)
    var pages = getCurrentPages()
    var currentPage = pages[pages.length - 1]
    console.log(currentPage.options)
  },
  onLoad: function (e) {
    var that = this;
    // this.comingTo(e)
    wx.setNavigationBarColor({
      frontColor: '#000000',
      backgroundColor: '#fff'
    });
    this.getData()
  },
  getData(){
    var that = this
    apiServer.post('/app/org/list/seach', this.data.req).then(res => {
      console.log(res.data);
      that.setData({
        orgList: res.data.data.list,
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
      title: '报1 报',
      path: '/pages/orgListSearch/orgListSearch',
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
