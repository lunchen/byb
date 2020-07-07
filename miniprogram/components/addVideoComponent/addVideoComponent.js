// 添加视频 
const util = require('../../utils/util.js')
const apiServer = require('../../api/request.js');

const app = getApp()
Component({
  properties: {
    // 接口名
    base: {
      type: String,
      value: "images"
    },
    firstkey: {
      type: String,
      value: ""
    },
    mystyle: {
      type: String,
      value: ""
    },
    hasSlot: {
      type: Boolean,
      value: false
    }
  },
  options: {
    multipleSlots: true
  },
  data: {
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
  previewImage: function (e) {
    wx.previewImage({
      current: e.currentTarget.id, // 当前显示图片的http链接
      urls: this.data.files // 需要预览的图片http链接列表
    })
  },
  methods: {
    sendUploadMes(e) {
      this.triggerEvent('getUploadMes', {
        mes: e
      })
    },
    clickHandle(){
      if (this.data.firstkey == 'courseList'){
        this.asdV()
      }else{
        this.asd()
      }
    },
    asdV() {
      console.log("点击选择视频了")
      var that = this
      wx.chooseVideo({
        sourceType: ['album', 'camera'],
        camera: 'back',
        compressed: false,
        success(res) {
          if (JSON.stringify(res).indexOf('413') != -1) {
            wx.showToast({
              title: '文件太大请选择的文件不要大于50MB',
              icon: 'loading',
              duration: 1500
            })
            return
          }
          wx.showToast({
            title: '努力上传中~',
            mask:true,
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
      var that = this
      wx.chooseMedia({
        count: 1,
        mediaType: ['image', 'video'],
        sourceType: ['album', 'camera'],
        camera: 'back',
        compressed: false,
        success(res) {
          console.log("点击选择视频了")
          if (JSON.stringify(res).indexOf('413') !=-1){
            wx.showToast({
              title: '文件太大请选择的文件不要大于50MB',
              icon: 'loading',
              duration: 1500
            })
            return
          }
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
            }
          })
        }
      })


    },
  }
})