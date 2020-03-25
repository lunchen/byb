// 顶部状态栏
const app = getApp()
Component({
  properties: {
    navbarData: {
      //navbarData   由父页面传递的数据，变量名字自命名
      type: Object,
      value: {},
      observer: function (newVal, oldVal) { }
    },
    backgroundColor: {
      //navbarData   由父页面传递的数据，变量名字自命名
      type: String,
      value: "#ffffff",
      observer: function (newVal, oldVal) { }
    },
    hasShow: {
      //navbarData   由父页面传递的数据，变量名字自命名
      type: Object,
      value: {},
      observer: function (newVal, oldVal) { }
    }
  },
  data: {
    isIphoneX: app.globalData.systemInfo.model.search('iPhone X') != -1 ? true : false,
    height: '',
    //默认值  默认显示左上角
    navbarData: {
      showCapsule: 1
    },
    imageWidth: wx.getSystemInfoSync().windowWidth, // 背景图片的高度
    imageHeight: '' // 背景图片的长度，通过计算获取
  },
  attached: function () {
    // 获取是否是通过分享进入的小程序
    this.setData({
      share: app.globalData.share
    })
    // 定义导航栏的高度   方便对齐
    this.setData({
      height: app.globalData.height
    })
  },
  methods: {
    // 返回上一页面
    _navback() {
      var hasShowValue = false;
      var data =this.data.hasShow;
      var showTrueList = []
      for(let i in data){
        if(data[i]===true){
          hasShowValue=true
          showTrueList.push(i)
        }
      }
      console.log(hasShowValue)
      console.log(data)
      console.log(showTrueList)
      if (hasShowValue){
        this.triggerEvent('checkShow', {
          hasShowValue: hasShowValue,
          showTrueList: showTrueList
        })
      }else{
        wx.navigateBack()
      }
     
    },
    // 计算图片高度
    imgLoaded(e) {
      this.setData({
        imageHeight:
          e.detail.height *
          (wx.getSystemInfoSync().windowWidth / e.detail.width)
      })
    }
    //返回到首页
    // _backhome() {
    //   wx.switchTab({
    //     url: '/pages/index/index'
    //   })
    // }
  }
})