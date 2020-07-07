//app.js
App({
  created: function () {
    // var pagess = getCurrentPages();
    this.hideTabBar();
  },
  onLaunch: function (e) {
    this.hideTabBar();
    this.getSystemInfo();
    wx.setNavigationBarColor({
      frontColor: '#000000',
      backgroundColor: '#fff'
    });
  
    if (!wx.getStorageSync("identity")) {
      wx.setStorageSync('identity', 1)
    }
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  hideTabBar() {
    wx.hideTabBar({
      fail: function () {
        setTimeout(function () { // 做了个延时重试一次，作为保底。
          wx.hideTabBar()
        }, 100)
      }
    });
  },
  getSystemInfo: function () {
    let t = this;
    wx.getSystemInfo({
      success: function (res) {
        t.globalData.systemInfo = res;
        t.globalData.height = res.statusBarHeight;
        console.log(res.model)
        t.globalData.isIphoneX = res.model.search('iPhone X') != -1 ? true : false;
        t.globalData.phoneName = res.model;
        t.globalData.navheight = t.globalData.isIphoneX ? (t.globalData.height * 1.5 + 20) : (t.globalData.height * 2 + 20);
      }
    });
  },
  editTabbar: function () {
    if (wx.getStorageSync('identity') == "1") {
      // this.globalData.tabBar.list[1].iconPath = "icon/middle1.png"
      this.globalData.tabBar.list[1].text = "入驻"
      this.globalData.tabBar.list[1].pagePath = "/pages/business/business"
    } else {
      // this.globalData.tabBar.list[1].iconPath = "icon/middle.png"
      this.globalData.tabBar.list[1].text = "发布"
      this.globalData.tabBar.list[1].pagePath = "/pages/middle/middle"
    }
    let tabbar = this.globalData.tabBar;
    
    let currentPages = getCurrentPages();
    let _this = currentPages[currentPages.length - 1];
    let pagePath = _this.route;
    (pagePath.indexOf('/') != 0) && (pagePath = '/' + pagePath);
    for (let i in tabbar.list) {
      tabbar.list[i].selected = false;
      (tabbar.list[i].pagePath == pagePath) && (tabbar.list[i].selected = true);
    }
    _this.setData({
      tabbar: tabbar
    });
  },
  globalData: {
    isLinking: false,   //true有前置请求 等待false后才可再请求 
    userInfo: null,
    statusBarHeight: wx.getSystemInfoSync()['statusBarHeight'],
    screenWidth: wx.getSystemInfoSync()['screenWidth'],
    screenHeight: wx.getSystemInfoSync()['screenHeight'],
    share: false, // 分享默认为false
    height: 0, // 顶部高度
    navheight: 0, // 导航栏高度
    systemInfo: null,
    isIphoneX: false,
    phoneName: '',
    tabBar: {
      "backgroundColor": "#ffffff",
      "color": "#999999",
      "selectedColor": "#feb707",
      "list": [
        {
          "pagePath": "/pages/index/index",
          "iconPath": "icon/icon_home.png",
          "selectedIconPath": "icon/icon_home_HL.png",
          "text": "首页"
        },
        {
          "pagePath": "/pages/middle/middle",
          "iconPath": "icon/icon_release.png",
          "isSpecial": true,
          "text": "发布"
        },
        {
          "pagePath": "/pages/mine/mine",
          "iconPath": "icon/icon_mine.png",
          "selectedIconPath": "icon/icon_mine_HL.png",
          "text": "我的"
        }
      ]
    },
  }
})