// 编辑活动 动态form
const util = require('../../utils/util.js')
const app = getApp()
Component({
  properties: {
    iptActivityInfoData: {
      type: Object,
      value: {},
      observer: function (newVal, oldVal) {

        var _this = this
        console.log("newVal111")
        console.log(newVal)
        
        if (newVal) {
          if (!newVal.addrVoList) {
            console.log("newVal000")
            newVal.addrVoList = []
          }
          if (newVal.addrVoList && newVal.addrVoList.length < 1) {
            console.log("newVal222")
            newVal.addrVoList.push(this.data.addrModel)
          }
          this.setData({
            iptActivityInfo: newVal,
            showList: newVal[_this.data.listKeyName]
          })
        }
        
      }
    },
    newAddr: {
      type: Object,
      value: {},
      observer: function (newVal, oldVal) {
        var _this = this
        console.log(999)
        console.log(newVal)
        if (newVal && newVal.addr){
          let data = this.data.iptActivityInfo
          data.addrVoList[this.data.index0] = newVal
          this.setData({
            iptActivityInfo: data
          })
          this.sendIptMes()
        }
      }
    },
    activityType: {
      // 默认类型为动态类型  1为发布活动类型
      type: Number, 
      value: 0, 
      observer: function (newVal, oldVal) { }
    },
    viewIndex: {
      // 默认类型为动态类型  1为发布活动类型
      type: Number,
      value: 0,
      observer: function (newVal, oldVal) { }
    }, 

    type: {
      // 默认类型为动态类型  1为发布活动类型
      type: Number,
      value: 0,
      observer: function (newVal, oldVal) { }
    }, 
    
    listKeyName: {
      // 默认类型为动态类型  1为发布活动类型
      type: String,
      value: "imgList",
      observer: function (newVal, oldVal) {
       
      }
    }, 
    addrmore: {
      // 默认类型为动态类型  1为发布活动类型
      type: Boolean,
      value: true,
      observer: function (newVal, oldVal) {

      }
    },
  },
  data: {
    // 时间选择
    value: '',
    minHour: 10,
    maxHour: 20,
    minDate: new Date(1990, 1, 1).getTime(),
    maxDate: new Date(2030, 12, 12).getTime(),
    currentDate: new Date().getTime(),
    show: false,
    time1: '',
    time2: '',
    picker: '',
    radio1: 0,
    radio2: "0",
    radio2Value: '',
    radio3: "0",
    radio3Value: '',
    storeAddress:'',
    // 动态数据模板
    addrModel: {
      "addr": "",
      "id": 0,
      "latitude": 0,
      "longitude": 0,
      "name": "",
      "place": "",
      "placeNo": ""
    },
    dataModel: {
      "addr": {
        "addr": "",
        "id": 0,
        "latitude": 0,
        "longitude": 0,
        "name": "",
        "place": "",
        "placeNo": ""
      },
      addrVoList:[],
      "imgList": [
        {
          "imgNo": "",
          "remark": "",
          "title": "",
          "type": 0,
          "url": ""
        }
      ],
      "endTime": "",
      "id": 0,
      "name": "",
      "statusName": ""
    },
    iptActivityInfo: {
      "addr": {
        "addr": "",
        "id": 0,
        "latitude": 0,
        "longitude": 0,
        "name": "",
        "place": "",
        "placeNo": ""
      },
      addrVoList:[],
      "imgList": [
        {
          "imgNo": "",
          "remark": "",
          "title": "",
          "type": 0,
          "url": ""
        }
      ],
      "endTime": "",
      "id": 0,
      "name": "",
      "statusName": ""
    },
    // 活动数据模板
    showList:[],
    index0:0,
    locationEditIndex:0
  },
  attached() {
    // 每次组件进入页面时执行
    console.log("this.data.iptActivityInfo")
    console.log(this.data.iptActivityInfoData)
  },
  methods: {
    addAddress(){
      var data = this.data.iptActivityInfo
      data.addrVoList.push(this.data.addrModel)
      console.log(data)
      this.setData({
        iptActivityInfo: data
      })
    },
    cutAddr(e){
      var index0 = e.currentTarget.dataset.index0
      var data = this.data.iptActivityInfo
      data.addrVoList.splice(index0,1)
      this.setData({
        "iptActivityInfo": data
      })
      this.sendIptMes()
    },
    onLocationChange(e) {
      // 详细地址名称输入
      var index0 = e.currentTarget.dataset.index0
      var value = e.detail.value
      app.globalData.isLinking = true
      this.setData({
        [`iptActivityInfo.addrVoList[${index0}].addr`]: value,
        locationEditIndex: this.data.index0,
      })
    },
    async onLocationBlur() {
      let index0 = this.data.locationEditIndex
      let req = this.data.iptActivityInfo.addrVoList[index0]
      let addrNo = await util.getAddrNo(req)
      app.globalData.isLinking = false
      this.setData({
        [`iptActivityInfo.addrVoList[${index0}].addrNo`]: addrNo,
      })
      this.sendIptMes()
    },
    onBindfullscreenchange(e) {
      this.triggerEvent("bindfullscreenchange", '');
    },
    catchfn() {
      console.log(666)
    },
    editVideoDesc: function (e) {
      // 跳转到学校环境等的视频编辑
      var key= e.currentTarget.dataset.key;
      var index = this.data.viewIndex;
      var data = JSON.stringify({
        key: key,
        index: index,
        list: this.data.iptActivityInfoData[key] ? this.data.iptActivityInfoData[key]:[]
      })
      wx.setStorageSync("addivList", data)
      wx.navigateTo({
        url: `../editVideoDesc/editVideoDesc`
      })
    },
    toMap(e) {
      this.setindex0(e)
      var index0 = this.data.index0
      console.log("getIndex0")
      console.log(index0)
      wx.navigateTo({
        url: `../../pages/shopMap/shopMap?index=${index0}`
      })
    },
    setindex0(e) {
      var index0 = e.currentTarget.dataset.index0
      console.log("setIndex0")
      console.log(index0)
      this.setData({
        index0: index0
      })
    },
    sendIptMes(e) {
      var _this = this
      this.triggerEvent('getIptMes', {
        mes: _this.data.iptActivityInfo,
        index: _this.data.viewIndex
      })
    },
    getTime: function (event) {
      var d = event.target.dataset.timename
      this.setData({
        show: true,
        picker: event.target.dataset.timename
      });
    },
    onClose: function () {
      this.setData({
        show: false
      });
    },
    onChange: function(e) {
      this.setData({
        "iptActivityInfo.name": e.detail
      });
    },
    iptValue: function(e) {
      this.setData({
        "iptActivityInfo.remark": e.detail.value
      });
    },
    confirm(event) {
      // 时间选择确定
      var _this = this;
      var time = util.formatDate(event.detail),
          time1 = _this.data.iptActivityInfo.startTime,
          time2 = _this.data.iptActivityInfo.endTime,
          active = _this.data.picker;
      this.setData({
        currentDate: event.detail,
        show: false,
        [`iptActivityInfo.${active}`]: time
      });

      time1 = _this.data.iptActivityInfo.startTime;
      time2 = _this.data.iptActivityInfo.endTime;
      if (time1 && time2 && time1 > time2) {
        this.setData({
          "iptActivityInfo.startTime": time1,
          "iptActivityInfo.endTime": time1
        });
      }
      this.sendIptMes();
    },
    inOrOut(event) {
      this.setData({
        "iptActivityInfo.style": event.target.dataset.io
      });
      this.sendIptMes();
    },
    onRadio2Change(event) {
      if (event.detail == 1){
        this.setData({
          "iptActivityInfo.freeFlg": event.detail,
          "iptActivityInfo.price": ''
        });
      }else{
        this.setData({
          "iptActivityInfo.freeFlg": event.detail
        });
      }
      this.sendIptMes();
    },
    onRadio2iptChange(event){
      this.setData({
        "iptActivityInfo.price": event.detail
      });
    },
    onRadio3Change(event) {
      if (event.detail == 1) {
        this.setData({
          "iptActivityInfo.joinLimitlessFlg": event.detail,
          "iptActivityInfo.totalJoin": ''
        });
      } else {
        this.setData({
          "iptActivityInfo.joinLimitlessFlg": event.detail
        });
      }
      this.sendIptMes();
    },
    onRadio3iptChange(event) {
      this.setData({
        "iptActivityInfo.totalJoin": event.detail
      });
    },
  }
})