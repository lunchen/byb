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
      title: '发活动', //导航栏 中间的标题
      white: false, // 是就显示白的，不是就显示黑的。
      address: '', // 加个背景 不加就是没有
    },
    
    // 导航头的高度
    height: app.globalData.navheight,
    activityModel1:{
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
      "addrVoList": [],
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
      "style": 0,
      "totalJoin": '',
      "amount":'',
      "amountFlg":0,
      "rate":'',
      "rateFlg":0,
      "shareFlg":0,
    },
    activityModel:{

    },
    type:1,
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
      list: this.data.activityModel.bannerList,
      hiddenTitle: true
    })
    wx.setStorageSync("addivList", data)
    wx.navigateTo({
      url: `../editVideoDesc/editVideoDesc`
    })
  },
  catchfn(){
    console.log(666)
  },
  chooseimage: function() {
    var that = this;
    wx.showActionSheet({
      itemList: ['拍照', '手机相册' , '模板模板'],
      itemColor: "#000",
      success: function(res) {
        console.log(res)
        if (!res.cancel) {
          if (res.tapIndex == 0) {
            // that.chooseWxImage('camera')
          } else if (res.tapIndex == 1) {
            // that.chooseWxImage('album')
          } else if (res.tapIndex == 2) {
            // that.chooseWxImage('camera')
          }
        }
      }
    })
 
  },

  addBannerImg(){
    var that = this
    util.uploadImg("activityBill").then(res => {
      console.log(res)
      that.setData({
        [`activityModel.img`]: res.data.string
      })
    })
  },
  backFn(e) {
    // 活动视频编辑后返回从storage获取单前编辑的新活动图片信息
    let getData = JSON.parse(wx.getStorageSync("addivList"));
    let prevData = getData.list;
    let prevkey = getData.key;
    this.setData({
      [`activityModel.${prevkey}`]: prevData
    })
  },
  setAddress(e) {
    console.log(e)
    var index = e.index
    var addrNo = e.addrNo
    var address = e.storeAddress
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
    var data = JSON.parse(JSON.stringify(this.data.activityModel))
    data.type = this.data.type
5
    console.log(data)
    if(data.img){

    }else{
      wx.showToast({
        title: '请上传活动封面',
        icon: 'none',
        duration: 2000
      })
      return
    } 
    data.addrList = []
    if (data.addrVoList.length==0){
     
    }else{
      data.addrVoList.forEach(item => {
        data.addrList.push(item.addrNo)
      })
      delete data.addrVoList
    }
    
    apiServer.post(`/app/activity/add`, data).then(res => {
      wx.showToast({
        title: '发布成功',
        icon: 'none',
        duration: 2000
      })
      that.setData({
        activityModel: JSON.parse(JSON.stringify(this.data.activityModel1))
      })
      setTimeout(()=>{
        wx.switchTab({
          url: '../index/index'
        })
      },1000)
    }).catch(err=>{
      console.log(err)
      wx.showToast({
        title: err.data.msg,
        icon: 'none',
        duration: 2000
      })
    })
  }),
  onLoad: function (e) {
    wx.setNavigationBarColor({
      frontColor: '#000000',
      backgroundColor: '#fff'
    });
    var that = this;
    this.setData({
      activityModel: JSON.parse(JSON.stringify(this.data.activityModel1))
    })
    // 线上为type 2  线下为1
    let type = e.type ? e.type : 1;
    this.setData({
      type: type
    })
    if(type == 2){
      this.setData({
        "nvabarData.title": "发布线上活动"
      })
    }
  },
 
})
