// 首页机构小卡片
const app = getApp()
Component({
  properties: {
    orgItemData: {
      type: Object,
      value: {
        "addr": {
          "addr": "",
          "latitude": 0,
          "longitude": 0,
          "name": "",
          "place": "",
          "placeNo": ""
        },
        "id": 0,
        "img": "",
        "labelList": [],
        "name": "",
        "remark": ""
      }
    },
  },
  data: {
  },
  methods: {
    goToOrgItemDetails(e) {
      var id = e.currentTarget.dataset.id
      util.setId(id)
      wx.navigateTo({
        url: `../schoolHome/schoolHome?id=${id}`,
      })
    },
  }
})