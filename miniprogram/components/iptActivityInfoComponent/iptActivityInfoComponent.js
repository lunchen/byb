// 编辑活动 动态form
const util = require('../../utils/util.js')
const app = getApp()
Component({
  properties: {
    iptActivityInfoData: {
      type: Object,
      value: {},
      observer: function (newVal, oldVal) {
        this.setData({
          iptActivityInfo: newVal
        })
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
    }
    // 活动数据模板
  },
  attached() {
    // 每次组件进入页面时执行
    // console.log(789)
    // console.log(this.data.iptActivityInfo)
  },
  methods: {
    editVideoDesc: function (e) {
      console.log(e)
      // 跳转到学校环境等的视频编辑
      var key= e.currentTarget.dataset.key;
      var index = this.data.viewIndex;
      var data = JSON.stringify({
        key: key,
        index: index,
        list: this.data.iptActivityInfoData[key]
      })
      wx.setStorageSync("addivList", data)
      wx.navigateTo({
        url: `../editVideoDesc/editVideoDesc`
      })
    },
    toMap() {
      var index = this.data.viewIndex
      wx.navigateTo({
        url: `../../pages/shopMap/shopMap?index=${index}`
      })
    },
    sendIptMes(e) {
      var _this = this
      console.log("send")
      console.log(_this.data.iptActivityInfo)
      console.log(_this.data.viewIndex)
      console.log("send")
      this.triggerEvent('getIptMes', {
        mes: _this.data.iptActivityInfo,
        index: _this.data.viewIndex
      })
    },
    getTime: function (event) {
      console.log(this.data.iptActivityInfo)
      var d = event.target.dataset.timename
      this.setData({
        show: true,
        picker: event.target.dataset.timename
      });
      console.log(this.data.picker)
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
      console.log(event.detial)
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
      console.log(event.detial)
      this.setData({
        "iptActivityInfo.totalJoin": event.detail
      });
    },
  }
})