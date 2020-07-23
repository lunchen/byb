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
        
        console.log("newVal")
        console.log(newVal)
        if (newVal) {
          if (!newVal.addrVoList) {
            newVal.addrVoList = []
          }
          if (newVal.addrVoList && newVal.addrVoList.length < 1) {
            newVal.addrVoList.push(this.data.addrModel)
          }
          let nop = ''
          if(newVal.rateFlg == 1){
            nop = true
          }
          if(newVal.amountFlg == 1){
            nop = false
          }
          if(newVal.price){
            this.setData({
              maxhb: newVal.price*0.3*10/10,
            })
          }
          if(newVal.shareFlg==1){
            this.setData({
              sFlg: true,
            })
          }else{
            this.setData({
              sFlg: false,
            })
          }
          this.setData({
            nop: nop,
            shuzhi:newVal.amount,
            baifenbi:newVal.rate,
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
      "statusName": "",
    },
    // 活动数据模板
    showList:[],
    index0:0,
    locationEditIndex:0,
    sFlg:'',
    nop:'',
    baifenbi:'',
    shuzhi:'',
    maxhb:''
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
    getTime: function (e) {
      var d = e.target.dataset.timename
      this.setData({
        show: true,
        picker: e.target.dataset.timename
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
    confirm(e) {
      // 时间选择确定
      var _this = this;
      var time = util.formatDate(e.detail),
          time1 = _this.data.iptActivityInfo.startTime,
          time2 = _this.data.iptActivityInfo.endTime,
          active = _this.data.picker;
      this.setData({
        currentDate: e.detail,
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
    inOrOut(e) {
      this.setData({
        "iptActivityInfo.style": e.target.dataset.io
      });
      this.sendIptMes();
    },
    onPriceRadioChange(e) {
      if (e.detail == 1){
        this.setData({
          "iptActivityInfo.freeFlg": e.detail,
          "iptActivityInfo.price": '',
          "iptActivityInfo.shareFlg": 0,
          "iptActivityInfo.rateFlg": 0,
          "iptActivityInfo.rate": '',
          "iptActivityInfo.amountFlg": 0,
          "iptActivityInfo.amount": '',
        });
      }else{
        this.setData({
          "iptActivityInfo.freeFlg": e.detail
        });
      }
      this.sendIptMes();
    },
    onPriceIptChange(e){
      this.setData({
        "iptActivityInfo.price": e.detail
      });
    },
    onPriceBlur(e){
      if(this.data.iptActivityInfo.price*1 && this.data.iptActivityInfo.price*1>0){
        this.setData({
          "iptActivityInfo.price": parseInt(this.data.iptActivityInfo.price*100)/100,
          maxhb: parseInt(this.data.iptActivityInfo.price*100)/100*0.3*10/10
        })
      }else{
        this.setData({
          "iptActivityInfo.price": 0,
        })
      }
      this.sendIptMes()
    },
    onTotalJoinRadioChange(e) {
      if (e.detail == 1) {
        this.setData({
          "iptActivityInfo.joinLimitlessFlg": e.detail,
          "iptActivityInfo.totalJoin": ''
        });
      } else {
        this.setData({
          "iptActivityInfo.joinLimitlessFlg": e.detail
        });
      }
      this.sendIptMes();
    },
    onTotalJoinIptChange(e) {
      this.setData({
        "iptActivityInfo.totalJoin": parseInt(e.detail)
      });
    },
    switchChange(e){
      if(this.data.iptActivityInfo.price){
        this.setData({
          "iptActivityInfo.shareFlg": e.detail?1:0,
          "iptActivityInfo.rateFlg": 0,
          "iptActivityInfo.rate": '',
          "iptActivityInfo.amountFlg": 0,
          "iptActivityInfo.amount": '',
        });
        this.sendIptMes();
      }else{
        wx.showToast({
          title: '请先设置费用',
        })
      }
    },
    onRadioChange(e){
      console.log(e.detail)
      this.setData({
        "nop": e.detail,
        "baifenbi": '',
        "shuzhi": ''
      });
      var a,b
      if(this.data.nop == true){
        a = 1
        b = 0
      }else if(this.data.nop == false){
        a = 0
        b = 1
      }else{
        a = 0
        b = 0
      }
      this.setData({
        "iptActivityInfo.rateFlg": a,
        "iptActivityInfo.rate": '',
        "iptActivityInfo.amountFlg": b,
        "iptActivityInfo.amount": '',
      });
    },
    onfxIptChange: function(e) {
      var key = e.currentTarget.dataset.key
      var num = e.detail
      this.setData({
        [`${key}`]: num
      });
      if(key == 'baifenbi'){
        this.setData({
          'iptActivityInfo.rate': num
        })
      }
      if(key == 'shuzhi'){
        this.setData({
          'iptActivityInfo.amount': num
        })
      }
      this.sendIptMes();
    },
    shuzhiblur(){
      var num = 0
      if(this.data.shuzhi<this.data.maxhb && this.data.shuzhi>=0){
        num = this.data.shuzhi
      }else{
        num = this.data.maxhb
      }
      this.setData({
        "shuzhi": num,
        "iptActivityInfo.amount": num
      })
      this.sendIptMes()
    },
    baifenbiblur(){
      var num = 0
      if(this.data.baifenbi*1<30 && this.data.shuzhi*1>=0){
        num = this.data.baifenbi
      }else{
        num = 30
      }
      this.setData({
        "baifenbi": num,
        "iptActivityInfo.rate": num
      })
      this.sendIptMes()
    }
  },
})