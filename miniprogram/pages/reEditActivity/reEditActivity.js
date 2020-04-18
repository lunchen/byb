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
      title: '编辑活动', //导航栏 中间的标题
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
        "id": '',
        "latitude": '',
        "longitude": '',
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
      "freeFlg": '',
      "id": '',
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
      "joinLimitlessFlg": '',
      "name": "",
      "price": '',
      "startTime": "",
      "style": '',
      "totalJoin": ''
    },
    reEditData:{}
  },
  //事件处理函数
  goToSchoolHome: function() {
    wx.navigateTo({
      url: '../schoolHome/schoolHome'
    })
  },
  addBannerImg() {
    var that = this
    util.uploadImg("activityBill").then(res => {
      console.log(res)
      that.setData({
        [`reEditData.img`]: res.data.string
      })
    })
  },
  getIptMes: function (e) {
    // 获得动态下方编辑的数据
    var data = this.data.reEditData
    this.setData({
      [`reEditData`]: e.detail.mes,
    });
  },
  editVideoDesc: function (e) {
    // 跳转到视频编辑
    var data = JSON.stringify({
      key: e.currentTarget.dataset.key,
      list: this.data.reEditData.bannerList
    })
    wx.setStorageSync("addivList", data)
    wx.navigateTo({
      url: `../editVideoDesc/editVideoDesc`
    })
  },

  catchfn() {
    console.log(666)
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
      [`reEditData.${prevkey}`]: prevData
    })
    console.log(this.data)
  },
  setAddress(e) {
    console.log(e)
    var address = e.storeAddress
    // 地图页返回并执行的方法
    this.setData({
      [`reEditData.addr.addr`]: address.addr,
      [`reEditData.addr.longitude`]: address.longitude,
      [`reEditData.addr.latitude`]: address.latitude,
      [`reEditData.addr.name`]: address.title,
      [`reEditData.addr.district`]: address.district,
      [`reEditData.addr.city`]: address.city,
      [`reEditData.addr.place`]: address.province + address.city + address.district,
      [`reEditData.addr.province`]: address.province
    })
  },
  release(){
    console.log(this.data)
    var data = this.data.reEditData
    apiServer.post(`/app/activity/update`, data).then(res => {
      console.log(res)
      wx.showToast({
        title: '编辑成功',
        icon: 'loading',
        duration: 2000
      })

      setTimeout(() => {
        wx.switchTab({
          url: '../mine/mine'
        })
      }, 1000)
    })
  },
  onLoad: function (e) {
    wx.setNavigationBarColor({
      frontColor: '#000000',
      backgroundColor: '#fff'
    });
    var that = this;
    console.log(e)
    if(e.id){
      apiServer.post(`/app/activity/add/info/id/${e.id}`).then(res => {
        console.log(res.data)
        that.setData({
          reEditData: res.data.data
        })
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
  },
})
