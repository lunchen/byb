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
    req: {
      "keyword": "",
      "nub": 1,
      "size": 6
    },
    refresherTriggered: false,
    loadingMore: false,
    loadingMoreText: "加载中..."
  },
  onChange(event) {
    this.setData({
      "req.keyword": event.detail
    })
  },
  onSearch() {
    this.getData()
  },
  getMore() {
    var that = this
    this.setData({
      "req.nub": this.data.req.nub + 1,
      loadingMore: true
    })
    apiServer.post('/app/activity/list', this.data.req).then(res => {
      console.log(res.data);
      var newList = that.data.activityList
      if (res.data.data.list.length > 0) {
        newList.push(...res.data.data.list)
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
  renewData(){
    this.setData({
      "req.nub": 1,
      activityList: [],
      loadingMore: false
    })
    setTimeout(()=>{
      this.getData()
    },1000)
  },
  onLoad: function () {
    var that = this;
    wx.setNavigationBarColor({
      frontColor: '#000000',
      backgroundColor: '#fff'
    });
    if (this.data.req.nub == 1) {
      this.getData()
    }
  },
  getData(){
    var that = this
    apiServer.post('/app/activity/list',this.data.req).then(res => {
      console.log(res.data);
      that.setData({
        activityList: res.data.data.list,
        refresherTriggered: false
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
