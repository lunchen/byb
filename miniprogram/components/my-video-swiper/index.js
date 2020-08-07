//视频流视频
const apiServer = require('../../api/request.js');
const util = require('../../utils/util.js');
Component({
  options: {
    addGlobalClass: true,
    pureDataPattern: /^_/
  },
  properties: {
    type: {
      type: String,
      value: "index"
    },
    duration: {
      type: Number,
      value: 500
    },
    easingFunction: {
      type: String,
      value: 'default'
    },
    loop: {
      type: Boolean,
      value: true
    },
    swiperLoop: {
      type: Boolean,
      value: false
    },
    videoList: {
      type: Array,
      value: [],
      observer: function observer() {
        var newVal = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
        this._videoListChanged(newVal);
      }
    },
    ////记录输入视频在列表的位置
    iptCurrent: {
      type: Number,
      value: -1
    },
  },
  data: {
    nextQueue: [],
    prevQueue: [],
    curQueue: [],
    circular: false,
    _last: 1,
    _change: -1,
    _invalidUp: 0,
    _invalidDown: 0,
    _videoContexts: [],
    showpause: false,
    _videoContextsState: [false, false, false],
    autoplay: false,
    activeId: '',
    swiperCurrent: 1,
    shareShow: false,
    canvasImgShow: false,
    canvasImg:'',
    downloadUrl:'',
    shareId:'',
    canIUseSaveImg: '',
    needAni:'',  //执行点赞动画
    touchStartTime: -1, //判断双击
    ifDoubleClick: false, //判断双击 为true则不执行单击的事件
    likeItem:{}
  },
  lifetimes: {
    attached: function attached() {
      console.log("sbtx")
      console.log(this.data.canIUseSaveImg)
      console.log(wx.canIUse('button.open-type.writePhotosAlbum'))
      this.data._videoContexts = [wx.createVideoContext('video_0', this), wx.createVideoContext('video_1', this), wx.createVideoContext('video_2', this)];
    }
  },
  methods: {
    doubleClick(e){
      var that = this
      console.log(e)
      
      this.setData({
        ifDoubleClick: false
      })
      if(e.timeStamp - this.data.touchStartTime<300){
        console.log('双击')
        let data = {
          x: e.detail.x-30,
          y: e.detail.y-50,
          show: true
        }
        console.log(data)
        
        this.setData({
          ifDoubleClick: true,
          likeItem:data
        })
        this.likeBtn(e)
      }else{
        console.log('单击')
        setTimeout(()=>{
          if(!that.data.ifDoubleClick){
            that.vchange(e)
          }
        },300)
      }
      this.setData({
        touchStartTime: e.timeStamp
      })
    },
    vchange: function (e) {
      var vindex = e.currentTarget.dataset.vindex
      if (this.data.showpause == true) {
        this.data._videoContexts[vindex].pause()
        this.setData({
          showpause: false
        })
      } else {
        this.data._videoContexts[vindex].play()
        this.setData({
          showpause: true
        })
      }
    },
    _videoListChanged: function _videoListChanged(newVal) {
      var _this = this;
      var data = this.data;
      if (newVal.length > 0) {
        newVal.forEach(function (item) {
          data.nextQueue.push(item);
        });
      }

      // 该组件第一个播放的都是列表的第二个 视频
      if (data.curQueue.length === 0) {
        if (this.data.iptCurrent == 0) {
          console.log("iptCurrent1")
          this.setData({
            curQueue: data.nextQueue.splice(0, 3),
            swiperCurrent: 0,
            _last: 0
          }, function () {
            _this.playCurrent(0);
          });
        } else {
          this.setData({
            prevQueue: data.nextQueue.splice(0, data.iptCurrent - 1),
            curQueue: data.nextQueue.splice(0, 3),
            _last: this.data.swiperCurrent
          }, function () {
            _this.playCurrent(1);
          });
        }
      }
    },
    animationfinish: function animationfinish(e) {
      console.log("滑动")
      var _data = this.data,
        _last = _data._last,
        _change = _data._change,
        curQueue = _data.curQueue,
        prevQueue = _data.prevQueue,
        nextQueue = _data.nextQueue;
      var current = e.detail.current;
      var diff = current - _last;
      if (diff === 0) return;
      this.data._last = current;
      this.playCurrent(current);
      this.triggerEvent('change', { activeId: curQueue[current].id, courseId: curQueue[current].courseId });
      var direction = diff === 1 || diff === -2 ? 'up' : 'down';
      if (direction === 'up') {
        if (this.data._invalidDown === 0) {
          var change = (_change + 1) % 3;
          var add = nextQueue.shift();
          var remove = curQueue[change];
          if (add) {
            prevQueue.push(remove);
            curQueue[change] = add;
            this.data._change = change;
          } else {
            this.data._invalidUp += 1;
          }
        } else {
          this.data._invalidDown -= 1;
        }
      }
      if (direction === 'down') {
        if (this.data._invalidUp === 0) {
          var _change2 = _change;
          var _remove = curQueue[_change2];
          var _add = prevQueue.pop();
          if (_add) {
            curQueue[_change2] = _add;
            nextQueue.unshift(_remove);
            this.data._change = (_change2 - 1 + 3) % 3;
          } else {
            this.data._invalidDown += 1;
          }
        } else {
          this.data._invalidUp -= 1;
        }
      }
      var circular = true;
      if (nextQueue.length == 1) {
        this.triggerEvent('onending');
      }
      // if (nextQueue.length === 0 && current !== 0) {
      if (nextQueue.length === 0 && current !== 0) {
        circular = false;

      }
      // if (prevQueue.length === 0 && current !== 2) {
      if (prevQueue.length === 0 && current !== 2) {
        circular = false;
      }
      
      let data = {
        x: e.detail.x-30,
        y: e.detail.y-50,
        show: true,
        clear:true
      }
      
      this.setData({
        curQueue: curQueue,
        circular: circular,
        likeItem:data,
      });
    },
    videoOperating(e) {
      var _this = this
      var req = {
        "id": e.id,
        "type": e.type
      }
      //type 1。浏览数2。点赞 3。转发
      apiServer.post('/indexVideo/operating', req).then(res => {
      }).catch(err => {
      })
    },
    playCurrent: function playCurrent(current) {
      this.data._videoContexts.forEach(function (ctx, index) {
        index !== current ? ctx.stop() : ctx.play();
      });
    },
    onPlay: function onPlay(e) {
      this.setData({
        showpause: true,
        activeId: e.target.dataset.id,
        shareId: e.target.dataset.id
      })
      if (this.data.swiperLoop) {
        this.setData({
          autoplay: false
        })
      }
      this.trigger(e, 'play');
      var req = {
        id: e.target.dataset.id,
        type: 1
      }
      this.videoOperating(req)
    },
    onPause: function onPause(e) {
      this.trigger(e, 'pause');
    },
    onEnded: function onEnded(e) {
      // 播放结束后 开启swiper轮播
      if (this.data.swiperLoop) {
        this.setData({
          autoplay: true
        })
      }
      // this.playCurrent()
      this.trigger(e, 'ended');
    },
    onError: function onError(e) {
      this.trigger(e, 'error');
    },
    onTimeUpdate: function onTimeUpdate(e) {
      // this.trigger(e, 'timeupdate');
    },
    onWaiting: function onWaiting(e) {
      // this.trigger(e, 'wait');
    },
    onProgress: function onProgress(e) {
      // this.trigger(e, 'progress');
    },
    onLoadedMetaData: function onLoadedMetaData(e) {
      // this.trigger(e, 'loadedmetadata');
    },
    trigger: function trigger(e, type) {
      var ext = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

      var detail = e.detail;
      var activeId = e.target.dataset.id;
      var courseId = e.target.dataset.courseid;
      var cover = e.target.dataset.cover;
      var name = e.target.dataset.name;
      var orgId = e.target.dataset.orgid;
      this.setData({
        activeId: activeId,
        courseId: courseId
      })
      this.triggerEvent(type, Object.assign(Object.assign(Object.assign({}, detail), { name: name, cover: cover, activeId: activeId, courseId: courseId, orgId: orgId }), ext));
    },
    shareFriend(){
      var _this = this
      var req = {
        id: _this.data.shareId,
        type: 3
      }
      var a = this.data.curQueue
      a.map(item => {
        if (item.id == _this.data.shareId) {
          item.shareCount = item.shareCount - 0 + 1
        }
      })
      this.setData({
        curQueue: a
      })
      _this.setData({
        shareShow: false
      })
      _this.videoOperating(req)
    },
    shareBtn() {
      this.setData({
        shareShow: true
      });
    },
    onClose: function () {
      this.setData({
        shareShow: false
      });
    },
    likeBtn(e) {
      var that = this
      var id = e.currentTarget.dataset.id;
      console.log(id)
      var a = this.data.curQueue
      a.map(item => {
        if (item.id == id) {
          if (item.likeFlg!=1){
            item.likeCount = item.likeCount - 0 + 1
            item.likeFlg = 1
            this.setData({
              needAni:true
            })
            var req = {
              "id": id,
              "type": 2
            }
            apiServer.post(`/indexVideo/operating`, req).then(res => {
              console.log(res.data);
              
            })
            setTimeout(()=>{
              that.setData({
                needAni:false
              })
            },2000)
          }
          // else{
          //   item.likeCount = item.likeCount - 0 - 1
          //   item.likeFlg = 0
          // }
        }
      })
      this.setData({
        curQueue: a
      })
     
    },
    goToSchoolHome(e) {
      var id = e.currentTarget.dataset.id
      wx.navigateTo({
        url: `../../pages/schoolHome/schoolHome?id=${id}`,
      })
    },
    goToGetcourse(e) {
      var id = e.currentTarget.dataset.id
      wx.navigateTo({
        url: `../../pages/schoolHome/schoolHome?id=${id}&open=3`,
      })
    },
    previewImage: function (e) {
      var imgArr = [this.data.canvasImg];
      wx.previewImage({
        current: imgArr[0],     //当前图片地址
        urls: imgArr,               //所有要预览的图片的地址集合 数组形式
        success: function (res) { },
        fail: function (res) { },
        complete: function (res) { },
      })
    },

    getShareBill() {
      var _this = this
      wx.showToast({
        title: '图片生成中~',
        icon: 'loading',
        duration: 2000
      })
      var n = this.data.type == "index" ? "INDEX": "COURSE"
      apiServer.post(`/indexVideo/poster/${this.data.shareId}/${n}`).then(res => {

        wx.showToast({
          icon: 'none',
          duration: 1
        })
        this.setData({
          canvasImg: res.data.data.string,
          canvasImgShow: true,
          shareShow: false
        })
      })
    },

    closeCanvasImgShow() {
      this.setData({
        canvasImgShow: false
      })
    },
    // 保存图片
    async saveToPhoto() {
      
      var _this = this

      wx.showToast({
        title: '图片下载中~',
        icon: 'loading',
        duration: 50000
      });
      var url = await util._getLocalSrc(this.data.canvasImg)
      _this.setData({
        downloadUrl: url,
      })
      wx.getSetting({
        success: (res) => {
          console.log(res)
          if (res.authSetting['scope.writePhotosAlbum'] == false) {
            // 已经拒绝重新唤起
            _this.setData({
              canIUseSaveImg: false,
            })
            wx.showToast({
              title: "保存图片需要您的授权哦,请点击授权后再保存图片~",
              icon: "none"
            });
            console.log("已经拒绝重新唤起")
          } else if (!res.authSetting['scope.writePhotosAlbum']) {
            wx.authorize({
              scope: "scope.writePhotosAlbum",
              success() {
                wx.showToast({
                  title: "授权成功~",
                  icon: "none"
                });

                wx.saveImageToPhotosAlbum({
                  filePath: _this.data.downloadUrl,
                  success(res) {
                    wx.showToast({
                      title: "保存成功~",
                      icon: "none"
                    });
                  }
                })
              },
              fail(e) {
                wx.showToast({
                  title: "保存需要您的授权哦~",
                  icon: "none"
                });

                _this.setData({
                  canIUseSaveImg: false,
                })
              }
            });
          } else {
            wx.saveImageToPhotosAlbum({
              filePath: _this.data.downloadUrl,
              success(res) {
                var req = {
                  id: _this.data.activeId,
                  type: 3
                }

                var a = _this.data.curQueue
                a.map(item => {
                  if (item.id == _this.data.shareId) {
                    item.shareCount = item.shareCount - 0 + 1
                  }
                })
                _this.setData({
                  curQueue: a
                })
                _this.videoOperating(req)
                wx.showToast({
                  title: "保存成功~",
                  icon: "none"
                });
              }
            })
          }
        }
      })

    },
    // 弹出授权设置
    openSetting(e) {
      var _this = this
      console.log("唤起中")
      console.log(e)
      if (e.detail.authSetting["scope.writePhotosAlbum"] == true) {
        wx.showToast({
          title: '授权成功',
          icon: 'success',
          duration: 1000
        })
        this.setData({
          canIUseSaveImg: true,
        })
      } else {
        wx.showToast({
          title: '授权失败',
          icon: 'none',
          duration: 1000
        })
      }
    },
  },

  onShareAppMessage: function (ops) {
    var _this = this
    this.setData({
      shareShow: false
    })
    var json = encodeURIComponent(JSON.stringify({ a: 1 }));
    if (this.data.type == "index") {
      var path = '/pages/myVideoSwiper/myVideoSwiper?id=' + this.data.activeId + '&type=' + this.data.type
    } else {
      var path = '/pages/myVideoSwiper/myVideoSwiper?id=' + this.data.courseId + '&type=' + this.data.type + '&videoId=' + this.data.activeId
    }
    if (ops.from === 'button') {
      // 来自页面内转发按钮
    }
    if (this.data.type)
      return {
        title: '报1 报',
        path: path,
        imageUrl: "",
        success: function (res) {
          // 转发成功
          console.log("转发成功:" + JSON.stringify(res));
          console.log("转发成功:" + path);
        },
        fail: function (res) {
          // 转发失败
          console.log("转发失败:" + JSON.stringify(res));
        }
      }

  },
});