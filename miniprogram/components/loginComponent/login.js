// 登陆 选择课种等
const apiServer = require('../../api/request.js');
const app = getApp()
Component({
  properties: {
    showType: {   // 显示的弹窗
      type: Number,
      value: 0,
      observer: function (newVal, oldVal) {
        if (newVal == 1){
          this.getSelect()
          if (this.data.needChooseCourse){
            this.setData({
              baseSelected: '',
              activitySelected: '',
              stepValue: 1
            })
          }else{
            this.setData({
              activitySelected: wx.getStorageSync("activitySelected"),
              stepValue: 1
            })
          }
        }
      }
    },
    signUpType: {   // 报名类型 true免费 false花钱
      type: Boolean,
      value: false,
      observer: function (newVal, oldVal) {
      }
    },
    needChooseCourse: {
      //是否需要选择课程  true 表示父组件为学校主页需要选 false 表示父组件为活动详情不用选
      type: Boolean,
      value: true,
    },
  },
  data: {
    isIphoneX: app.globalData.isIphoneX,
    baseDefaultOption: {
      id: '000',
      name: '是否有基础'
    },
    baseList: [{ // 选择有无基础下拉
        id: 1,
        name: '是'
        },{
          id: 0,
          name: '否'
    }],   
    activeityDefaultOption:{
      id: '000',
      name: '活动名称'
    },
    activityList: [],    // 选择课程下拉
    baseSelected: '',    //是否有基础的选择
    activitySelected: '',    //课程的选择
    showLogin: 0,    //登录切换手机号登录
    telephone1: '13777822654',
    telephone: '17826833703',
    smsCode:'913452',
    dt:61,
    joinTel:'',
    joinName:'',
    orderNo: '',
    stepValue: 1,
    totalMoney: '',
  },
  methods: {
    calcMoney(){
      // 计算总价
      var money = 0;
      if (this.data.activitySelected.price){
        money = this.data.activitySelected.price
      }
      this.setData({
        totalMoney: money * this.data.stepValue
      })
    },
    stepperChange(e) {
      // 计数器变化 票数
      console.log(e)
      this.setData({
        stepValue: e.detail
      })
      this.calcMoney()
    },
    selectChange(e) {
      // 由于select内部转换过key 所以取值时候 value->id label->name 设置被选中的活动
      if (this.data.showType==1){
        var select = this.data.activityList.filter(item => item.value == e.detail.id)[0]
        if (this.data.signUpType) select.price = 0
        this.setData({
          activitySelected: select
        })
      } else if (this.data.showType == 3){
        var select = this.data.baseList.filter(item => item.id == e.detail.id)[0]
        console.log(select)
        this.setData({
          baseSelected: select
        })
      }
      this.calcMoney()
    },
    getSelect() {
      //获取下拉
      var _this = this
      var data = JSON.parse(wx.getStorageSync('aliveData'))
      var orgId = data.id
      console.log(data)
      apiServer.post(`/app/activity/select/orgId/${orgId}`).then(res => {
        console.log(res.data);
        _this.setData({
          activityList: res.data.data.list
        })
      })
    },
    toNext(e){

      // this.goToConfirmOrder()
      // return
      // 下一步
      var next = e.currentTarget.dataset.next
      if (this.data.showType == 1){
        if (this.data.activitySelected ==''){
          wx.showToast({
            title: '请选择课程',
            icon: 'none',
            duration: 2000
          })
          return
        }
      }
      
      this.triggerEvent('changeFLogin', {
        loginShow: next
      })
    },
    sub() {
      // 提交结果 调用生成订单
      var hasLogin = true
      if (this.data.showType == 3) {
        if (this.data.baseSelected == '' || this.data.joinName == '' || this.data.joinTel == '') {
          wx.showToast({
            title: '请输入完整信息后再提交',
            icon: 'none',
            duration: 2000
          })
          return
        }
      }
      if (hasLogin) {
        this.generateOrder()
      } else {
        this.triggerEvent('changeFLogin', {
          loginShow: 4
        })
      }
    },
    generateOrder(){
      // 生成订单
      wx.showToast({
        title: '',
        icon: 'loading',
        duration: 5000
      })

      var _this = this
      var url
      if(this.data.signUpType){
        url = "/app/activity/free/trial"
      } else {
        url = "/app/activity/join"
      }
      console.log(this.data)
      var data = {
        "flg": this.data.baseSelected.id,
        "id": this.data.activitySelected.value,
        "name": this.data.joinName,
        "telephone": this.data.joinTel,
        "count": this.data.stepValue
      }
      console.log(data)
      apiServer.post(url, data).then(res => {
        console.log(res.data);
        _this.setData({
          orderNo: res.data.data.orderNo
        })
        wx.hideToast();
        _this.onClose()
        _this.goToConfirmOrder(res.data.data.orderNo)
      })
    },
    dtFn(e){
      // 验证码重新获取倒计时
      var _this = this;
      var dt = this.data.dt;
      if (dt < 61){
        setTimeout(function () {
          dt = dt-1;
          _this.setData({
            dt: dt
          })
          _this.dtFn()
        }, 1000)
      }else {
        dt = 61
        _this.setData({
          dt: dt
        })
      }
    },
    goToConfirmOrder(e) {
      // 跳转确认订单页
      var orderNo = e
      orderNo = "O15852908889622020032700006"; //有价格
      orderNo =  "O15852910547172020032700007"    // 无价格
      wx.navigateTo({
        url: `../confirmOrder/confirmOrder?orderNo=${orderNo}`,
      })
    },
    onClose(){
      // 关闭弹窗
      this.triggerEvent('changeFLogin', {
        loginShow: 0
      })
    },

    joinNameIpt(e) {
      // 预约者姓名输入
      this.setData({
        joinName: e.detail.value
      })
    },
    joinTelIpt(e) {
      // 预约者电话输入
      this.setData({
        joinTel: e.detail.value
      })
    },
    telLoginHandle() {
      // 电话注册登录下一步 去填信息
      this.setData({
        showLogin:1
      })
    },
    loginTelIpt(e) {
      // 电话注册填电话
      this.setData({
        telephone: e.detail.value
      })
    },
    getSms() {
      // 获取短信验证码
      var _this = this;
      var telephone = this.data.telephone
      apiServer.post(`/app/login/code`, { "telephone":telephone}).then(res => {
        console.log(res.data);
        wx.showToast({
          title: '获取验证码成功，请查看短信',
          icon: 'none',
          duration: 2000
        })
        _this.setData({
          dt : 60
        })
        _this.dtFn()
      })
    },
    loginSmscodeIpt(e) {
      // 验证码输入
      this.setData({
        smsCode: e.detail.value
      })
    },
    loginEsc() {
      // 取消电话输入返回上一步
      this.setData({
        showLogin: 0
      })
    },
    loginHandle() {
      // 手机号注册登录提交
      var _this = this
      var data = {
        "code": this.data.smsCode,
        "telephone": this.data.telephone,
      }
      apiServer.post(`/app/login/login`, data).then(res => {
        console.log(res.data);
        _this.setData({
          showLogin: 0
        })
        _this.triggerEvent('changeFLogin', {
          loginShow: 0
        })
        _this.goTo()
      }).catch(err=>{
        console.log(err)
      })
    }
  },
})