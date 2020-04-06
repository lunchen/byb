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
Page({
  data: {
    videoList:[],
    inputVideo:{},    //输入的第一个视频
    checkVideoList: [],   //暂时存储列表找出传入视频的位置
    current:0,            //记录输入视频在列表的位置
    nub:1,
    nvabarData: {
      showCapsule: 1, //是否显示左上角图标   1表示显示    0表示不显示
      title: '', //导航栏 中间的标题
      white: 'true', // 是就显示白的，不是就显示黑的。
      whitecover: 'true',
      address: '', // 加个背景 不加就是没有
    },
    type: '',   //index主页视频流  course课程视频流
    id:'',      //主页的视频id  或者课程的id
  },
  onLoad(e) {
    var that = this;
    console.log(e)
    wx.setNavigationBarColor({
      frontColor: '#000000',
      backgroundColor: '#fff'
    });
    let id = e.id ? e.id : 1;
    this.setData({
      type:e.type,
      id: e.id
    })
    var getVideoList = []
    if (id && e.type=="index") {
      console.log(id)
      // 获取主页点击的视频的信息
      apiServer.post(`/indexVideo/info/id/${id}`).then(res => {
        var data = res.data.data
        that.setData({
          inputVideo: data,
        })
        that.firstGetIndexVideoList()
      })
    }

    if (id && e.type == "course") {
      // 获取精品课程的视频
      that.getCourseVideoList()
    }

    // 开发中
    // that.getCourseVideoList()
    // this.setData({
    //   type: "course",
    //   id: 1
    // })
    // 开发中
  },
  // 获取课程视频流列表
  getCourseVideoList(){
    var that = this
    var req = {
      "courseId": this.data.id,
      "nub": this.data.nub,
      "size": 6
    }
    apiServer.post(`/indexVideo/org/stream`, req).then(res => {
      res.data.data.list.forEach((item, index) => {
        item.url = item.video
      })
      var newdata
      if (that.data.videoList.length>0){
        newdata = that.data.videoList
        newdata.push(...res.data.data.list)
      }else{
        newdata = res.data.data.list
      }
      that.setData({
        nub: that.data.nub + 1,
        videoList: newdata
      })
      console.log("newdata")
      console.log(that.data)
      console.log(that.data.videoList)
    }).catch(err=>{
      console.log("已经到底了")
    })
  },
  getIndexVideoList() {
    var that = this
    var req = {
      nub: that.data.nub,
      size: 6,
    }
    apiServer.post(`/indexVideo/index/stream`, req).then(res => {
      console.log(res.data.data.list)
      var newdata = that.data.checkVideoList
      newdata.push(...res.data.data.list)
      newdata.forEach((item, index) => {
        item.url = item.video
      })
      that.setData({
        nub: that.data.nub + 1,
        videoList: newdata
      })
    })
  },
  // 主页进来时候获取视频流列表直到找到当前点击的视频为止
  firstGetIndexVideoList() {
    var that = this
    var req = {
      nub: that.data.nub,
      size: 6,
    }
    var has = false
    apiServer.post(`/indexVideo/index/stream`, req).then(res => {
      console.log(res.data.data.list)
      var newdata = that.data.checkVideoList
      newdata.push(...res.data.data.list)
      newdata.forEach((item, index) => {
        item.url = item.video
        if (item.id == that.data.inputVideo.id) {
          has =  true;
          that.setData({
            current: index
          })
        }
      })
      if (!has) {
        that.setData({
          nub: that.data.nub + 1,
          checkVideoList: newdata
        })
        that.apiVideoList()
      }else{
        that.setData({
          nub: that.data.nub + 1,
          videoList: newdata
        })
      }
    })
  },
  methods:{
    
  },
  addurl(data) {
    data.forEach(item=>{
      item.url = item.video
    })
    return data
  },
  onPlay(e) {
    var that = this
    console.log('play', e.detail.activeId)
    // 当视频放到最后几个的时候从接口获取后续视频
    var videoList = this.data.videoList
    if (e.detail.activeId == videoList[videoList.length - 2].id || e.detail.activeId == videoList[videoList.length - 1].id){
      console.log("needmore")
      console.log(this.data)
      // 主页获取后续视频
      if(this.data.type == "index"){
        this.getIndexVideoList()
      }
      if (this.data.type == "course"){
        console.log("togetcoursemore")
        this.getCourseVideoList()
      }
    }
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
  }
})
