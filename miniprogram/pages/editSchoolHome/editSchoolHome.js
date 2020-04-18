// 学校主页编辑
//editSchoolHome.js
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
      title: '学校主页编辑', //导航栏 中间的标题
      white: false, // 是就显示白的，不是就显示黑的。
      address: '' // 加个背景 不加就是没有
    },
    // 导航头的高度
    height: app.globalData.navheight,
    id: "",      //编辑学校的id 
    active: 0,
    schoolHome: {},
    firstkey: '',
    activityModel: {
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
        //   "id": '',
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
      "imgList": [],
      "joinLimitlessFlg": '',
      "name": "",
      "price": '',
      "startTime": "",
      "style": '',
      "totalJoin": ''
    },
    courseModel: {
      "activityId": '',
      "id": '',
      "img": "",
      "imgList": [
        // {
        //   "id": '',
        //   "imgNo": "",
        //   "remark": "",
        //   "title": "",
        //   "type": 0,
        //   "url": ""
        // }
      ],
      "name": ""
    },
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  bindGetUserInfo(e) {
    console.log(e.detail.userInfo)
  },
  addHandle() {
    // 添加空的活动
    var dataModel = JSON.parse(JSON.stringify(this.data.activityModel))
    var data = this.data.schoolHome.activityList;
    console.log(this.data.schoolHome)
    if(data == '') data = []
    data.push(dataModel)
    this.setData({
      "schoolHome.activityList": data
    });
    console.log(dataModel)
    console.log(data)
  },
  deleteHandle(e) {
    // 删除活动
    var index = e.currentTarget.dataset.index;
    var data = this.data.schoolHome.activityList;
    data.splice(index, 1)
    this.setData({
      "schoolHome.activityList": data
    });
    console.log(index)
  },
  addHandle1() {
    // 添加空的课程
    var dataModel = JSON.parse(JSON.stringify(this.data.courseModel))
    var data = this.data.schoolHome.courseList;
    if (data == '') data = []
    data.push(dataModel)
    this.setData({
      "schoolHome.courseList": data
    });
  },
  deleteHandle1(e) {
    // 删除课程
    var index = e.currentTarget.dataset.index;
    var data = this.data.schoolHome.courseList;
    data.splice(index, 1) 
    this.setData({
      "schoolHome.courseList": data
    });
    console.log(index)
  },
  backFn(e) {
    // 活动视频编辑后返回从storage获取单前编辑的新活动图片信息
    console.log(e)
    let getData = JSON.parse(wx.getStorageSync("addivList"));
    let prevIndex = getData.index;
    let prevData = getData.list;
    let prevkey = getData.key;
    var firstkey = this.data.firstkey
    console.log(321654)
    console.log(getData)
    console.log(`schoolHome.${firstkey}[${prevIndex}].${prevkey}`)
    this.setData({
      [`schoolHome.${firstkey}[${prevIndex}].${prevkey}`]: prevData
    })
    console.log("cdata")
    console.log(this.data)
  },
  setAddress(e) {
    console.log(e)
    var index = e.index
    var address = e.storeAddress
    var firstkey = this.data.firstkey
    console.log(firstkey)
    // 地图页返回并执行的方法
    if(firstkey == "understand"){
      this.setData({
        [`schoolHome.understand.addr.addr`]: address.addr,
        [`schoolHome.understand.addr.longitude`]: address.longitude,
        [`schoolHome.understand.addr.latitude`]: address.latitude,
        [`schoolHome.understand.addr.name`]: address.title,
        [`schoolHome.understand.addr.province`]: address.province,
        [`schoolHome.understand.addr.city`]: address.city,
        [`schoolHome.understand.addr.district`]: address.district,
        [`schoolHome.understand.addr.place`]: address.province + address.city + address.district
      })
    }else{
      this.setData({
        [`schoolHome.activityList[${index}].addr.addr`]: address.addr,
        [`schoolHome.activityList[${index}].addr.longitude`]: address.longitude,
        [`schoolHome.activityList[${index}].addr.latitude`]: address.latitude,
        [`schoolHome.activityList[${index}].addr.name`]: address.title,
        [`schoolHome.activityList[${index}].addr.place`]: address.province + address.city + address.district
      })
    }
    
  },
  toMap(e) {
    this.setFirstKey(e)
    var index = this.data.viewIndex
    wx.navigateTo({
      url: `../../pages/shopMap/shopMap?index=${index}`
    })
  },
  setFirstKey(e) {
    // 设置单前数据处理的第一层key
    var firstkey = e.currentTarget.dataset.firstkey
    this.setData({
      firstkey: firstkey
    })
  },

  editVideoDesc: function (e) {
    // 跳转到视频编辑
    this.setFirstKey(e)
    var firstkey = this.data.firstkey
    var index = e.currentTarget.dataset.index;
    var data = JSON.stringify({
      key: e.currentTarget.dataset.key,
      index: index,
      firstkey: firstkey,
      list: this.data.schoolHome[firstkey][index][e.currentTarget.dataset.key]
    })
    wx.setStorageSync("addivList", data)
    wx.navigateTo({
      url: `../editVideoDesc/editVideoDesc`
    })
  },
  getIptMes: function (e) {
    // 获得动态下方编辑的数据
    var index = e.detail.index;
    var data = this.data.schoolHome
    this.setData({
      [`schoolHome.activityList[${index}]`]: e.detail.mes,
      nowIndex: index
    });
  },
  catchfn(){
    console.log(666)
  },
  upActivityBill(e){
    var that = this,
        index = e.currentTarget.dataset.index;
    util.uploadImg("activityBill").then(res=>{
      
      that.setData({
        [`schoolHome.activityList[${index}].img`]: res.data.string
      })
    })
  },
  uploadTeacherLogo(e) {
    // 教师头像上传

    var index = e.currentTarget.dataset.index;
    var that = this;
    util.uploadImg("teacherLogo").then(res => {
      console.log(res)
      that.setData({
        [`schoolHome.courseList[${index}].img`]: res.data.string
      })
    })
  },
  uploadUsImg(e) {
    // 机构封面上传
    var index = e.currentTarget.dataset.index;
    var that = this;
    util.uploadImg("orgicon").then(res => {
      console.log(res)
      that.setData({
        [`schoolHome.understand.img`]: res.data.string
      })
    })
  },
  uploadUsLogo(e) {
    // 机构logo上传
    var index = e.currentTarget.dataset.index;
    var that = this;
    util.uploadImg("orglogo").then(res => {
      console.log(res)
      that.setData({
        [`schoolHome.understand.logo`]: res.data.string
      })
    })
  },
  uploadQRcode(e) {
    // 微信二维码上传
    var index = e.currentTarget.dataset.index;
    var that = this;
    util.uploadImg("orglogo").then(res => {
      console.log(res)
      that.setData({
        [`schoolHome.understand.wechatQrcode`]: res.data.string
      })
    })
  },
  onCoursenameChange(e){
    // 课程标题输入
    var index = e.currentTarget.dataset.index
    var value = e.detail
    this.setData({
      [`schoolHome.courseList[${index}].name`]: value,
    })
  },
  onOrgnameChange(e) {
    // 机构名称输入
    var index = e.currentTarget.dataset.index
    var value = e.detail
    this.setData({
      [`schoolHome.understand.name`]: value,
    })
  },
  onLableChange(e) {
    // 热门标签输入  后续提交要处理成数组格式
    var index = e.currentTarget.dataset.index
    var value = e.detail
    this.setData({
      [`schoolHome.understand.lable`]: value,
    })
  },
  onTelChange(e) {
    // 电话输入
    var index = e.currentTarget.dataset.index
    var value = e.detail
    this.setData({
      [`schoolHome.understand.telephone`]: value,
    })
  },
  onWechatChange(e) {
    // 微信输入
    var index = e.currentTarget.dataset.index
    var value = e.detail
    this.setData({
      [`schoolHome.understand.wechat`]: value,
    })
  },
  submit() {
    // 提交所有数据
    var data = this.data.schoolHome
    data.understand.lableList = data.understand.lable.split(',')
    wx.showToast({
      title: '请稍后',
      icon: 'loading',
      duration: 5000
    })
    var that = this
    console.log(JSON.stringify(data))
    console.log(data)
      if (data.activityList == "") {
        data.activityList = []
      }
      data.activityList.forEach((item, index) => {
        if (item.bannerList == "") {
          data.activityList[index].bannerList = []
        }
        if (item.imgList == "") {
          data.activityList[index].imgList = []
        }
        if (item.addr == "") {
          data.activityList[index].addr = {}
        }
      })
      if (data.courseList == "") {
        data.courseList = []
      }
      data.courseList.forEach((item, index) => {
        if (item.imgList == "") {
          data.courseList[index].imgList = []
        }
      })
      if (data.understand == "") {
        data.understand = {}
      }
      if (data.understand.lableList == "") {
        data.understand.lableList = []
      }
      if (data.understand.addr == "") {
        data.understand.addr = {}
      }
      if (data.understand.lable != "") {
        data.understand.lableList = [...data.understand.lable.split("，")]
      }
    apiServer.post(`/app/org/index/update`, data).then(res => {
      console.log(res)
      wx.hideToast();
      wx.showModal({
        title: '编辑成功',
        content: '是否跳转主页查看效果',
        success: function (res) {
          if (res.cancel) {
          } else if (res.confirm) {
            that.goToSchoolHome()
          }
        }
      })
      // activityList: res.data.data.activityList
    })
  },
  goToSchoolHome(e) {
    var id = JSON.parse(wx.getStorageSync('myOrgMes')).org.id
    wx.navigateTo({
      url: `../schoolHome/schoolHome?id=${id}`
    })
  },
  goToEditSchoolDetails(e) {
    wx.navigateTo({
      url: `../editSchoolDetails/editSchoolDetails`
    })
  },
  getData(){
    var that = this;
    apiServer.post(`/app/org/index`).then(res => {
      console.log(res.data);
      res.data.data.understand.lable = res.data.data.understand.lableList.join(', ')

      // res.data.data.activityList.map(item =>{
      //   item.freeFlg = JSON.stringify(item.freeFlg)
      //   item.joinLimitlessFlg = JSON.stringify(item.joinLimitlessFlg)
      // })
      that.setData({
        schoolHome: res.data.data,
      })
    })
  },
  onLoad: function (e) {
   
    wx.setNavigationBarColor({
      frontColor: '#000000',
      backgroundColor: '#fff'
    });
    this.getData()
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
