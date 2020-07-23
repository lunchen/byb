// 活动详情
//activityDetails.js
const util = require('../../utils/util.js')
const apiServer = require('../../api/request.js');
//获取应用实例
const app = getApp()

Page({
  data: {
    //navbar
    // 导航头组件所需的参数
    nvabarData: {
      showCapsule: 1, //是否显示左上角图标   1表示显示    0表示不显示
      title: '动态详情', //导航栏 中间的标题
      white: false, // 是就显示白的，不是就显示黑的。
      address: '' // 加个背景 不加就是没有
    },
    // 导航头的高度
    height: app.globalData.navheight,

    // 视频
    indicatorDots: true,
    vertical: false,
    autoplay: false,
    interval: 2000,
    duration: 500,
    indicatorColor: "#bbb",
    indicatorActiveColor: "#fff",
    current: 0,

    identity: wx.getStorageSync('identity') ? wx.getStorageSync('identity') : 1,       //1参与方 2主办方
    activityListData:{},
    loginShow: 0,
    signUpType: false,
    id: '',
    canvasImg: '',
    activeid:'-1',
    canIUseSaveImg:'',
    showActUp: false,
    miaoshashow: false
  },
  showList(e){
    var img = e.currentTarget.dataset.showimg
    if (img.type!=1){return}
    var imgArr = e.currentTarget.dataset.showimglist
    var delList = []
    imgArr.forEach(item=>{
      if(item.type==1){
        delList.push(item.url)
      }
    })
    wx.previewImage({
      current: img.url,     //当前图片地址
      urls: delList,               //所有要预览的图片的地址集合 数组形式
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  // 滑块
  swiperChange(e) {
    console.log(e)
    var that = this;
    var current = e.detail.current
    if (e.detail.source == 'touch') {
      that.setData({
        current: e.detail.current,
        activeid: that.data.activityListData.activityBannerList[e.detail.current].id
      })

    }
  }, 
  onPlay(e){
    console.log(e)
    this.setData({
      activeid: e.detail.activeId
    })
  },
  previewImage: function (e) {
    console.log(e)
    var imgArr = [this.data.canvasImg];
    wx.previewImage({
      current: imgArr[0],     //当前图片地址
      urls: imgArr,               //所有要预览的图片的地址集合 数组形式
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  //事件处理函数
  goToSchoolHome: function (e) {
    var id = e.currentTarget.dataset.id
    util.setId(id)
    wx.navigateTo({
      url: `../schoolHome/schoolHome?id=${id}`
    })
  },
  onLoad: function (e) {
    wx.setNavigationBarColor({
      frontColor: '#000000',
      backgroundColor: '#fff'
    });

    var that = this;
    let id = e ? e.id : '';
    if (e && e.scene) {
      var strs = decodeURIComponent(e.scene)
      id = strs.split("=")[1]
    }
    this.setData({
      id: id
    })
    if (id) {
      if(e && e.open==3){
        this.setData({
          loginShow: 3,
          signUpType: true
        })
      }
      apiServer.post(`/app/org/info/activity/info/${id}`).then(res => {
        // 设置选中的活动信息用于报名
        that.setData({
          "activityListData": res.data.data,
        })
      })
    }
  },

  imgLoaded(e) {
    this.setData({
      imageHeight: e.detail.height,
      imageWidth: e.detail.width
    })
    console.log("保存图片的尺寸")
  },

  onShareAppMessage: function (ops) {
    var json = encodeURIComponent(JSON.stringify({ a: 1 }));
    if (ops.from === 'button') {
      // 来自页面内转发按钮
    }
    return {
      title: '报1 报',
      path: '/pages/activityDetailsRecent/activityDetailsRecent?id=' + this.data.id,
      imageUrl: "",
      success: function (res) {
        // 转发成功
        console.log("转发成功:" + JSON.stringify(res));

      },
      fail: function (res) {
        // 转发失败
        console.log("转发失败:" + JSON.stringify(res));
      }
    }

  },
})
