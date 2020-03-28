// 视频编辑 用于学校详情 动态 荣誉学员教学视频等
//editVideoDesc.js
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
      title: '视频编辑', //导航栏 中间的标题
      white: false, // 是就显示白的，不是就显示黑的。
      address: '' // 加个背景 不加就是没有
    },
    // 导航头的高度
    height: app.globalData.navheight,
    show: false,
    value: '',
    nowIndex:'', //单前操作的图片index
    dataModel:{
      "id": '',
      "imgNo": "",
      "remark": "",
      "title": "",
      "type": 0,
      "url": ""
    },
    data:[],
    api: '',          //获取数据接口
    updateapi: '',      //更新数据接口
    prevIndex: '',       //上一个页面的跳转过来的下标 在动态编辑添加图片用到
    prevKey: ''       //上一个页面的跳转过来的列表取值key
  },
  onLoad: function (e) {
    console.log(e)
    wx.setNavigationBarColor({
      frontColor: '#000000',
      backgroundColor: '#fff'
    });
    var that = this;
    let api = e.api,
        updateapi = e.updateapi,
        data = [];
    this.setData({
      api: api,
      updateapi: updateapi
    })
    if (api) {
      apiServer.post(api).then(res => {
        console.log(res.data);
        that.setData({
          data: res.data.data.list,
        })
      })
    }else{
      // 通过本地存储获取动态编辑的数据 本地存储的图片仅做本地存储操作 最后统一提交
      wx.getStorageSync("addivList");
      let getData = JSON.parse(wx.getStorageSync("addivList"));
      let prevIndex = getData.index;
      let prevkey = getData.key
      let prevData = getData.list
      console.log("getData")
      console.log(getData)
      that.setData({
        prevIndex: prevIndex,
        data: prevData,
        prevKey: prevkey
      })
      console.log(that.data)
      console.log(5555)
    }
  },

  setIndex(e){
    // 设置下标 用于操作某一层图片
    var index = e.currentTarget.dataset.index
    this.setData({
      nowIndex: index,
    })
  },
  addNew(){
    // 添加空的编辑
    var data = this.data.data;
    console.log(this.data)
    if(data=='') data = []
    data.push({...this.data.dataModel})
    this.setData({
      data: data
    });
  },
  iptValue(e) {
    // 标题
    var index = this.data.nowIndex;
    var data = this.data.data
    data[index].title = e.detail.value
    this.setData({
      data: data
    });
  },
  getUploadMes: function (e) {
    // 获取上传的图片
    console.log(e)
    var index = this.data.nowIndex;
    var data = this.data.data
    data[index].url = e.detail.mes.url;
    data[index].type = e.detail.mes.type
    this.setData({
      data : data
    });
  },
  del(e) {
    // 删除图片 暂时做全删除
    var index = this.data.nowIndex;
    var data = this.data.data;
    data.splice(index, 1)
    this.setData({ 
      show: false,
      data : data
     });
  },

  onClickShow(e) {
    // 显示 删除是否确认的提示
    this.setData({ show: true });
    this.setIndex(e);
  },
  onClickHide() {
    // 隐藏 删除是否确认的提示
    this.setData({ show: false });
  },
  submit(){
    // 提交图片列表 并返回
    let data = this.data.data
    let updateapi = this.data.updateapi;
    if (updateapi){
      apiServer.post(updateapi, data).then(res => {
        console.log(res);
        wx.showToast({
          title: '修改成功',
          icon: 'loading',
          duration: 1000
        })
        var pages = getCurrentPages(); // 当前页面
        var beforePage = pages[pages.length - 2]; // 前一个页面
        setTimeout(function(){
          wx.navigateBack({
            // 返回并执行上一页面方法
            success: function () {
              beforePage.onLoad({}); // 执行前一个页面的方法
            }
          });
        },1200)
      })
    }else{
      var nowData = JSON.stringify({
        index: this.data.prevIndex, 
        key: this.data.prevKey, 
        list: this.data.data
      }) 
      console.log("nowData")
      console.log(this.data.prevKey)
      wx.setStorageSync("addivList", nowData)
      wx.showToast({
        title: '保存成功',
        icon: 'loading',
        duration: 1000
      })
      var pages = getCurrentPages(); // 当前页面
      var beforePage = pages[pages.length - 2]; // 前一个页面
      setTimeout(function () {
        wx.navigateBack({
          // 返回并执行上一页面方法
          success: function () {
            beforePage.backFn(nowData); // 执行前一个页面的方法
          }
        });
      }, 1200)
    }
  },
  methods:{
  }
})
