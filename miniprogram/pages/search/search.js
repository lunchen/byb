// 搜索页
// search.js
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
      title: '搜索', //导航栏 中间的标题
      white: false, // 是就显示白的，不是就显示黑的。
      address: '' // 加个背景 不加就是没有
    },
    // 导航头的高度
    height: app.globalData.navheight,
    value: '',
    searchTheme: [],
    
    activityList: [],
    req: {
      "keyword": "",
      "nub": 1,
      "size": 6
    },
    refresherTriggered: false,
    loadingMore: false,
    loadingMoreText: "加载中...",
  },
  getHot(){
    var that = this
    apiServer.post('/app/search/hot').then(res => {
      that.setData({
        searchTheme: res.data.data.list
      })
    })
  },
  hotSearch(event) {
    var that = this;
    let keyword = event.currentTarget.dataset.keyword;
    this.setData({
      value: keyword
    })
    apiServer.post('/app/search/search', {keyword: keyword}).then(res => {
      that.setData({
        activityList: res.data.data.activity.list,
      })
    })
  },
  change(event){
    this.setData({
      value: event.detail
    })
  },

  getMore() {
    var that = this
    this.setData({
      "req.nub": this.data.req.nub + 1,
      loadingMore: true
    })
    apiServer.post('/app/search/search', this.data.req).then(res => {
      var newList = that.data.activityList
      if (res.data.data.activity.list.length > 0) {
        newList.push(...res.data.data.activity.list)
        that.setData({
          activityList: newList,
          loadingMore: false,
          loadingMoreText: "加载中..."
        })
      } else {
        that.setData({
          loadingMoreText: "已经到底了"
        })
      }
    })
    console.log("刷新")
  },
  renewData() {
    this.setData({
      "req.nub": 1,
      activityList: [],
      loadingMore: false
    })
    setTimeout(() => {
      this.onSearch()
    }, 1000)
  },
  onSearch(event){

    var that = this;
    this.setData({
      'req.keyword': this.data.value,
      'req.nub':1,
      refresherTriggered: false
    })
    apiServer.post('/app/search/search', this.data.req).then(res => {
      that.setData({
        activityList: res.data.data.activity.list,
      })
    })
  },
  onCancel() {
    wx.navigateBack()
  },
  onLoad: function () {
    var that = this;
    wx.setNavigationBarColor({
      frontColor: '#000000',
      backgroundColor: '#fff'
    });
    this.getHot()
  },
  onShareAppMessage: function (ops) {
    var json = encodeURIComponent(JSON.stringify({ a: 1 }));
    if (ops.from === 'button') {
      // 来自页面内转发按钮
      console.log(ops.target)
    }
    return {
      title: '报1 报',
      path: '/pages/search/search',
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
