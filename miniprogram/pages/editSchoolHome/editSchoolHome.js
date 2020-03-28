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
    var dataModel = this.data.activityModel
    var data = this.data.schoolHome.activityList;
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
    var dataModel = this.data.courseModel
    var data = this.data.schoolHome.courseList;
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
      list: this.data.schoolHome[firstkey][index].imgList
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
  uploadTeacherLogo(e) {
    // 教师头像上传
    var index = e.currentTarget.dataset.index;
    var that = this;
    wx.chooseImage({
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success(res) {
        console.log(res)
        let src = res.tempFiles[0];
        var videoName = src.path.split("/")[src.path.split("/").length - 1].replace(/\.(mp4|avi|mpeg|mpg|dat|rmvb|mov|asf|wmv|png|jpg|jpeg|)/gi, '');
        wx.uploadFile({
          url: util.apiUrl(`/picture/upload/${videoName}`),
          method: 'post',
          filePath: src.path,
          name: 'file',
          file: src,
          data: {},
          header: { 'content-type': 'application/json' },
          success(res) {
            var data = JSON.parse(res.data)
            that.setData({
              [`schoolHome.courseList[${index}].img`]: data.data.string
            });
          }
        })
      }
    })
  },
  uploadUsImg(e) {
    // 机构封面上传
    var index = e.currentTarget.dataset.index;
    var that = this;
    wx.chooseImage({
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success(res) {
        console.log(res)
        let src = res.tempFiles[0];
        var videoName = src.path.split("/")[src.path.split("/").length - 1].replace(/\.(mp4|avi|mpeg|mpg|dat|rmvb|mov|asf|wmv|png|jpg|jpeg|)/gi, '');
        wx.uploadFile({
          url: util.apiUrl(`/picture/upload/${videoName}`),
          method: 'post',
          filePath: src.path,
          name: 'file',
          file: src,
          data: {},
          header: { 'content-type': 'application/json' },
          success(res) {
            var data = JSON.parse(res.data)
            that.setData({
              [`schoolHome.understand.img`]: data.data.string
            });
          }
        })
      }
    })
  },
  uploadUsLogo(e) {
    // 机构logo上传
    var index = e.currentTarget.dataset.index;
    var that = this;
    wx.chooseImage({
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success(res) {
        console.log(res)
        let src = res.tempFiles[0];
        var videoName = src.path.split("/")[src.path.split("/").length - 1].replace(/\.(mp4|avi|mpeg|mpg|dat|rmvb|mov|asf|wmv|png|jpg|jpeg|)/gi, '');
        wx.uploadFile({
          url: util.apiUrl(`/picture/upload/${videoName}`),
          method: 'post',
          filePath: src.path,
          name: 'file',
          file: src,
          data: {},
          header: { 'content-type': 'application/json' },
          success(res) {
            var data = JSON.parse(res.data)
            that.setData({
              [`schoolHome.understand.logo`]: data.data.string
            });
          }
        })
      }
    })
  },
  uploadQRcode(e) {
    // 微信二维码上传
    var index = e.currentTarget.dataset.index;
    var that = this;
    wx.chooseImage({
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success(res) {
        console.log(res)
        let src = res.tempFiles[0];
        var videoName = src.path.split("/")[src.path.split("/").length - 1].replace(/\.(mp4|avi|mpeg|mpg|dat|rmvb|mov|asf|wmv|png|jpg|jpeg|)/gi, '');
        wx.uploadFile({
          url: util.apiUrl(`/picture/upload/${videoName}`),
          method: 'post',
          filePath: src.path,
          name: 'file',
          file: src,
          data: {},
          header: { 'content-type': 'application/json' },
          success(res) {
            var data = JSON.parse(res.data)
            that.setData({
              [`schoolHome.understand.wechatQrcode`]: data.data.string
            });
          }
        })
      }
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
  onLabelChange(e) {
    // 热门标签输入  后续提交要处理成数组格式
    var index = e.currentTarget.dataset.index
    var value = e.detail
    this.setData({
      [`schoolHome.understand.label`]: value,
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
    // 电话输入
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
    var _this = this
    console.log(JSON.stringify(data))
    console.log(data)
    apiServer.post(`/app/org/index/update`, data).then(res => {
      console.log(res)
      // activityList: res.data.data.activityList
    })
  },
  goToSchoolHome(e) {
    wx.navigateTo({
      url: `../../pages/schoolHome/schoolHome`
    })
  },
  goToEditSchoolDetails(e) {
    wx.navigateTo({
      url: `../../pages/editSchoolDetails/editSchoolDetails`
    })
  },
  onLoad: function (e) {
   
    wx.getSetting({
      success(res) {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称
          wx.getUserInfo({
            success: function (res) {
              console.log(res)
            }
          })
        }
      }
    })
    wx.setNavigationBarColor({
      frontColor: '#000000',
      backgroundColor: '#fff'
    });
    var _this = this;
    console.log(e)
    let id = e.id ? e.id : 1;
    if (id) {
      apiServer.post(`/app/org/index`).then(res => {
        console.log(res.data);
        res.data.data.understand.lable = res.data.data.understand.lableList.join(', ')
        
        res.data.data.activityList.map(item =>{
          item.freeFlg = JSON.stringify(item.freeFlg)
          item.joinLimitlessFlg = JSON.stringify(item.joinLimitlessFlg)
        })
        _this.setData({
          schoolHome: res.data.data,
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
