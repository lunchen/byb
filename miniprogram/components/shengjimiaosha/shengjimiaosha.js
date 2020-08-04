// 升级秒杀
const util = require('../../utils/util.js');
const apiServer = require('../../api/request.js');
const app = getApp()
Component({
  properties: {
    // 原价
    orginPrice:{
      type: Number,
      value: 0,
      observer: function (newVal, oldVal) {
        
      }
    },
    miaoshashow: {
      type: Boolean,
      value: false,
      observer: function (newVal, oldVal) {
        if(newVal){
          this.showBtn()
          this.setData({
            'req.orginPrice': this.data.orginPrice
          })
        }else{
          this.closeBtn()
        }
       }
    },
    actId: {   // 报名的机构id
      type: Number | String,
      value: '',
    },
  },
  data: {
    display: false,
    showType: false,
    shareFlg: true,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    isIphoneX: app.globalData.isIphoneX,
    show: false,
    picker: '',
    msUrl:'',
    req:{
      endTime:'',
      hb:'',
      orginPrice:'',
      price:'',
      shareFlg:false,
      sharePrice:'0',
      shareRemark:'',
      shareTitle:'',
      startTime:'',
    },
    minDate: new Date(1990, 1, 1).getTime(),
    maxDate: new Date(2030, 12, 12).getTime(),
    currentDate: new Date().getTime(),
    nop:true,   //百分百或数值
    baifenbi:'',
    shuzhi:'',
    maxhb:'',
  },
  methods: {
    onRadioBlur1(){
      if(typeof (this.data.baifenbi*1) == 'number' && parseFloat(this.data.baifenbi)<=30 && parseFloat(this.data.baifenbi)>=0){
      }else{
        this.setData({
          baifenbi: 30
        })
      }
      var hb = parseInt((this.data.req.price-this.data.req.sharePrice)*this.data.baifenbi)/100
      this.setData({
        "req.hb": hb
      })
      console.log("hb",this.data.req.hb)
    },
    onRadioBlur2(){
      if(typeof (this.data.shuzhi*1) == 'number' && parseFloat(this.data.shuzhi)<=parseFloat(this.data.maxhb) && parseFloat(this.data.shuzhi)>=0){
      }else{
        this.setData({
          shuzhi: this.data.maxhb
        })
      }
      var hb =parseInt(this.data.shuzhi*100)/100 
      this.setData({
        "req.hb": hb
      })
      console.log("hb",this.data.req.hb)


    },
    onPriceBlur(){
      if(!(this.data.req.price*1)){
        this.setData({
          'req.price': this.data.req.orginPrice
        })
      }
      
    },
    
    onSharePriceBlur(){
      if(!(this.data.req.sharePrice*1) || this.data.req.sharePrice*1 > this.data.req.price*1){
        this.setData({
          'req.sharePrice': 0
        })
      }
      this.setData({
        maxhb: parseInt((this.data.req.price-this.data.req.sharePrice)*100)/100*0.3*10/10
      })
    },
    onRadioChange(event) {
      console.log(event.detail)
      this.setData({
        "nop": event.detail,
        "baifenbi": '',
        "shuzhi": ''
      });
    },
    switchChange(e){
      if(this.data.req.price !='' && this.data.req.price*1>=0 && this.data.req.sharePrice!='' && this.data.req.sharePrice*1>=0){
        this.setData({ 'req.shareFlg': e.detail });
      }else{
        this.setData({ 'req.shareFlg': false });
        wx.showToast({
          icon: 'none',
          title:'提示：请输入活动价和分享扣减金额后再设置分销金额',
          duration: 1500
        })
      }
      if(this.data.req.shareFlg == false){
        this.setData({ 
          'req.hb': '',
          baifenbi: '',
          shuzhi:'',
         });
      }
    },
    onTransitionEnd: function(){
      var _this = this
      setTimeout(function () { 
        if (!_this.data.showType && _this.data.display) {
          _this.setData({ display: false });
        }
       }, 300);
    },
    closeBtn: function () {
      this.setData({
        "showType": false
      });
      this.onTransitionEnd();
    },
    sjmsOnClose(){
      // 关闭该弹窗
      this.setData({
        'req.shareFlg': false,
        'req.endTime':'',
        'req.hb':'',
        'req.orginPrice':'',
        'req.price':'',
        'req.sharePrice':'0',
        'req.shareRemark':'',
        'req.shareTitle':'',
        'req.startTime':'',
      })
      this.triggerEvent('sjmsClose',{})
    },
    onClose: function () {
      this.setData({
        show: false
      });
    },
    showBtn: function () {
      var _this = this;
      this.setData({
        "display": true
      })
      setTimeout(function () {
        _this.setData({
          "showType": true,
        })
      }, 20);
    },
    sub() {
      // 提交结果 调用生成订单
      var that = this
      console.log(this.data.req)
      var req = JSON.parse(JSON.stringify(this.data.req))
      if(req.shareFlg){
        req.shareFlg = 1
      }else{
        req.shareFlg = 0
      }
      if(parseFloat(req.price) >parseFloat(req.orginPrice)){
        wx.showToast({
          icon: 'none',
          title:'提示：原价应大于活动价',
          duration: 1000
        })
        return
      }
      if(parseFloat(req.sharePrice) >parseFloat(req.price)){
        wx.showToast({
          icon: 'none',
          title:'提示：活动价大于分享扣减金额',
          duration: 1000
        })
        return
      }
      if(parseFloat(req.price)-parseFloat(req.sharePrice) <parseFloat(req.hb)){
        wx.showToast({
          icon: 'none',
          title:'提示：分享减价后价格大于红包金额',
          duration: 1000
        })
        return
      }
      apiServer.post(`/app/activity/spike2/${this.data.actId}`,req).then(res => {
        wx.showToast({
          icon: 'none',
          title:'提交成功',
          duration: 1000
        })
        that.setData({
          msUrl: res.data.data.string
        })
        that.copy()
      })
    },

    getTime: function (event) {
      var d = event.target.dataset.timename
      this.setData({
        show: true,
        picker: event.target.dataset.timename
      });
    },

    confirm(event) {
      // 时间选择确定
      var _this = this;
      var time = util.formatDate(event.detail),
          time1 = _this.data.req.startTime,
          time2 = _this.data.req.endTime,
          active = _this.data.picker;
      this.setData({
        currentDate: event.detail,
        show: false,
        [`req.${active}`]: time
      });

      time1 = _this.data.req.startTime;
      time2 = _this.data.req.endTime;
      if (time1 && time2 && time1 > time2) {
        this.setData({
          "req.startTime": time1,
          "req.endTime": time1
        });
      }
    },
    onIptChange: function(e) {
      console.log(e)
      this.setData({
        [`req.${e.currentTarget.dataset.key}`]: e.detail
      });
    },
    onIptChange1: function(e) {
      this.setData({
        [`${e.currentTarget.dataset.key}`]: e.detail
      });
    },
    addImg(){
      var that = this;
      util.uploadImg("lineBill").then(res => {
        that.setData({
          userImg: res.data.string
        })
      })
    },
    copy() {
      var that = this
      if(this.data.msUrl){
        that.sjmsOnClose()
        wx.setClipboardData({
          data: this.data.msUrl,
          success: function (res) {
            wx.getClipboardData({
              success: function(res) {
                wx.showModal({
                  title: '提示',
                  content: '活动链接已复制，赶快去分享吧~',
                  showCancel:false,
                  success: function (res) {
                    if (res.cancel) {
                    } else if (res.confirm) {
                    }
                  }
                })
              }
            })
          }
        })
      }
     
    },
  },
})