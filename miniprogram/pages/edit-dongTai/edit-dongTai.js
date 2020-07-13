// edit-dongTai.js
const util = require('../../utils/util.js');
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
      title: '最近动态编辑', //导航栏 中间的标题
      white: false, // 是就显示白的，不是就显示黑的。
      address: '' // 加个背景 不加就是没有
    },
    // 导航头的高度
    height: app.globalData.navheight,
    hasWork:'',
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
        "statusName": "",
        "remarkList":[]
      },
    // 示例数据
    activityList: '',
    nowIndex:0,
    storeAddress: "",   //地图页直接设好数据 将需要的地址数据设置到setAddress
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
  deleteHandle() {

    var that = this
    wx.showModal({
      title: '提示',
      content: '是否确认删除',
      cancelText: '取消',
      confirmText: '确定',
      success: function (res) {
        if (res.cancel) {
        } else if (res.confirm) {
          that.delData(that.data.id)
        }
      }
    })
  },
  delData(id) {
    var that = this;
    wx.showToast({
      title: '请稍后~',
      icon: 'loading',
      duration: 5000
    })
    if (id) {
      apiServer.post(`/app/org/update/info/recent/${id}`, '', "delete").then(res => {
        wx.showToast({
          title: '删除成功',
        })
        setTimeout(() => {
          this.backHanel()
        }, 1000)
      })
    } else {
      wx.showToast({
        title: '删除成功',
      })
      setTimeout(() => {
        this.backHanel()
      }, 1000)
    }
  },
  methods:{
    
  },
  upDynamicBill(e){
    var that = this,
    index = e.currentTarget.dataset.index;
    util.uploadImg("dynamicBill").then(res => {
     
      that.setData({
        [`activityList.img`]: res.data.string
      })
    })
  },
  catchfn() {
    console.log(666)
  },

  getIptMes: function (e) {
    // 获得动态下方编辑的数据
    var index = e.detail.index;
    var data = this.data.schoolDetails
    this.setData({
      [`activityList`]: e.detail.mes,
      nowIndex: index
    });
  },
  setAddress(e){
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
  },
  backFn(e){
    // 活动视频编辑后返回从storage获取单前编辑的新活动图片信息
    let getData = JSON.parse(wx.getStorageSync("addivList"));
    let prevIndex = getData.index;
    let prevData = getData.list;
    let prevkey = getData.key;
    this.setData({
      [`activityList.remarkList`]: prevData
    })
  },
  goToSchoolDetails(e) {
    wx.navigateTo({
      url: `../schoolDetails/schoolDetails?id=${this.data.id}`
    })
  },
  submit: util.throttle(function () {
    // 提交所有数据
    var that = this
    var data = this.data.activityList
    wx.showToast({
      title: '请稍后',
      icon: 'loading',
      duration: 50000
    })
    console.log(app.globalData.isLinking)
    if (app.globalData.isLinking) {
      console.log("loading")
      setTimeout(() => {
        that.submit()
      }, 500)
      return
    }
    this.setData({
      hasWork: true
    })
    var _this = this
    if (data.addr == '') {
      data.addr = {}
    }
    if (data.remarkList == '') {
      data.remarkList = []
    }
    if (data.addrVoList[0].addrNo) {
      data.addrNo = data.addrVoList[0].addrNo
    } else {
      data.addrNo = data.addrVoList[0].placeNo
    }
    apiServer.post(`/app/org/update/info/recent`, data).then(res => {
      wx.hideToast();
      wx.showToast({
        title: '编辑成功',
        duration: 1000
      })
      setTimeout(() => {
        this.backHanel()
      }, 1000)

    }).catch(err => {
      _this.setData({
        hasWork: false
      })
    })
  }),
  backHanel() {
    var pages = getCurrentPages(); // 当前页面
    var beforePage = pages[pages.length - 2]; // 前一个页面
    wx.navigateBack();
  },
  getData(id){
    var that = this
    apiServer.post(`/app/org/update/info/recent/${id}`,'','get').then(res => {
      wx.hideToast()
      res.data.data.addrVoList = [res.data.data.addr]
      that.setData({
        activityList: res.data.data,
      })
    })
  },
  onLoad: function (e) {

    var that = this;
    wx.setNavigationBarColor({
      frontColor: '#000000',
      backgroundColor: '#fff'
    });
    let id = e ? e.id : '';
    this.setData({
      id: id
    })
    if (id) {
      this.getData(id)
    } else {
      var dataModel = Object.assign({}, this.data.activityListModel)
      this.setData({
        activityList: dataModel
      })
    }
    console.log(this.data.activityList)
  },
})
