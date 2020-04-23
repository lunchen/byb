// 添加视频 
const util = require('../../utils/util.js')
const apiServer = require('../../api/request.js');

const app = getApp()
Component({
  properties: {
    activityData: {
      type: Object,
      value: {
        "totalCount": 0
      }
    },
    base: {
      type: String,
      value: "images"
    },
    firstkey: {
      type: String,
      value: ""
    }
  },
  data: {
    src1: 'https://enlist-dev.oss-cn-hangzhou.aliyuncs.com/wx28653ecae496acb0o6zAJs2g_tkXMXOIOre-Q5OmXMSofLQ896FPt4Ep26d4814714314e91134d1a8192803e5a/2020/03/21/b2411de58655467e8956ca021fe4fb.mp4',
    files: [{
      url: 'http://mmbiz.qpic.cn/mmbiz_png/VUIF3v9blLsicfV8ysC76e9fZzWgy8YJ2bQO58p43Lib8ncGXmuyibLY7O3hia8sWv25KCibQb7MbJW3Q7xibNzfRN7A/0',
    }, {
      loading: true
    }, {
      error: true
    }],

    src: ''
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
  previewImage: function (e) {
    wx.previewImage({
      current: e.currentTarget.id, // 当前显示图片的http链接
      urls: this.data.files // 需要预览的图片http链接列表
    })
  },
  imgLoaded(e) {
    console.log('upload success', e)
    console.log(789)
  },
  methods: {
    sendUploadMes(e) {
      this.triggerEvent('getUploadMes', {
        mes: e
      })
    }, 
    asdV() {
      console.log("点击选择视频了")
      var that = this
      wx.chooseVideo({
        sourceType: ['album', 'camera'],
        camera: 'back',
        compressed: false,
        success(res) {
          console.log(res)
          wx.showToast({
            title: '努力上传中~',
            icon: 'loading',
            duration: 100000
          })
          var url
          let src = res,
            height = src.height,
            width = src.width,
            type = 2; //type:1 图片  2 视频
          if (src.duration > 60) {
            wx.showToast({
              title: '请选择时长小于1分钟的视频',
              icon: 'none',
              duration: 1000
            })
            return
          }
          url = apiServer.apiUrl(`/picture/upload/${that.data.base}/${src.height}/${src.width}`)
         
          src.type = type;
          wx.uploadFile({
            url: url,
            method: 'post',
            filePath: src.tempFilePath,
            name: 'file',
            file: src,
            cover: src,
            data: {},
            header: {
              'content-type': 'application/json',
              "Authorization": apiServer.getToken("authorization"),
              "token": apiServer.getToken("token"),
              "appRole": apiServer.getIdentity(),
            },
            success(res) {
              console.log(res.data);
              var data = JSON.parse(res.data)
              if (data.success == true) {
                wx.showToast({
                  title: '上传成功',
                  icon: 'none',
                  duration: 1500
                })
                that.sendUploadMes({
                  url: data.data.string,
                  type: type,
                  cover: data.data.cover,
                });
              } else {
                wx.showToast({
                  title: '上传失败',
                  icon: 'none',
                  duration: 1500
                })
              }

            },
            fail(err) {
              wx.showToast({
                title: '上传失败',
                icon: 'none',
                duration: 1500
              })
              console.log("this is err")
              console.log(err)
            }
          })
        }
      })


    },
    asd() {
      console.log("点击选择视频了")
      var that = this
      wx.chooseMedia({
        count: 1,
        mediaType: ['image', 'video'],
        sourceType: ['album', 'camera'],
        camera: 'back',
        compressed: false,
        success(res) {
          console.log(res)
          wx.showToast({
            title: '努力上传中~',
            icon: 'loading',
            duration: 100000
          })
          var url
          let src = res.tempFiles[0],
            height = src.height,
            width = src.width,
            type = 1; //type:1 图片  2 视频
          if (res.type === "video") {
            if (src.duration > 60) {
              wx.showToast({
                title: '请选择时长小于1分钟的视频',
                icon: 'none',
                duration: 1000
              })
              return
            }
            type = 2;
            url = apiServer.apiUrl(`/picture/upload/${that.data.base}/${src.height}/${src.width}`)
          } else {
            url = apiServer.apiUrl(`/picture/upload/${that.data.base}`)
          }
          src.type = type;
          wx.uploadFile({
            url: url,
            method: 'post',
            filePath: src.tempFilePath,
            name: 'file',
            file: src, 
            cover: src,
            data: {},
            header: {
              'content-type': 'application/json',
              "Authorization": apiServer.getToken("authorization"),
              "token": apiServer.getToken("token"),
              "appRole": apiServer.getIdentity(),
            },
            success(res) {
              console.log(res.data);
              var data = JSON.parse(res.data)
              if(data.success == true){
                wx.showToast({
                  title: '上传成功',
                  icon: 'none',
                  duration: 1500
                })
                that.sendUploadMes({
                  url: data.data.string,
                  type: type,
                  cover: data.data.cover,
                });
              }else{
                wx.showToast({
                  title: '上传失败',
                  icon: 'none',
                  duration: 1500
                })
              }
              
            },
            fail(err) {
              wx.showToast({
                title: '上传失败',
                icon: 'none',
                duration: 1500
              })
              console.log("this is err")
              console.log(err)
            }
          })
        }
      })


    },
  }
})