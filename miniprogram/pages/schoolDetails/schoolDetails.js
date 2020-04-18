// 学校详情页
//schoolDetails.js
const util = require('../../utils/util.js')
const apiServer = require('../../api/request.js');
//获取应用实例
const app = getApp()

Page({
  data: {
    //navbar
    // 导航头组件所需的参数
    nvabarData: {
      backreload: true, // 该页面返回的上一个页面是否刷新
      showCapsule: 1, //是否显示左上角图标   1表示显示    0表示不显示
      title: '学校详情', //导航栏 中间的标题
      white: false, // 是就显示白的，不是就显示黑的。
      address: '' // 加个背景 不加就是没有
    },
    // 导航头的高度
    height: app.globalData.navheight,

    active: 0,
    schoolDetails: {},

    loginShow: 4,
    id:'',
    activeid:"-1"
  },
  onPlay(e) {
    console.log(e)
    this.setData({
      activeid: e.detail.activeId
    })
  },
  //事件处理函数
  goToSchoolHome: function (e) {
    var id = e.currentTarget.dataset.id
    util.setId(id)
    wx.navigateTo({
      url: `../schoolHome/schoolHome?id=${id}`
    })
  },
  methods: {
  },
  onLoad: function (e) {
    wx.setNavigationBarColor({
      frontColor: '#000000',
      backgroundColor: '#fff'
    });
    var that = this;
    let id = e.id ? e.id : '';
    if (e.scene) {
      var strs = decodeURIComponent(e.scene)
      id = strs.split("=")[1]
    }
    this.setData({
      id:id
    })
    if (id) {
      this.getData()
    }
  },
  getData(){
    var that = this
    apiServer.post(`/app/org/info/${this.data.id}`).then(res => {
      console.log(res.data);
      that.setData({
        schoolDetails: res.data.data,
      })
    })
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
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
      path: '/pages/schoolDetails/schoolDetails?id=' + this.data.id,
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
