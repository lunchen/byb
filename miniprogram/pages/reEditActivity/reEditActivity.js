// 发布活动
// releaseActivity.js
const util = require('../../utils/util.js')
const apiServer = require('../../api/request.js');
//获取应用实例
const app = getApp()

Page({
  data: {
    //navbar
    navbarShow: true,
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
    reEditData: {},
    newAddr: {
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
    }, //选择地址后赋值传入组件
  },
  onBindfullscreenchange(e) {
    this.setData({
      navbarShow: !this.data.navbarShow
    })
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
      list: this.data.reEditData.bannerList,
      hiddenTitle: true
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
    let getData = JSON.parse(wx.getStorageSync("addivList"));
    let prevData = getData.list;
    let prevkey = getData.key;
    this.setData({
      [`reEditData.${prevkey}`]: prevData
    })
  },
  setAddress(e) {
    console.log(e)
    var index = e.index
    var addrNo = e.addrNo
    var address = e.storeAddress
    // 地图页返回并执行的方法
    this.setData({
      [`newAddr.addr`]: address.addr,
      [`newAddr.addrNo`]: addrNo,
      [`.newAddr.city`]: address.city,
      [`.newAddr.district`]: address.district,
      [`.newAddr.longitude`]: address.longitude,
      [`.newAddr.latitude`]: address.latitude,
      [`.newAddr.name`]: address.title,
      [`.newAddr.place`]: address.province + address.city + address.district,
      [`.newAddr.province`]: address.province,
    })
    // this.setData({
    //   [`reEditData.addr.addr`]: address.addr,
    //   [`reEditData.addr.longitude`]: address.longitude,
    //   [`reEditData.addr.latitude`]: address.latitude,
    //   [`reEditData.addr.name`]: address.title,
    //   [`reEditData.addr.district`]: address.district,
    //   [`reEditData.addr.city`]: address.city,
    //   [`reEditData.addr.place`]: address.province + address.city + address.district,
    //   [`reEditData.addr.province`]: address.province
    // })
  },
  release: util.throttle(function () {
    var that = this
    wx.showToast({
      mask: true,
      icon: 'loading',
      duration: 10000
    })
    if (app.globalData.isLinking) {
      console.log("loading")
      setTimeout(() => {
        that.release()
      }, 500)
      return
    }
    var data = this.data.reEditData
    data.addrList = []
    data.addrVoList.forEach(item => {
      if (item.addrNo){
        data.addrList.push(item.addrNo)
      }else{
        data.addrList.push(item.placeNo)
      }
    })
    delete data.addrVoList
    if(data.imgList==''){
      data.imgList = []
    }
    apiServer.post(`/app/activity/update`, data).then(res => {
      wx.showToast({
        title: '编辑成功',
        icon: 'loading',
        duration: 2000
      })

      setTimeout(() => {
        that.pageBack()
      }, 1000)
    })
  }),
  pageBack(){
    let pages = getCurrentPages(); //获取当前页面js里面的pages里的所有信息。
    let prevPage = pages[pages.length - 2];
    wx.navigateBack({
      // 返回并执行上一页面方法
      success: function () {
        prevPage.onLoad() // 执行前一个页面的方法
      }
    });
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
        that.setData({
          reEditData: res.data.data
        })
      })
    }
  },
  getUserInfo: function(e) {
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
})
