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
      wx.navigateTo({
        url: `../activityDetails/activityDetails?id=${id}`,
      })
    },
  }
})