// 活动小方块 活动列表用
const util = require('../../utils/util.js');
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
    userShareFlg: 0
  },
  attached(){
    this.setData({
      userShareFlg: wx.getStorageSync('userShareFlg') ? parseInt(wx.getStorageSync('userShareFlg')) : 0
    })
  },
  methods: {
    goToActivityDetails(e) {
      var id = e.currentTarget.dataset.id
      util.setId(id)
      wx.navigateTo({
        url: `../activityDetails/activityDetails?id=${id}`,
      })
    },
  }
})