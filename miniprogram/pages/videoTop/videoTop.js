const util = require('../../utils/util.js')
const apiServer = require('../../api/request.js');
const urls = [
  'http://1252076676.vod2.myqcloud.com/d7eee309vodgzp1252076676/2dbe7eca5285890794073052281/447nYOh5H2IA.mp4',
  'http://1252076676.vod2.myqcloud.com/d7eee309vodgzp1252076676/302875785285890794073167099/HhGL7OJObiYA.mp4',
  'http://1252076676.vod2.myqcloud.com/d7eee309vodgzp1252076676/30287db75285890794073167278/WVQpwkgnb9EA.mp4',
  'http://1252076676.vod2.myqcloud.com/d7eee309vodgzp1252076676/320e66af5285890794073202694/8ksYlGUevogA.mp4',
  'http://1252076676.vod2.myqcloud.com/d7eee309vodgzp1252076676/30010ead5285890794073141537/DGAx2EgLMEYA.mp4',
  'http://1252076676.vod2.myqcloud.com/d7eee309vodgzp1252076676/320ed9255285890794073203062/JyqT3zzDH4MA.mp4',
  'http://1252076676.vod2.myqcloud.com/d7eee309vodgzp1252076676/320ee16a5285890794073203247/okwtzftAVuwA.mp4',
  'http://1252076676.vod2.myqcloud.com/d7eee309vodgzp1252076676/2fcc59275285890794073114126/ySa5LZ3k4EcA.mp4'
]

const videoList = urls.map((url, index) => ({ id: index + 1, url }))
const app = getApp();
Page({
  data: {
    inputVideo:{},    //输入的第一个视频
    checkVideoList: [],   //暂时存储列表找出传入视频的位置
    current:0,            //记录输入视频在列表的位置
    nub:1,
    nvabarData: {
      showCapsule: 1, //是否显示左上角图标   1表示显示    0表示不显示
      title: '', //导航栏 中间的标题
      white: false, // 是就显示白的，不是就显示黑的。
      // whitecover: 'true',
      address: '', // 加个背景 不加就是没有
    },
    type: '',   //index主页视频流  course课程视频流
    id:'',      //主页的视频id  或者课程的id
    index: '',   //展示课程第几个视频
    height: app.globalData.navheight,
    appId: 'wx5f6ceb4b3eecfccf',
    shopId: '67448014',
    openId: '',
    customUrl: 'https://enlist-dev.oss-cn-hangzhou.aliyuncs.com/editVideo/2020/04/07/JGWn4DPjegoGNfWcsTzlvagHOIL-deo*HZg9ZTiUYNewEqTxHUDXbFHd9-ja-ZJhrr1QNuoNATRLcwsuGtSDWA$$.mp4',
    coverUrl: 'https://enlist-dev.oss-cn-hangzhou.aliyuncs.com/editVideo/2020/04/06/Oo2119LP0jYXUw6sYC0jYqWLkj3xPvcr4lIQU0eL2jVjfkdJx2Ig-QaNp1XIxuPZrr1QNuoNATRLcwsuGtSDWA$$.jpg',
  },
  onLoad(e) {
    var that = this;
    console.log(e)
    if (wx.getStorageSync("openId")){
      this.setData({
        openId: wx.getStorageSync("openId")
      })
    }else{
      wx.login({
        success(res) {
          console.log(res)
          apiServer.post(`/wechat/auth/jscode2session/${res.code}`).then(res => {
            console.log(res.data);
            wx.setStorageSync("openId", res.data.data.openid)
            that.setData({
              openId: res.data.data.openid
            })
          })
        }
      })
    }

    wx.setNavigationBarColor({
      frontColor: '#000000',
      backgroundColor: '#fff'
    });
    let id = e.id ? e.id : 1;
    this.setData({
      type:e.type,
      id: e.id,
      index:e.index
    })
    var getVideoList = []
    if (id && e.type=="index") {
      console.log(id)
      // 获取主页点击的视频的信息
      apiServer.post(`/indexVideo/info/id/${id}`).then(res => {
        var data = res.data.data
        res.data.data.url = res.data.data.video
        console.log(data)
        that.setData({
          inputVideo: data,
        })
      })
    }

    if (id && e.type == "course") {
      // 获取精品课程的视频
      that.getCourseVideoList()
    }

  },
  // 获取课程视频流列表
  getCourseVideoList(){
    var that = this
    var req = {
      "courseId": this.data.id,
      "nub": 1,
      "size": 100
    }
    apiServer.post(`/indexVideo/org/stream`, req).then(res => {
      res.data.data.list.forEach((item, index) => {
        item.url = item.video
      })
      that.setData({
        inputVideo: res.data.data.list[that.data.index]
      })
    }).catch(err=>{
      console.log("已经到底了")
    })
  },
  likeBtn(e) {
    console.log(66666)
    console.log(e.currentTarget.dataset.id)
    var id = e.currentTarget.dataset.id;
    this.setData({
      "inputVideo.likeFlg": 1
    })

    var req = {
      "id": id,
      "type": 2
    }
    apiServer.post(`/indexVideo/operating`, req).then(res => {
      console.log(res.data);
    })
  },
  methods:{
    
  },
  onPlay(e) {
    var that = this
    console.log('play', e.detail.activeId)
    // 当视频放到最后几个的时候从接口获取后续视频
  },

  onPause(e) {
     console.log('pause', e.detail.activeId)
  },

  onEnded(e) {},

  onError(e) {},

  onWaiting(e) {},

  onTimeUpdate(e) {},

  onProgress(e) {},

  onLoadedMetaData(e) {
    console.log('LoadedMetaData', e)
  },

  goToGetcourse(e) {
    var id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `../../pages/schoolHome/schoolHome?id=${id}&open=3`,
    })
  },
  goToSchoolHome(e) {
    var id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `../../pages/schoolHome/schoolHome?id=${id}`,
    })
  },
  onShow(){
    
  },
  onShareAppMessage: function (ops) {
    var json = encodeURIComponent(JSON.stringify({ a: 1 }));
    var path = '/pages/videoTop/videoTop?id=' + this.data.id + '&type=' + this.data.type
    if(this.data.index){
      path += '&index' + this.data.index
    }
    console.log(path)
    if (ops.from === 'button') {
      // 来自页面内转发按钮
      console.log(ops.target)
    }
    if (this.data.type)
    return {
      title: '报1 报',
      path: path,
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
