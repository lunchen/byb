// 登陆 选择课种等
const apiServer = require('../../api/request.js');
const app = getApp()
Component({
  properties: {
    showType: {
      type: Number,
      value: 0
    },
  },
  data: {
    isIphoneX: app.globalData.isIphoneX,
    inputValue: 1,
    activeityDefaultOption:{
      id: '000',
      name: '活动名称'
    }
  },

  methods: {
    goToActivityDetails(e) {
      var id = e.currentTarget.dataset.id
      util.setId(id)
      wx.navigateTo({
        url: `../activityDetails/activityDetails?id=${id}`,
      })
    },
    onClose(){
      this.triggerEvent('changeFLogin', {
        loginShow: 0
      })
    },
    loginHandle() {
      var data = {
        "code": "",
        "telephone": "13777822654",
      }
      apiServer.post(`/app/login/login`, data).then(res => {
        console.log(res.data);
       
      })
    }
  },
  created(){
    console.log(369)
  }
})