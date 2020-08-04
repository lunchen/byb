// 活动详情
//activityDetails.js
const util = require('../../utils/util.js')
const apiServer = require('../../api/request.js');

//获取应用实例
const app = getApp()

Page({
  data: {
    //navbar
    // 导航头组件所需的参数
    nvabarData: {
      showCapsule: 1, //是否显示左上角图标   1表示显示    0表示不显示
      title: '活动详情', //导航栏 中间的标题
      white: false, // 是就显示白的，不是就显示黑的。
      address: '' // 加个背景 不加就是没有
    },
    // 导航头的高度
    height: app.globalData.navheight,

    // 视频
    indicatorDots: true,
    vertical: false,
    autoplay: false,
    interval: 2000,
    duration: 500,
    indicatorColor: "#bbb",
    indicatorActiveColor: "#fff",
    current: 0,

    identity: wx.getStorageSync('identity') ? wx.getStorageSync('identity') : 1,       //1参与方 2主办方
    activityListData:{},
    loginShow: 0,
    signUpType: false,
    id: '',
    shareId:'', //分销带的参数
    canvasImgShow: false,
    canvasImg: '',
    activeid:'-1',
    canIUseSaveImg:'',
    showActUp: false,
    miaoshashow: false,
    scfxhbActive: false,
    setTime:'',
    userShareFlg:0,
    showToMine: wx.getStorageSync('shareIn')
  },
  scfxhb(){
    //生成分销海报
    var _this = this
    if(this.data.userShareFlg !==1){
      wx.showToast({
        title: '请在个人信息页面开通分销员身份后，再生成海报赚取红包~',
        icon:'none',
        duration: 1000,
      })
      return
    }
    if(!this.data.scfxhbActive){
      this.setData({
        scfxhbActive:true,
        setTime: setTimeout(function(){
            _this.setData({
              scfxhbActive:false
            })
          },2000)
      })
     
    }else{
      clearTimeout(this.data.setTime)
      this.setData({
        setTime: setTimeout(function(){
            _this.setData({
              scfxhbActive:false
            })
          },2000)
      })
      this.scfxhbApi()
    }
  },
  scfxhbApi(){
    //生成红包海报接口
    var _this = this
    wx.showToast({
      title: '图片生成中~',
      icon: 'loading',
      duration: 2000
    })
    apiServer.post(`/app/activity/poster/share/${this.data.id}`,'','get').then(res => {
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
  sjms(){
    this.setData({
      miaoshashow: true
    })
  },
  sjmsClose(){
    this.setData({
      miaoshashow: false
    })
  },
  showList(e){
    var img = e.currentTarget.dataset.showimg
    if (img.type!=1){return}
    var imgArr = e.currentTarget.dataset.showimglist
    var delList = []
    imgArr.forEach(item=>{
      if(item.type==1){
        delList.push(item.url)
      }
    })
    wx.previewImage({
      current: img.url,     //当前图片地址
      urls: delList,               //所有要预览的图片的地址集合 数组形式
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  // 滑块
  swiperChange(e) {
    console.log(e)
    var that = this;
    var current = e.detail.current
    if (e.detail.source == 'touch') {
      that.setData({
        current: e.detail.current,
        activeid: that.data.activityListData.activityBannerList[e.detail.current].id
      })

    }
  }, 
  onPlay(e){
    console.log(e)
    this.setData({
      activeid: e.detail.activeId
    })
  },
  previewImage: function (e) {
    console.log(e)
    var imgArr = [this.data.canvasImg];
    wx.previewImage({
      current: imgArr[0],     //当前图片地址
      urls: imgArr,               //所有要预览的图片的地址集合 数组形式
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  closeCanvasImgShow() {
    this.setData({
      canvasImgShow: false
    })
  },
  changeSignUpType: function (e) {
    // 底部按钮 true 为免费预约 false 花费
    this.setData({
      signUpType: e.detail.signUpType
    })
  },
  //事件处理函数
  goToSchoolHome: function (e) {
    var id = e.currentTarget.dataset.id
    util.setId(id)
    wx.navigateTo({
      url: `../schoolHome/schoolHome?id=${id}`
    })
  },
  goToMine(){
    wx.navigateTo({
      url: `../mine2/mine2`
    })
  },
  changeFLogin: function (e) {
    // 获取从底部3按钮获取的报课弹窗状态  底部按钮组件还需要获取用户登录状态
    // 状态1：需登录，2：由学校主页打开需要选择课程，3：由活动详情页打开不用选取课程直接，4：填写姓名电话和基础
    this.setData({
      loginShow: e.detail.loginShow
    })
  },
  onLoad: function (e) {
    wx.setNavigationBarColor({
      frontColor: '#000000',
      backgroundColor: '#fff'
    });

    var that = this;
    let id = e ? e.id : '';
    console.log("e")
    console.log(e)
    this.setData({
      id: id
    })
    if(e){
      if (e.scene) {
        var strs = decodeURIComponent(e.scene)
        let d = strs.split("=")
        this.setData({
          id: d[1],
          shareId: d[2],
        })
        wx.setStorageSync('shareId', d[2])
        wx.setStorageSync('shareIn', true)
      }
      if(e.shareIn){
        wx.setStorageSync('shareIn', true)
      }
    }
    this.setData({
      showToMine: wx.getStorageSync('shareIn')
    })
    if (this.data.id) {
      if(e && e.open==3){
        this.setData({
          loginShow: 3,
          signUpType: true
        })
      }
      // this.getData()
    }
  },
  getData(){
    var that = this
    apiServer.post(`/app/activity/info/${this.data.id}`).then(res => {
      console.log("getData")
      // 设置选中的活动信息用于报名
      var myorgid = wx.getStorageSync('myOrgMes')?JSON.parse(wx.getStorageSync('myOrgMes')).org.id:''
      if (res.data.data.org.id == myorgid && this.data.identity == 2){
        that.setData({
          showActUp: true
        })
      }else{
        that.setData({
          showActUp: false
        }) 
      }
      var activitySelected = {
        price: res.data.data.info.price,
        value: res.data.data.info.id,
        label: res.data.data.info.name
      }
      wx.setStorageSync("activitySelected", JSON.stringify(activitySelected))
      if (res.data.data.activityBannerList.length>0){
        that.setData({
          "activityListData": res.data.data,
          activeid: res.data.data.activityBannerList[0].id
        })
      }else{
        that.setData({
          "activityListData": res.data.data,
        })
      }
    })
  },
  onShow(){
    this.setData({
      userShareFlg: wx.getStorageSync('userShareFlg') ? parseInt(wx.getStorageSync('userShareFlg')) : 0,
      identity: wx.getStorageSync('identity') ? wx.getStorageSync('identity') : 1,
    })
    if(this.data.id){
      this.getData()
    }
  },
  imgLoaded(e) {
    this.setData({
      imageHeight: e.detail.height,
      imageWidth: e.detail.width
    })
    console.log("保存图片的尺寸")
  },
  // 生成朋友圈图片
  shareFriend() {
    this.getPoster()
  },
  getPoster(){
    var _this = this
    wx.showToast({
      title: '图片生成中~',
      icon: 'loading',
      duration: 2000
    })
    apiServer.post(`/app/activity/poster/${this.data.id}`,'','get').then(res => {
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

  onShareAppMessage: function (ops) {
    var json = encodeURIComponent(JSON.stringify({ a: 1 }));
    if (ops.from === 'button') {
      // 来自页面内转发按钮
    }
    return {
      title: '你的好友向你推荐了免费课程，点击领取~',
      path: '/pages/activityDetails/activityDetails?id=' + this.data.id + '&shareIn=true',
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

  },//用户点击右上角分享朋友圈
	onShareTimeline: function () {
		return {
	      title: this.data.activityListData.info.name,
	      query: `id=` + this.data.id + '&&shareIn=true',
	      imageUrl: this.data.activityListData.img.url
	    }
	},
})
