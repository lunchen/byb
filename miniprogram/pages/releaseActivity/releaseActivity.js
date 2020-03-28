// 发布活动
// releaseActivity.js
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
      title: '发活动', //导航栏 中间的标题
      white: false, // 是就显示白的，不是就显示黑的。
      address: '', // 加个背景 不加就是没有
    },
    
    // 导航头的高度
    height: app.globalData.navheight,
    activityModel:{
      "addr": {
        "addr": "",
        "city": "",
        "district": "",
        "id": 0,
        "latitude": 0,
        "longitude": 0,
        "name": "",
        "place": "",
        "placeNo": "",
        "province": ""
      },
      "bannerList": [
        // {
        //   "activityId": 0,
        //   "id": 0,
        //   "imgNo": "",
        //   "remark": "",
        //   "title": "",
        //   "type": 0,
        //   "url": ""
        // }
      ],
      "endTime": "",
      "freeFlg": 0,
      "id": 0,
      "imgList": [
        // {
        //   "id": 0,
        //   "imgNo": "",
        //   "remark": "",
        //   "title": "",
        //   "type": 0,
        //   "url": ""
        // }
      ], 
      "joinLimitlessFlg": 0,
      "name": "",
      "price": '',
      "startTime": "",
      "style": 0,
      "totalJoin": ''
    }
  },
  //事件处理函数
  goToSchoolHome: function() {
    wx.navigateTo({
      url: '../schoolHome/schoolHome'
    })
  },
  getIptMes: function (e) {
    // 获得动态下方编辑的数据
    var data = this.data.activityModel
    this.setData({
      [`activityModel`]: e.detail.mes,
    });
  },
  editVideoDesc: function (e) {
    // 跳转到视频编辑
    var data = JSON.stringify({
      key: e.currentTarget.dataset.key,
      list: this.data.activityModel.bannerList
    })
    wx.setStorageSync("addivList", data)
    wx.navigateTo({
      url: `../editVideoDesc/editVideoDesc`
    })
  },
  backFn(e) {
    // 活动视频编辑后返回从storage获取单前编辑的新活动图片信息
    console.log(e)
    let getData = JSON.parse(wx.getStorageSync("addivList"));
    let prevData = getData.list;
    let prevkey = getData.key;
    console.log('发布')
    console.log(getData)
    this.setData({
      [`activityModel.${prevkey}`]: prevData
    })
    console.log(this.data)
  },
  setAddress(e) {
    console.log(e)
    var address = e.storeAddress
    // 地图页返回并执行的方法
    this.setData({
      [`activityModel.addr.addr`]: address.addr,
      [`activityModel.addr.longitude`]: address.longitude,
      [`activityModel.addr.latitude`]: address.latitude,
      [`activityModel.addr.name`]: address.title,
      [`activityModel.addr.district`]: address.district,
      [`activityModel.addr.city`]: address.city,
      [`activityModel.addr.place`]: address.province + address.city + address.district,
      [`activityModel.addr.province`]: address.province
    })
  },
  release(){
    console.log(this.data)
    var data = this.data.activityModel
    apiServer.post(`/app/activity/add`, data).then(res => {
      console.log(res)
    })
  },
  onLoad: function (e) {
    wx.setNavigationBarColor({
      frontColor: '#000000',
      backgroundColor: '#fff'
    });
    var that = this;
    if(e.id){
      apiServer.post(`/app/activity/info/${e.id}`).then(res => {
        console.log(res)
      })
    }
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }
})
