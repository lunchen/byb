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
    searchValue: '',
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
      "activityId": '',
      "endTime": "",
      "nub": 0,
      "size": 0,
      // "startTime": util.formatDate(new Date().getTime(),"yyyy-MM-dd"),
      "startTime":'',
      "status": '',
      "type": ''       //1报名 2预约
    },
    count:"--",
    orderList: []
  },
  exportExcelHandle(){
    var that = this;
    let req = this.data.req;
    wx.showToast({
      title: '导出数据中，请稍后...',
      icon: 'loading'
    })
    req.startTime = new Date(req.startTime).getTime()
    apiServer.post(`/app/my/org/order/excel`, req).then(res => {
      console.log(res.data)
      var durl = res.data.data.string
      console.log(durl)
      // wx.showToast({
      //   title: '导出数据中，请稍后',
      //   icon: 'loading'
      // })

      wx.showToast({
        title: '导出成功',
        icon: 'none',
        duration: 1000
      })
      const downloadTask = wx.downloadFile({
        url: durl, //仅为示例，并非真实的资源
        success(res) {
          if (res.statusCode == 200){
            console.log("tempFilePath" + res.tempFilePath)
            wx.openDocument({
              filePath: res.tempFilePath,
              success(res){
                console.log(res)
              },
              fail(res) {
                console.log(res)
              }
            })
            wx.saveFile({
              tempFilePath: res.tempFilePath,
              success(res) {
                const savedFilePath = res.savedFilePath
                console.log(res)
              }
            })
          }
          // wx.playVoice({
          //   filePath: res.tempFilePath
          // })
        }
      })

      downloadTask.onProgressUpdate((res) => {
        console.log('下载进度', res.progress)
        console.log('已经下载的数据长度', res.totalBytesWritten)
        console.log('预期需要下载的数据总长度', res.totalBytesExpectedToWrite)
        // if (res.progress==100){
        //   wx.saveImageToPhotosAlbum()
        // }
      })
    })
  },
  selectChange(e){
    // 由于select内部转换过key 所以取值时候 value->id label->name
    console.log(e.detail)
    this.setData({
      "req.status": e.detail.id
    })

    console.log("select")
    this.getOrderList()
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
    // 时间选择确定
  confirm(event) {
    var _this = this;
    var time = util.formatDate(event.detail, "yyyy-MM-dd");
    this.setData({
      currentDate: event.detail,
      [`req.startTime`]: time
    });
    this.onCloseTime()
    this.getOrderList()
  },
  searchChange(event){
    this.setData({
      searchValue: event.detail
    })
  },
  onSearch(event){
    console.log("onsearch")
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
    if (req.startTime){
      req.startTime = new Date(req.startTime).getTime()
    }
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
  onLoad: function (e) {
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
    console.log(e)
    if (e.id == 'undefined'){
      this.setData({
        "req.type": e.type,
      })
    } else if (e.type == 'undefined'){
      this.setData({
        "req.activityId": 16,
      })
    } else {
      this.setData({
        "req.type": e.type,
        "req.activityId": e.id,
      })
    }

    console.log("load")
    this.getOrderList()
  },
})
