const util = require('../../utils/util.js')
const app = getApp()
Component({
  properties: {
    iptActivityInfoData: {
      type: Object,
      value: {},
      observer: function (newVal, oldVal) { }
    },
  },
  data: {
    // 时间选择
    value: '',
    minHour: 10,
    maxHour: 20,
    minDate: new Date().getTime(),
    maxDate: new Date(2030, 10, 1).getTime(),
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
  },
  
  onLoad(){
  },
  methods: {
    // 返回上一页面
    _navback() {
      wx.navigateBack()
    },
    getTime: function (event) {
      var d = event.target.dataset.timename
      this.setData({
        show: true,
        picker: event.target.dataset.timename
      });
    },
    onClose: function () {
      this.setData({
        show: false
      });
    },
    confirm(event) {
      var _this = this;
      var time = util.formatDate(event.detail)
      this.setData({
        currentDate: event.detail,
        show: false,
        [_this.data.picker]: time
      });
      if (this.data.time1 && this.data.time2 && this.data.time1 > this.data.time2) {
        time = this.data.time1
        this.setData({
          time1: this.data.time2,
          time2: time
        });
      }
    },
    inOrOut(event) {

      this.setData({
        radio1: event.target.dataset.io
      });
    },
    onRadio2Change(event) {
      this.setData({
        radio2: event.detail
      });
    },
    onRadio3Change(event) {
      this.setData({
        radio3: event.detail
      });
    },
  }
})