// 视频流
module.exports =
/******/ (function (modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if (installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
        /******/
}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
        /******/
};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
      /******/
}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function (exports, name, getter) {
/******/ 		if (!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
        /******/
}
      /******/
};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function (exports) {
/******/ 		if (typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
        /******/
}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
      /******/
};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function (value, mode) {
/******/ 		if (mode & 1) value = __webpack_require__(value);
/******/ 		if (mode & 8) return value;
/******/ 		if ((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if (mode & 2 && typeof value != 'string') for (var key in value) __webpack_require__.d(ns, key, function (key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
      /******/
};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function (module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
      /******/
};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function (object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
    /******/
})
/************************************************************************/
/******/([
/* 0 */
/***/ (function (module, exports, __webpack_require__) {

        "use strict";


        const apiServer = require('../../api/request.js');

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
            _videoContextsState: [false,false,false],
            autoplay: false,
            activeId: '',
            swiperCurrent: 1,
          },
          lifetimes: {
            attached: function attached() {
              this.data._videoContexts = [wx.createVideoContext('video_0', this), wx.createVideoContext('video_1', this), wx.createVideoContext('video_2', this)];
            }
          },
          methods: {
            vchange: function (e) {
              var vindex = e.currentTarget.dataset.vindex
              if (this.data.showpause == true){
                this.data._videoContexts[vindex].pause()
                this.setData({
                  showpause: false
                })
              }else{
                this.data._videoContexts[vindex].play()
                this.setData({
                  showpause: true
                })
              }
            },
            _videoListChanged: function _videoListChanged(newVal) {
              var _this = this;
              var data = this.data;
              if (newVal.length>0){
                newVal.forEach(function (item) {
                  data.nextQueue.push(item);
                });
              }
              
              // 该组件第一个播放的都是列表的第二个 视频
              if (data.curQueue.length === 0) {
                console.log("iptCurrent")
                console.log(this.data.iptCurrent)
                if(this.data.iptCurrent == 0){
                  console.log("iptCurrent1")
                  this.setData({
                    curQueue: data.nextQueue.splice(0,3),
                    swiperCurrent: 0,
                    _last: 0
                  }, function () {
                    _this.playCurrent(0);
                  });
                }else{
                  console.log("iptCurrent2")

                  this.setData({
                    prevQueue: data.nextQueue.splice(0, data.iptCurrent-1),
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
              console.warn("current", current)
              console.warn("_last", _last)
              console.warn("diff",diff)
              if (diff === 0) return;
              this.data._last = current;
              this.playCurrent(current);
              this.triggerEvent('change', { activeId: curQueue[current].id, courseId: curQueue[current].courseId });
              var direction = diff === 1 || diff === -2 ? 'up' : 'down';
              console.warn("direction", direction)
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
              console.warn("_invalidDown", this.data._invalidDown)
              console.warn("_invalidUp", this.data._invalidUp)
              var circular = true;
              if(nextQueue.length==1){
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
              this.setData({
                curQueue: curQueue,
                circular: circular
              });
            },
            playCurrent: function playCurrent(current) {
              this.data._videoContexts.forEach(function (ctx, index) {
                index !== current ? ctx.stop() : ctx.play();
              });
            },
            onPlay: function onPlay(e) {
              console.log("play")
              console.log(e)
              console.log(this.data.prevQueue)
              console.log(this.data.nextQueue)
              // 播放开始 关闭swiper轮播
              console.log("play")
             
              this.setData({
                showpause: true
              })
              if (this.data.swiperLoop) {
                this.setData({
                  autoplay: false
                })
              }
              this.trigger(e, 'play');
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
              this.setData({
                activeId: activeId,
                courseId: courseId
              })
              this.triggerEvent(type, Object.assign(Object.assign(Object.assign({}, detail), { activeId: activeId, courseId: courseId }), ext));
            },
            likeBtn(e) {
              var id = e.currentTarget.dataset.id;
              this.data.videoList.map(item => {
                if (item.id == id) {
                  item.likeFlg = 1
                }
              })
              var req = {
                "id": id,
                "type": 2
              }
              apiServer.post(`/indexVideo/operating`, req).then(res => {
                console.log(res.data);
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

          },

          onShareAppMessage: function (ops) {
            var json = encodeURIComponent(JSON.stringify({ a: 1 }));
            if (this.data.type == "index") {
              var path = '/pages/video-swiper/video-swiper?id=' + this.data.activeId + '&type=' + this.data.type
            } else {
              var path = '/pages/video-swiper/video-swiper?id=' + this.data.courseId + '&type=' + this.data.type + '&videoId=' + this.data.activeId
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

        /***/
})
/******/]);