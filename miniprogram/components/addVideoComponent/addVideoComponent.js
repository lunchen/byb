const app = getApp()
Component({
  properties: {
    activityData: {
      type: Object,
      value: {
        "hotsValue": "",
        "id": 0,
        "img": "",
        "levelName": "",
        "name": "",
        "remark": "",
        "status": 0,
        "totalCount": 0
      }
    },
  },
  data: {
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