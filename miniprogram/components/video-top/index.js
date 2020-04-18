// 视频流
module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const apiServer = require('../../api/request.js');

Component({
    options: {
        addGlobalClass: true,
        pureDataPattern: /^_/
    },
    properties: {
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
        videoUrl: {
            type: Object,
            value: {},
            observer: function observer() {
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
        _videoContexts: '',
        autoplay:false,
    },
    lifetimes: {
        attached: function attached() {
          console.log(this.data.videoUrl)
          this.data._videoContexts = wx.createVideoContext('video_0', this);

          this.data._videoContexts.play();
        }
    },
    methods: {
        _videoListChanged: function _videoListChanged(newVal) {
            var _this = this;
            var data = this.data;
            newVal.forEach(function (item) {
                data.nextQueue.push(item);
            });
            // 该组件第一个播放的都是列表的第二个 视频
            if (data.curQueue.length === 0) {
              var cutdata
              if(data.iptCurrent != -1){
                if (data.iptCurrent == 0) {
                  // 点击第一个视频时把最后一个视频放到前面去
                  var _data = data.nextQueue.pop()
                  data.nextQueue.unshift(_data)
                  cutdata = data.nextQueue.splice(0, 3)
                } else if (data.iptCurrent == data.nextQueue.length-1){
                  console.log("sheme")
                  var _data = data.nextQueue.shift()
                  data.nextQueue.push(_data)
                  cutdata = data.nextQueue.splice(data.nextQueue.length - 3, 3)
                } else {
                  cutdata = data.nextQueue.splice(data.iptCurrent-1, 3)
                }
              }else{
                cutdata = data.nextQueue.splice(0, 3)
              }

              this.setData({
                curQueue: cutdata
              }, function () {
                _this.playCurrent(1);
              });
              cutdata = null
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
            this.triggerEvent('change', { activeId: curQueue[current].id });
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
            if (nextQueue.length === 0 && current !== 0) {
                circular = false;
            }
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
          // 播放开始 关闭swiper轮播
          console.log("play")
          if (this.data.swiperLoop){
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
        trigger: function trigger(e, type) {
            var ext = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

            var detail = e.detail;
            var activeId = e.target.dataset.id;
            this.triggerEvent(type, Object.assign(Object.assign(Object.assign({}, detail), { activeId: activeId }), ext));
        },
        likeBtn(e) {
          console.log(66666)
          console.log(e.currentTarget.dataset.id)
          var id = e.currentTarget.dataset.id;
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
  
});

/***/ })
/******/ ]);