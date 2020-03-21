const util = require('../../utils/util.js')

const app = getApp()
Component({
  properties: {
    activityData: {
      type: Object,
      value: {
        "hotsValue": "",
        "id": 0,
        "img": "",
        "levelName": "",
        "name": "",
        "remark": "",
        "status": 0,
        "totalCount": 0
      }
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
    
    src:''
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
    asd() {
      console.log(666)

      var that = this
      wx.chooseVideo({
        sourceType: ['album', 'camera'],
        maxDuration: 60,
        camera: 'back',
        compressed: false,
        success(res) {
          console.log(res)
          let src = res.tempFilePath,
              height = res.height,
              width = res.width;
          
          var videoName = src.split("/")[src.split("/").length - 1].replace(/\.(mp4|avi|mpeg|mpg|dat|rmvb|mov|asf|wmv|png|jpg|jpeg|)/gi,'');
          wx.uploadFile({
            url: util.apiUrl(`/picture/upload/${videoName}`),
            method: 'post',
            filePath: res.tempFilePath,
            name: 'file',
            file: res,
            data: {
            },
            header: {
              'content-type': 'application/json' // 默认值
            },
            success(res) {
              console.log(JSON.parse(res.data).data.string);
              that.setData({
                src: JSON.parse(res.data).data.string,
              })
            }
          })
        }
      })

      
    },
  }
})