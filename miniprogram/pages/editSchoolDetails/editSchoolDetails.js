// 学校页详情编辑
// editSchoolDetails.js
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
      title: '学校详情页编辑', //导航栏 中间的标题
      white: false, // 是就显示白的，不是就显示黑的。
      address: '' // 加个背景 不加就是没有
    },
    // 导航头的高度
    height: app.globalData.navheight,

    active: 0,
    id : "",
    "name": "",
    "remark": "", //简介
    "activityListModel": {
        "addr": {
          "addr": "",
          "id": 0,
          "latitude": 0,
          "longitude": 0,
          "name": "",
          "place": "",
          "placeNo": ""
        },
        "endTime": "",
        "id": 0,
        "img": "",
        "name": "",
        "statusName": ""
      },
    "envListModel": {
        "img": {
          "imgNo": "",
          "remark": "",
          "title": "",
          "type": 0,
          "url": ""
        }
      },
    "honorListModel":{
        "img": {
          "imgNo": "",
          "remark": "",
          "title": "",
          "type": 0,
          "url": ""
        }
      },
    "showListModel": {
        "img": {
          "imgNo": "",
          "remark": "",
          "title": "",
          "type": 0,
          "url": ""
        }
      },
    "teachVideoListModel": {
        "id": 0,
        "teachName": "",
        "title": "",
        "url": ""
      },
    schoolDetails: {
      activityList:[],
      id:'',
      name:"",
      remark:''
    },
    activityList: [{
      "addr": {
        "addr": "",
        "id": 0,
        "latitude": 0,
        "longitude": 0,
        "name": "",
        "place": "",
        "placeNo": ""
      },
      "endTime": "",
      "id": 0,
      "img": "",
      "name": "",
      "statusName": ""
    }],
    nowIndex:0,
    storeAddress: ""   //地图页直接设好数据 将需要的地址数据设置到setAddress
  },
  //事件处理函数
  textareaIpt(e){
    // 机构简介
    var value = e.detail.value
    this.setData({
      "schoolDetails.remark": value
    });
  },
  deleteHandle(e){
    // 删除动态
    var index = e.currentTarget.dataset.index;
    var data = this.data.schoolDetails.activityList;
    data.splice(index,1)
    this.setData({
      "schoolDetails.activityList": data
    });
    console.log(index)
  },
  addHandle() {
    // 添加空的动态
    var dataModel = this.data.activityListModel
    var data = this.data.schoolDetails.activityList;
    data.push(dataModel)
    this.setData({
      "schoolDetails.activityList": data
    });

  },
  methods:{
    
  },
  editVideoDesc: function (e) {
    // 跳转到学校环境等的视频编辑
    if (e.currentTarget.dataset.api) {
      var api = e.currentTarget.dataset.api,
        updateapi = e.currentTarget.dataset.updateapi
      wx.navigateTo({
        url: `../editVideoDesc/editVideoDesc?api=${api}&updateapi=${updateapi}`
      })
    } else {
      var index = e.currentTarget.dataset.index;
      var data = JSON.stringify({
        key: e.currentTarget.dataset.key,
        index: index,
        list: this.data.schoolDetails.activityList[index].imgList
      })
      wx.setStorageSync("addivList", data)
      wx.navigateTo({
        url: `../editVideoDesc/editVideoDesc`
      })
    }
  },
  getIptMes: function (e) {
    // 获得动态下方编辑的数据
    var index = e.detail.index;
    var data = this.data.schoolDetails
    this.setData({
      [`schoolDetails.activityList[${index}]`]: e.detail.mes,
      nowIndex: index
    });
  },
  setAddress(e){
    console.log(e)
    var index = e.index
    var address = e.storeAddress
    // 地图页返回并执行的方法
    this.setData({
      [`schoolDetails.activityList[${index}].addr.addr`]: address.addr,
      [`schoolDetails.activityList[${index}].addr.longitude`]: address.longitude,
      [`schoolDetails.activityList[${index}].addr.latitude`]: address.latitude,
      [`schoolDetails.activityList[${index}].addr.name`]: address.title,
      [`schoolDetails.activityList[${index}].addr.province`]: address.province,
      [`schoolDetails.activityList[${index}].addr.city`]: address.city,
      [`schoolDetails.activityList[${index}].addr.district`]: address.district,
      [`schoolDetails.activityList[${index}].addr.place`]: address.province + address.city + address.district
    })
  },
  backFn(e){
    // 活动视频编辑后返回从storage获取单前编辑的新活动图片信息
    console.log(e)
    let getData = JSON.parse(wx.getStorageSync("addivList"));
    let prevIndex = getData.index;
    let prevData = getData.list;
    let prevkey = getData.key;
    console.log(321654)
    console.log(getData)
    console.log(`schoolDetails.activityList[${prevIndex}].${prevkey}`)
    this.setData({
      [`schoolDetails.activityList[${prevIndex}].${prevkey}`]: prevData
    })
  },
  goToSchoolHome(e) {
    wx.navigateTo({
      url: `../schoolHome/schoolHome${this.data.id}`
    })
  },
  submit(){
    // 提交所有数据
    var data = {
      "recentActivityList": this.data.schoolDetails.activityList,
      "remark": this.data.schoolDetails.remark
    }
    wx.showToast({
      title: '请稍后',
      icon: 'loading',
      duration: 5000
    })
    var _this = this
    data.recentActivityList.forEach((item, index)=>{
      if(item.addr==''){
        data.recentActivityList[index].addr={}
      }
      if (item.imgList == '') {
        data.recentActivityList[index].imgList = []
      }
      if (item.remarkList == '') {
        data.recentActivityList[index].remarkList = []
      }
    })
    console.log(JSON.stringify(data))
    console.log(data)
    apiServer.post(`/app/org/info/update`, data).then(res => {
      wx.showToast({
        title: '编辑成功',
        icon: 'loading',
        duration: 2000
      })
      _this.getData()
      _this.goToSchoolHome()
      // activityList: res.data.data.activityList
    })
  },
  getData(){
    var that = this
    apiServer.post(`/app/org/info`).then(res => {
      console.log(res.data);
      wx.hideToast()
      that.setData({
        schoolDetails: res.data.data,
        id: res.data.data.id
      })
      // activityList: res.data.data.activityList
    })
  },
  onLoad: function (e) {
    wx.setNavigationBarColor({
      frontColor: '#000000',
      backgroundColor: '#fff'
    });

    var that = this;
    this.getData()
  },
  
})
