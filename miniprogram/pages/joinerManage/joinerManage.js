// 搜索页
// joinerManage.js
const util = require('../../utils/util.js');
const apiServer = require('../../api/request.js');
//获取应用实例
const app = getApp()

Page({
  data: {
    //navbar
    // 导航头组件所需的参数
    nvabarData: {
      showCapsule: 1, //是否显示左上角图标   1表示显示    0表示不显示
      title: '报名者/预约者管理', //导航栏 中间的标题
      white: false, // 是就显示白的，不是就显示黑的。
      address: '' // 加个背景 不加就是没有
    },
    // 导航头的高度
    height: app.globalData.navheight,

    // 时间选择
    timeShow: false,
    value: '',
    minHour: 10,
    maxHour: 20,
    minDate: new Date(1960, 1, 1).getTime(),
    maxDate: new Date(2030, 12, 12).getTime(),
    currentDate: new Date().getTime(),
    show: false,
    time1: '',
    time2: '',
    picker: '',
    formatter(type, value) {
      if (type === 'year') {
        return `${value}年`;
      } else if (type === 'month') {
        return `${value}月`;
      }
      return value;
    },
    // 下拉
    selectList: [],
    defaultSelectList: {
      id: '',
      name: '请选择'
    },
    req:{
      "activityId": 0,
      "endTime": "",
      "nub": 0,
      "size": 0,
      "startTime": util.formatDate(new Date().getTime(),"yyyy-MM-dd"),
      "status": 0,
      "type": 0
    },
    count:"--",
    orderList: []
  },
  selectChange(e){
    // 由于select内部转换过key 所以取值时候 value->id label->name
    console.log(e.detail)
    this.setData({
      "req.status": e.detail.id
    })
  },
  onCloseTime() {
    this.setData({
      timeShow: false
    })
  },
  showTime() {
    this.setData({
      timeShow: true
    })
  },
  confirm(event) {
    var time = util.formatDate(event.detail, "yyyy-mm-dd");
    console.log(time)
    // 时间选择确定
    this.onCloseTime()
  },
  onSearch(event){
    this.getOrderList()
  },
  onCancel() {
    wx.navigateBack()
  },
  selectHandle(e){
    var index = e.currentTarget.dataset.index;
    this.setData({
      [`orderList[${index}].select`]: !this.data.orderList[index].select
    })
  },
  getOrderList() {
    var that = this;
    let req = this.data.req;
    req.startTime = new Date(req.startTime).getTime()
    req.startTime = ''
    console.log(req)
    apiServer.post(`/app/my/org/order`, req).then(res => {
      console.log(res.data);
      res.data.data.list.forEach(item =>{
        item.select = false;
      })
      that.setData({
        orderList: res.data.data.list,
        count: res.data.data.count
      })
    })
  },
  onLoad: function () {
    var that = this;
    wx.setNavigationBarColor({
      frontColor: '#000000',
      backgroundColor: '#fff'
    });
    apiServer.post('/app/my/org/order/select').then(res => {
      console.log(res.data);
      that.setData({
        selectList: res.data.data.list,
      })
    })
    this.getOrderList()
  },
})