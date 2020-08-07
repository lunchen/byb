// 选择海报 
const util = require('../../utils/util.js');
const apiServer = require('../../api/request.js');
//获取应用实例
const app = getApp()
const imgList1 = [
  {name:'舞蹈',list:[111,222,333,444]},
  {name:'图2',list:[111,222,333,444]},
]
Page({
  data: {
    //navbar
    navbarShow: true,
    // 导航头组件所需的参数
    nvabarData: {
      showCapsule: 1, //是否显示左上角图标   1表示显示    0表示不显示
      title: '模板库', //导航栏 中间的标题
      white: false, // 是就显示白的，不是就显示黑的。
      address: '' // 加个背景 不加就是没有
    },
    // 导航头的高度
    height: app.globalData.navheight,
    id: "",      //编辑学校的id 
    active: 0,
    courseList:[],
    activeNames: [0,1],
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    posterList:imgList1
  },
  goToEdit(e) {
    var id = e.currentTarget.dataset.id
    console.log(id)
    if(id){
      var path = `../edit-dongTai/edit-dongTai?id=${id}`
    }else{
      var path = `../edit-dongTai/edit-dongTai`
    }
    wx.navigateTo({
      url: path
    })
  },
  getData(){
    var that = this;
    apiServer.post(`/app/org/update/info/recent/list`,'', 'get').then(res => {
      that.setData({
        courseList: res.data.data.list,
      })
    })
  },
  onChange(event) {
    this.setData({
      activeNames: event.detail,
    });
    console.log(this.data.activeNames)
  },
  onLoad: function (e) {
   
    wx.setNavigationBarColor({
      frontColor: '#000000',
      backgroundColor: '#fff'
    });
  },
  onShow(){
    this.getData()
  },
  getUserInfo: function(e) {
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
})
