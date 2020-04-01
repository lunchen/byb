// 登陆 选择课种等
const util = require('../../utils/util.js');
const apiServer = require('../../api/request.js');
const app = getApp()
Component({
  properties: {
    orgId: {   // 报名类型 true免费 false花钱
      type: Number | String,
      value: '',
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
    onlyLogin: {
      //是否需要选择课程  true 表示父组件为学校主页需要选 false 表示父组件为活动详情不用选
      type: Boolean,
      value: false,
    },
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
          }
        } else if (newVal == 2){
          this.setData({
            activitySelected: JSON.parse(wx.getStorageSync("activitySelected")),
            stepValue: 1
          })
          this.calcMoney()
        } else if (newVal == 4) {
          this.setData({
            telephone: '',
            smsCode: ''
          })
          this.calcMoney()
        }
        
      }
    },
  },
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
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
    telephone: '',
    smsCode:'',
    dt:61,
    joinTel:'',
    joinName:'',
    orderNo: '',
    stepValue: 1,
    totalMoney: '',
    userInfoModel: {
      "addr": {
        "addr": "",
        "city": "",
        "district": "",
        "id": 0,
        "latitude": 0,
        "longitude": 0,
        "name": "",
        "place": "",
        "placeNo": "",
        "province": ""
      },
      "birthday": "",
      "heardImg": "",
      "nickName": "",
      "sex": 0,
      "sexName": "",
      "userNo": ""
    }
  },
  methods: {
    calcMoney(){
      // 计算总价
      var money = 0;
      if (this.data.activitySelected.price && !this.data.signUpType) {
        money = this.data.activitySelected.price
      }
      this.setData({
        totalMoney: money * this.data.stepValue
      })
    },
    stepperChange(e) {
      // 计数器变化 票数
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
          activityList: res.data.data.list,
          activeityDefaultOption: res.data.data.list[0],
        })
      })
    },
    toNext(e){
      //登录的下一步
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
      var hasLogin = util.checkLogin()
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
      console.log(this.data)
      var _this = this
      var url
      if(this.data.signUpType){
        url = "/app/activity/free/trial"
      } else {
        url = "/app/activity/join"
      }
      var data = {
        "flg": this.data.baseSelected.id,
        "id": this.data.activitySelected.value,
        "orgId": this.data.orgId,
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
        if (_this.data.signUpType) {
          _this.goToSignUpSuccess(res.data.data.orderNo)
        } else {
          _this.goToConfirmOrder(res.data.data.orderNo)
        }
        
      }).catch(err=>{
        wx.showToast({
          title: err.data.msg,
          icon: 'none',
          duration: 5000
        })
      })
    },
    dtFn(e){
      // 验证码重新获取倒计时
      var _this = this;
      var dt = parseInt(this.data.dt);
      if (dt < 61 && dt > 0){
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
    goToSignUpSuccess(e) {
      var orderNo = e
      wx.navigateTo({
        url: `../signUpSuccess/signUpSuccess?orderNo=${orderNo}`,
      })
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
    bindGetUserInfo(e) {
      // 微信一键登录获取用户信息 提示授权
      var _this = this
      _this.setData({
        "userInfoModel.nickName": e.detail.userInfo.nickName,
        "userInfoModel.heardImg": e.detail.userInfo.avatarUrl,
        "userInfoModel.sex": e.detail.userInfo.gender,
      })
      wx.getSetting({
        success(res) {
          if (res.authSetting['scope.userInfo']) {
            _this.wxChatLogin()
          }
        }
      })
    },
    wxChatLogin(){
      // 微信登录
      var _this = this
      wx.showToast({
        title: '微信一键登录中，请稍后',
        icon: 'loading',
        duration: 2000
      })
       wx.login({
         success(res) {
          console.log(res)
          if (res.code) {
            apiServer.post(`/wechat/auth/jscode2session/${res.code}`).then(res => {
              console.log(res.data.data.data)
              wx.showToast({
                title: '登录成功',
                icon: 'loading',
                duration: 2000
              })
              wx.setStorageSync('identity', 1)
              var token = {
                token: res.data.data.data.login.token,
                authorization: res.data.data.data.login.authorization,
              }
              wx.setStorageSync("token", JSON.stringify(token))
              if (!_this.data.onlyLogin) {
                _this.triggerEvent('changeFLogin', {
                  loginShow: 3
                })
              } else {
                _this.triggerEvent('changeFLogin', {
                  loginShow: 0
                })
                if (res.data.data.data.user == 0) {
                  _this.updataInfo()
                }
              }
            })
          } else {
            console.log('登录失败！' + res.errMsg)
          }
        }
      })
    },
    // 微信一键登陆后同步信息到后台
    updataInfo() {
      var _this = this;
      var req = this.data.userInfoModel
      console.log(req)
      apiServer.post('/app/user/update', req).then(res => {
        if (getCurrentPages().length != 0) {
          //刷新当前页面的数据
          getCurrentPages()[getCurrentPages().length - 1].renews()
        }
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
      if (telephone == "") {
        wx.showToast({
          title: '请输入手机号',
          icon: 'none',
          duration: 1000
        })
        return
      }
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
      if (data.code == ""){
        wx.showToast({
          title: '请输入验证码',
          icon: 'none',
          duration: 1000
        })
        return
      }
      apiServer.post(`/app/login/login`, data).then(res => {
        console.log(res.data);
        _this.setData({
          showLogin: 0
        })
        wx.showToast({
          title: '登录成功',
          icon: 'loading',
          duration: 1000
        })
        wx.setStorageSync('identity', 1)
        wx.setStorageSync("token", JSON.stringify(res.data.data))
        if (!_this.data.onlyLogin){
          _this.triggerEvent('changeFLogin', {
            loginShow: 3
          })
        }else{
          _this.triggerEvent('changeFLogin', {
            loginShow: 0
          })
          console.log(1)

          if (getCurrentPages().length != 0) {
            console.log(2)
            console.log(getCurrentPages()[getCurrentPages().length - 1])
            //刷新当前页面的数据
            getCurrentPages()[getCurrentPages().length - 1].renews()
          }
        }
      }).catch(err=>{
        console.log(err)
      })
    }
  },
})