// 显示图片或视频 点击视频放大还需添加 图片流可划动还需修改
const app = getApp()
Component({
  properties: {
    objectFit: {
      type: String,
      value: '',
      observer: function (newVal, oldVal) {
      }
    },
    src: {
      type: String,
      value: '',
      observer: function (newVal, oldVal) {
        this.setVideo()
      }
    },
    cover: {
      type: String,
      value: '',
      observer: function (newVal, oldVal) {
      }
    },
    type: {
      type: Number,
      value: 1    //1图片 2视频 视频必须传入宽高
    },
    scpb: {
      type: Boolean,
      value: false    //中间控制按钮是否显示
    },
    muted: {
      type: Boolean,
      value: true    //true可以点击查看 false不能点击查看
    },
    show: {
      type: Boolean,
      value: true    //true可以点击查看 false不能点击查看
    },
    height: {
      type: Number,
      value: 0
    },
    width: {
      type: Number,
      value: 0
    },
    videoid: {      //外部传入的视频id
      type: Number || String,
      value: 0
    },
    activeid: {     //外部传入的正在播放的第几个视频 用于控制播放列表上第几个视频
      type: Number,
      value: -1,
      observer: function (newVal, oldVal) {
        this.playCurrent()
      }
    },
    index: {        //外部传入的这是排在第几个
      type: Number,
      value: 0
    },
  },
  data: {
         src1:'https://enlist-dev.oss-cn-hangzhou.aliyuncs.com/wx28653ecae496acb0o6zAJs2g_tkXMXOIOre-Q5OmXMSofLQ896FPt4Ep26d4814714314e91134d1a8192803e5a/2020/03/21/b2411de58655467e8956ca021fe4fb.mp4',
    files: [{
      url: 'http://mmbiz.qpic.cn/mmbiz_png/VUIF3v9blLsicfV8ysC76e9fZzWgy8YJ2bQO58p43Lib8ncGXmuyibLY7O3hia8sWv25KCibQb7MbJW3Q7xibNzfRN7A/0',
    }, {
      loading: true
    }, {
      error: true
    }],
    playing: false,
    _videoContexts:'',
    imageWidth: '', // 背景图片的高度
    imageHeight: '' // 背景图片的长度，通过计算获取
  },
  onLoad() {
    this.setData({
      selectFile: this.selectFile.bind(this),
      uplaodFile: this.uplaodFile.bind(this)
    })
  },
  chooseImage: function (e) {
    var that = this;
    wx.chooseImage({
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        that.setData({
          files: that.data.files.concat(res.tempFilePaths)
        });
      }
    })
  },
  lifetimes: {
    attached: function attached() {
      this.playCurrent()
    }
  },
  methods: {
    setVideo() {
      this.setData({
        _videoContexts: wx.createVideoContext('myvideo_' + this.data.videoid, this)
      })
    },
    previewImage: function (e) {
      if(!this.data.show) return
      var imgArr = [this.data.src];
      wx.previewImage({
        current: imgArr[0],     //当前图片地址
        urls: imgArr,               //所有要预览的图片的地址集合 数组形式
        success: function (res) { },
        fail: function (res) { },
        complete: function (res) { },
      })
    },
    sendUploadMes(e) {
      this.triggerEvent('getUploadMes', {
        mes: e
      })
    },
    // 计算图片高度
    imgLoaded(e) {
      let h = this.data.height,
          w = this.data.width,
          dh,dw;

      if(h!==0 && w!==0){
        dh = h;
        dw = w;
      }else if(h==0 && w!=0){
        dh = e.detail.height * (w / e.detail.width);
        dw = w;
      } else if (h!=0 && w==0) {
        dh = h;
        dw = e.detail.width * (h / e.detail.height);
      }else{
        dh = e.detail.height;
        dw = e.detail.width;
      }
      this.setData({
        imageWidth: dw,
        imageHeight: dh
      })
    },
    videoClick(e){
      
    },
    playbtn(){
      console.log(856)
      console.log(this.data._videoContexts)
      console.log(this.data.videoid)
      this.setData({
        playing: true
      },function(){
        this.data._videoContexts.play()
      })
    },
    playCurrent() {
      // 阻止视频被点击时穿透
      if (this.data._videoContexts){
        if (this.data.videoid == this.data.activeid) {
          this.setData({
            playing: true
          })
          this.data._videoContexts.play()
        } else {
          this.data._videoContexts.pause()
        }
      }
      
    },
    onPlay: function onPlay(e) {
      this.setData({
        playing: true
      })
      this.trigger(e, 'play');
    },
    onPause: function onPause(e) {
      this.setData({
        playing: false
      })
      this.trigger(e, 'pause');
    },
    onEnded: function onEnded(e) {
      this.setData({
        playing: false
      })
      this.setData({
        autoplay: true
      })
      this.playCurrent()
      this.trigger(e, 'ended');
    },
    onError: function onError(e) {
      this.setData({
        playing: false
      })
      this.trigger(e, 'error');
    },
    onTimeUpdate: function onTimeUpdate(e) {
      this.trigger(e, 'timeupdate');
    },
    onWaiting: function onWaiting(e) {
      this.trigger(e, 'wait');
    },
    onProgress: function onProgress(e) {
      this.trigger(e, 'progress');
    },
    onLoadedMetaData: function onLoadedMetaData(e) {
      this.trigger(e, 'loadedmetadata');
    },
    onBindfullscreenchange: function onLoadedMetaData(e) {
      this.trigger(e, 'bindfullscreenchange');
    },
    trigger: function trigger(e, type) {
      var ext = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

      var detail = e.detail;
      var activeId = e.target.dataset.id;
      this.triggerEvent(type, Object.assign(Object.assign(Object.assign({}, detail), { activeId: activeId }), ext));
    }
  }
})