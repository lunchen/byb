// 学校主页编辑
//editSchoolHome.js
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
      title: '学校主页编辑', //导航栏 中间的标题
      white: false, // 是就显示白的，不是就显示黑的。
      address: '' // 加个背景 不加就是没有
    },
    // 导航头的高度
    height: app.globalData.navheight,
    id: "",      //编辑学校的id 
    active: 0,
    schoolHome: {
      understand: {
        "img": "",
        "lableList": [],
        "logo": "",
        "name": ""
      }
    },
    campusList:[],
    campusModel:{
      "addr": {
        "addr": "",
        "city": "",
        "dist": "",
        "district": "",
        "id": 0,
        "latitude": 0,
        "longitude": 0,
        "name": "",
        "place": "",
        "placeNo": "",
        "province": ""
      },
      "addrNo": "",
      "flg": 0,
      "id": 0,
      "name": "",
      "telephone": [""],
      "wechat": [""],
      "wechatQrcode": []
    },
    index0: 0,
    locationEditIndex:0,
    index1: 0,
    firstkey: '',
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    orgRemark:''
  },

  //事件处理函数
  textareaIpt(e) {
    // 机构简介
    var value = e.detail.value
    this.setData({
      "schoolHome.understand.remark": value
    });
  },
  cutCampusCard(e){
    var that = this
    var index0 = e.currentTarget.dataset.index0
    var data = this.data.campusList
    if (data[index0].id){
      wx.showModal({
        title: '提示',
        content: '是否确认删除',
        success: function (res) {
          if (res.cancel) {
          } else if (res.confirm) {
            that.delCampusCard(data[index0].id)
          }
        }
      })
    }else{
      data.splice(index0, 1)
      this.setData({
        [`campusList`]: data,
      })
    }
  },
  delCampusCard(id){
    apiServer.post(`/app/org/update/index/campus/${id}`, '', "delete").then(res => {
      wx.showToast({
        title: '删除成功',
        duration: 2000
      })
      this.getCampusList()
    })
  },
  addCampusCard(){
    var data = this.data.campusList
    console.log(data)

    var dd = JSON.stringify(this.data.campusModel)
    data.push(JSON.parse(dd))
    console.log(data)
    this.setData({
      campusList: data
    })
  },
  setMain(e) {
    var index0 = e.currentTarget.dataset.index0
    var id = this.data.campusList[index0].id
    apiServer.post(`/app/org/update/index/campus/flg/${id}`).then(res => {
      wx.showToast({
        title: '设置成功',
        duration: 2000
      })
      this.getCampusList()
    })
  },
  backFn(e) {
    // 活动视频编辑后返回从storage获取单前编辑的新活动图片信息
    let getData = JSON.parse(wx.getStorageSync("addivList"));
    let prevIndex = getData.index;
    let prevData = getData.list;
    let prevkey = getData.key;
    var firstkey = this.data.firstkey
    this.setData({
      [`schoolHome.${firstkey}[${prevIndex}].${prevkey}`]: prevData
    })
  },
  setAddress(e) {
    console.log(e)
    var index = e.index
    var addrNo = e.addrNo
    var address = e.storeAddress
    var firstkey = this.data.firstkey
    this.setData({
      [`campusList[${index}].addr.addr`]: address.addr,
      [`campusList[${index}].addr.addrNo`]: addrNo,
      [`.campusList[${index}].addr.city`]: address.city,
      [`.campusList[${index}].addr.district`]: address.district,
      [`.campusList[${index}].addr.longitude`]: address.longitude,
      [`.campusList[${index}].addr.latitude`]: address.latitude,
      [`.campusList[${index}].addr.name`]: address.title,
      [`.campusList[${index}].addr.place`]: address.province + address.city + address.district,
      [`.campusList[${index}].addr.province`]: address.province,
    })
    
  },
  toMap(e) {
    this.setindex0(e)
    var index = this.data.index0
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

  catchfn(){
    console.log(666)
  },
  uploadOrgBaanner(e) {
    // 机构封面上传
    var index = e.currentTarget.dataset.index;
    var that = this;
    util.uploadImg("orgicon").then(res => {
      that.setData({
        [`schoolHome.understand.img`]: res.data.string
      })
    })
  },
  uploadOrgLogo(e) {
    // 机构logo上传
    var index = e.currentTarget.dataset.index;
    var that = this;
    util.uploadImg("orglogo").then(res => {
      that.setData({
        [`schoolHome.understand.logo`]: res.data.string
      })
    })
  },
  uploadQRcode(e) {
    // 微信二维码上传
    var index0 = e.currentTarget.dataset.index0;
    console.log("addimg")
    console.log(index0)
    var that = this;
    var data = that.data.campusList[index0].wechatQrcode
    console.log(that.data.campusList[index0])
    console.log(data)
    util.uploadImg("orglogo").then(res => {
      data.push(res.data.string)
      that.setData({
        [`campusList[${index0}].wechatQrcode`]: data
      })
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
  onLocationChange(e) {
    var index0 = e.currentTarget.dataset.index0
    // 详细地址名称输入
    var value = e.detail.value
    app.globalData.isLinking = true
    this.setData({
      locationEditIndex: this.data.index0,
      [`campusList[${index0}].addr.addr`]: value
    })
  },
  async onLocationBlur() {
    let index0 = this.data.locationEditIndex
    let req = this.data.campusList[index0].addr
    let addrNo = await util.getAddrNo(req)
    app.globalData.isLinking = false
    this.setData({
      [`campusList[${index0}].addr.addrNo`]: addrNo,
    })
  },
  setindex0(e){
    var index0 = e.currentTarget.dataset.index0
    console.log("setIndex0")
    console.log(index0)
    this.setData({
      index0: index0
    })
  },
  setindex1(e) {
    var index1 = e.currentTarget.dataset.index1
    console.log("setIndex1")
    console.log(index1)
    this.setData({
      index1: index1
    })
  },
  addtel(e){
    var index0 = e.currentTarget.dataset.index0
    var index1 = e.currentTarget.dataset.index1
    var data = this.data.campusList[index0].telephone
    data.push('')
    this.setData({
      [`campusList[${index0}].telephone`]: data,
    })
  },
  cuttel(e) {
    var index0 = e.currentTarget.dataset.index0
    var index1 = e.currentTarget.dataset.index1
    var data = this.data.campusList[index0].telephone
    data.splice(index1,1)
    this.setData({
      [`campusList[${index0}].telephone`]: data,
    })
  },

  addwechat(e) {
    var index0 = e.currentTarget.dataset.index0
    var index1 = e.currentTarget.dataset.index1
    var data = this.data.campusList[index0].wechat
    data.push('')
    this.setData({
      [`campusList[${index0}].wechat`]: data,
    })
  },
  cutwechat(e) {
    var index0 = e.currentTarget.dataset.index0
    var index1 = e.currentTarget.dataset.index1
    var data = this.data.campusList[index0].wechat
    data.splice(index1, 1)
    this.setData({
      [`campusList[${index0}].wechat`]: data,
    })
  },
  cutImg(e) {
    var index0 = e.currentTarget.dataset.index0
    var index1 = e.currentTarget.dataset.index1
    var data = this.data.campusList[index0].wechatQrcode
    data.splice(index1, 1)
    this.setData({
      [`campusList[${index0}].wechatQrcode`]: data,
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
    var index0 = e.currentTarget.dataset.index0
    var index1 = e.currentTarget.dataset.index1
    console.log(123123)
    console.log(index0)
    console.log(index1)
    var value = e.detail
    this.setData({
      [`campusList[${index0}].telephone[${index1}]`]: value,
    })
  },
  onNameChange(e) {
    // 电话输入
    var index0 = e.currentTarget.dataset.index0
    var value = e.detail
    this.setData({
      [`campusList[${index0}].name`]: value,
    })
  },
  onWechatChange(e) {
    // 微信输入
    var index0 = e.currentTarget.dataset.index0
    var index1 = e.currentTarget.dataset.index1
    var value = e.detail
    this.setData({
      [`campusList[${index0}].wechat[${index1}]`]: value,
    })
  },
  subCard(e){
    var that = this
    wx.showToast({
      mask: true,
      icon: 'loading',
      duration: 100000
    })
    if (app.globalData.isLinking){
      console.log("loading")
      setTimeout(() => {
        console.log("hhh")
        that.subCard(e)
      },500)
      return
    }
    var index0 = e.currentTarget.dataset.index0
    var data = this.data.campusList[index0]
    var req = {
      "addrNo": data.addr.addrNo,
      "telephone": data.telephone,
      "wechat": data.wechat,
      "wechatQrcode": data.wechatQrcode,
      "name": data.name
    }
    if (data.id){
      req.id = data.id
    }
    apiServer.post(`/app/org/update/index/campus`, req).then(res => {
      wx.hideToast();
      wx.showToast({
        title: '保存成功',
        duration: 2000
      })
      this.getCampusList()
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
    
    
    if (data.understand == "") {
      data.understand = {}
    }
    if (data.understand.lableList == "") {
      data.understand.lableList = []
    }
    if (data.understand.lable != "") {
      var reg = new RegExp(',', "g")
      var a = data.understand.lable.replace(reg, "，")
      data.understand.lableList = [...a.split("，")]
    }
    apiServer.post(`/app/org/update/index/understand`, data.understand).then(res => {
      wx.showToast({
        title: '保存成功',
        duration: 1000,
      }) 
      // wx.showModal({
      //   title: '编辑成功',
      //   content: '是否跳转主页查看效果',
      //   success: function (res) {
      //     if (res.cancel) {
      //     } else if (res.confirm) {
      //       that.goToSchoolHome()
      //     }
      //   }
      // })
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
  // getData(){
  //   var that = this;
  //   apiServer.post(`/app/org/index`).then(res => {
  //     res.data.data.understand.lable = res.data.data.understand.lableList.join('，')
  //     that.setData({
  //       schoolHome: res.data.data,
  //     })
  //   })
  // },
  getKnowUs(e){
    var that = this;
    apiServer.post(`/app/org/update/index/understand`,'',"get").then(res => {
      res.data.data.lable = res.data.data.lableList.join('，')
      that.setData({
        "schoolHome.understand": res.data.data,
      })
    })
  },
  getCampusList(e) {
    var that = this;
    apiServer.post(`/app/org/update/index/campus/list`, '', "get").then(res => {
      console.log(res)
      if (res.data.data.list.length>0){
        res.data.data.list.forEach(item => {
          if (item.telephone.length < 1) {
            item.telephone[0] = ''
          }
          if (item.wechat.length < 1) {
            item.wechat[0] = ''
          }
        })
        that.setData({
          "campusList": res.data.data.list,
        })
      }else{
        that.setData({
          "campusList": [],
        })
        that.addCampusCard()
      }
     
    })
  },
  onLoad: function (e) {
   
    wx.setNavigationBarColor({
      frontColor: '#000000',
      backgroundColor: '#fff'
    });
    let id = e ? e.id : '';
    if (id) {
      this.setData({
        id: id
      })
    } 
    this.getKnowUs(id)
    this.getCampusList(id)
  },
  getUserInfo: function(e) {
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
})
