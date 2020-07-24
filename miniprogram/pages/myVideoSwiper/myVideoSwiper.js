const util = require('../../utils/util.js')
const apiServer = require('../../api/request.js');
const urls = [
  'http://1252076676.vod2.myqcloud.com/d7eee309vodgzp1252076676/2dbe7eca5285890794073052281/447nYOh5H2IA.mp4?a=1',
  'http://1252076676.vod2.myqcloud.com/d7eee309vodgzp1252076676/302875785285890794073167099/HhGL7OJObiYA.mp4?a=2',
  'http://1252076676.vod2.myqcloud.com/d7eee309vodgzp1252076676/30287db75285890794073167278/WVQpwkgnb9EA.mp4?a=3',
  'http://1252076676.vod2.myqcloud.com/d7eee309vodgzp1252076676/320e66af5285890794073202694/8ksYlGUevogA.mp4?a=4',
  'http://1252076676.vod2.myqcloud.com/d7eee309vodgzp1252076676/30010ead5285890794073141537/DGAx2EgLMEYA.mp4?a=5',
  'http://1252076676.vod2.myqcloud.com/d7eee309vodgzp1252076676/320ed9255285890794073203062/JyqT3zzDH4MA.mp4?a=6',
  'http://1252076676.vod2.myqcloud.com/d7eee309vodgzp1252076676/320ee16a5285890794073203247/okwtzftAVuwA.mp4?a=7',
  'http://1252076676.vod2.myqcloud.com/d7eee309vodgzp1252076676/2fcc59275285890794073114126/ySa5LZ3k4EcA.mp4?a=8'
]

const videoList = urls.map((url, index) => ({ id: index + 1, url }))
Page({
  data: {
    videoList: [],
    inputVideo:{},    //输入的第一个视频
    checkVideoList: [],   //暂时存储列表找出传入视频的位置
    current:1,            //记录输入视频在列表的位置
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
    activeId:'', //正在播放的视频id
    shareCover:'', //正在播放的视频封面图
    shareName:'', //正在播放的视频标题或线上体验名字
  },
  onShow(e){
    console.log("show")
  },
  onLoad(e) {
    console.log("load")
    var that = this;
    wx.setNavigationBarColor({
      frontColor: '#000000',
      backgroundColor: '#fff'
    });
    console.log("onload")
    console.log(e)
    if(e){
      let id = e ? e.id : '';
      this.setData({
        type: e.type,
        id: e.id,
        videoId: e.videoId
      })

      if (e.scene) {
        console.log('scene')
        console.log(e)
        var strs = decodeURIComponent(e.scene)
        let d = strs.split("=")
        if (d[2] == "course") {
          this.setData({
            type: d[2],
            id: d[3],
            videoId: d[1]
          })
        }else{
          this.setData({
            type: d[2],
            id: d[1],
          })
        }
      }

      var getVideoList = []
      if (this.data.id && this.data.type == "index") {
        console.log(id)
        // 获取主页点击的视频的信息
        apiServer.post(`/indexVideo/info/id/${this.data.id}`).then(res => {
          var data = res.data.data
          that.setData({
            inputVideo: data,
          })
          that.firstGetIndexVideoList()
        })
      }

      if (this.data.id && this.data.type == "course") {
        console.log(222)
        // 获取精品课程的视频
        that.getCourseVideoList()
      }
    }

  },
  // 获取课程视频流列表
  getCourseVideoList() {
    var that = this
    var req = {
      "courseId": this.data.id,
      "nub": this.data.nub,
      "size": 20
    }
    if (this.data.videoId) {
      req.id = this.data.videoId
    }
    apiServer.post(`/indexVideo/org/stream`, req).then(res => {
      console.log("获取了课程更多")
      res.data.data.list.forEach((item, index) => {
        item.url = item.video
      })
     
      if (res.data.data.list.length>0){
        that.setData({
          nub: that.data.nub + 1,
          videoList: res.data.data.list
        })
      }
    }).catch(err=>{
      console.log("已经到底了")
    })
  },
  getIndexVideoList() {
    var that = this
    var req = {
      nub: that.data.nub,
      size: 10,
    }
    apiServer.post(`/indexVideo/index/stream`, req).then(res => {
      console.log("获取了主页更多")
      res.data.data.list.forEach((item, index) => {
        item.url = item.video
      })
      if (res.data.data.list.length>0){
        that.setData({
          nub: that.data.nub + 1,
          videoList: res.data.data.list
        })
      }
    })
  },
  // 主页进来时候获取视频流列表直到找到当前点击的视频为止
  firstGetIndexVideoList() {
    var that = this
    var req = {
      nub: that.data.nub,
      size: 10,
    }
    var has = false
    apiServer.post(`/indexVideo/index/stream`, req).then(res => {
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
        this.firstGetIndexVideoList()
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
  onChange(e){
    console.log('play', e.detail.activeId)
    this.setData({
      activeId: e.detail.activeId
    })
  },
  onPlay(e) {
    var that = this
    console.log('play', e.detail)
    if(this.data.type== "index"){
      this.setData({
        shareName: e.detail.name,
        shareCover: e.detail.cover,
        activeId: e.detail.activeId

      })
    }
    if(this.data.type == "course"){
      this.setData({
        shareName: e.detail.name,
        shareCover: e.detail.cover,
        id: e.detail.courseId,
        activeId: e.detail.activeId
      })
    }
    // 当视频放到最后几个的时候从接口获取后续视频
    // var videoList = this.data.videoList
    // if (e.detail.activeId == videoList[videoList.length - 2].id || e.detail.activeId == videoList[videoList.length - 1].id) {
    //   console.log("needmore")
    //   // 主页获取后续视频
    //   if (this.data.type == "index") {
    //     this.getIndexVideoList()
    //   }
    //   if (this.data.type == "course") {
    //     console.log("togetcoursemore")
    //     this.getCourseVideoList()
    //   }
  },
  onEnding(){
    // 当视频放到最后几个的时候从接口获取后续视频
    console.log("needmore")
    // 主页获取后续视频
    if (this.data.type == "index") {
      this.getIndexVideoList()
    }
    if (this.data.type == "course") {
      console.log("togetcoursemore")
      this.getCourseVideoList()
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
  },

  onShareAppMessage: function (ops) {
    var json = encodeURIComponent(JSON.stringify({ a: 1 }));
    var id
    if (this.data.type == "index"){
      id = this.data.activeId
    }else{
      id = this.data.id
    }
    var path = '/pages/myVideoSwiper/myVideoSwiper?id=' + id + '&type=' + this.data.type
    if (this.data.type == "course") {
      path += '&videoId=' + this.data.activeId
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
  
  //用户点击右上角分享朋友圈
	onShareTimeline: function (ops) {
    var json = encodeURIComponent(JSON.stringify({ a: 1 }));
    var id
    if (this.data.type == "index"){
      id = this.data.activeId
    }else{
      id = this.data.id
    }
    var path = 'id=' + id + '&type=' + this.data.type
    if (this.data.type == "course") {
      path += '&videoId=' + this.data.activeId
    }
    console.log(path)
    if (ops.from === 'button') {
      // 来自页面内转发按钮
      console.log(ops.target)
    }
     
    return {
      title: this.data.shareName,
      query: path,
      imageUrl: this.data.shareCover
    }
	
	},
})
