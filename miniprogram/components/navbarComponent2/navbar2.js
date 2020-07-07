// 顶部状态栏 首页用
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
    },
    prevReload: {
      //navbarData   由父页面传递的数据，变量名字自命名
      type: Boolean,
      value: false,
      observer: function (newVal, oldVal) { }
    },
    needTop: {
      //navbarData   由父页面传递的数据，变量名字自命名
      type: Boolean,
      value: true,
      observer: function (newVal, oldVal) { }
    },
    city: {
      //navbarData   由父页面传递的数据，变量名字自命名
      type: String,
      value: "定位中",
      observer: function (newVal, oldVal) {
        this.setData({
          cityName: newVal
        })
      }
    },
  },
  data: {
    isIphoneX: app.globalData.systemInfo.model.search('iPhone X') != -1 ? true : false,
    phoneName: app.globalData.systemInfo.model,
    screenWidth: app.globalData.screenWidth,
    statusBarHeight: app.globalData.statusBarHeight,
    height: '',
    //默认值  默认显示左上角
    navbarData: {
      showCapsule: 1
    },
    imageWidth: wx.getSystemInfoSync().windowWidth, // 背景图片的高度
    imageHeight: '', // 背景图片的长度，通过计算获取
    showBack:true,
    cityName: '定位中' 
  },
  attached: function () {
    // 获取是否是通过分享进入的小程序
    let pages = getCurrentPages(); //获取当前页面js里面的pages里的所有信息。
    const currentPage = pages[pages.length - 1]
    if (pages.length == 1 && currentPage.route != "pages/index/index" && currentPage.route != "pages/mine/mine") {
      this.setData({
        share: true
      })
      if (currentPage.route == "pages/schoolHome/schoolHome") {
        this.setData({
          "navbarData.showCapsule": 0
        })
      }
    }else{
      this.setData({
        share: false
      })
    }
  
    // 定义导航栏的高度   方便对齐
    this.setData({
      height: app.globalData.height
    })
  },
  methods: {
    goToSearch() {
      wx.navigateTo({
        url: '/pages/search/search',
      })
    },
    // 返回上一页面
    _navback() {
      if(this.data.share){
        app.globalData.share = false
        wx.switchTab({
          url: '/pages/index/index',
        })
        return
      }
      var hasShowValue = false;
      var data =this.data.hasShow;
      var showTrueList = []
      for(let i in data){
        if(data[i]===true){
          hasShowValue=true
          showTrueList.push(i)
        }
      }
      if (hasShowValue) {
        this.triggerEvent('checkShow', {
          hasShowValue: hasShowValue,
          showTrueList: showTrueList
        })
      }else{
        if (this.data.navbarData.backreload) {
          let pages = getCurrentPages(); //获取当前页面js里面的pages里的所有信息。
          let prevPage = pages[pages.length - 2];
          wx.navigateBack({
            // 返回并执行上一页面方法
            success: function () {
              prevPage.onLoad() // 执行前一个页面的方法
            }
          });
        }else{
          wx.navigateBack()
        }
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
  }
})