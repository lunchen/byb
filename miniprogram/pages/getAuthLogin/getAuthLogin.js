// pages/getAuthLogin/getAuthLogin.js

const util = require('../../utils/util.js');
const apiServer = require('../../api/request.js');
//获取应用实例
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //navbar
    // 导航头组件所需的参数
    nvabarData: {
      showCapsule: 1, //是否显示左上角图标   1表示显示    0表示不显示
      title: '登录', //导航栏 中间的标题
      white: '', // 是就显示白的，不是就显示黑的。
      address: '../../images/logintop.png', // 加个背景 不加就是没有
    },
    height: app.globalData.navheight,
    isIphoneX: app.globalData.isIphoneX,
    //tabbar
    tabbar: {},
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    wxGetMes: {      //从微信获取的信息
      code: '',
      iv: '',
      encryptedData: '',
    },
    userInfoModel: {
      "addr": {
        "addr": "",
        "city": "",
        "district": "",
        "id": 0,
        "latitude": 0,
        "longitude": 0,
        "name": "",
        "place": "",
        "placeNo": "",
        "province": ""
      },
      "birthday": "",
      "heardImg": "",
      "nickName": "",
      "sex": 0,
      "sexName": "",
      "userNo": ""
    },
  },
  // 修改函数节流
  goToMiddle: util.throttle(function (e){
    wx.navigateTo({
      url: `../middle/middle`
    })
  }, 1000),
  //重新授权
  goToGetAuth: util.throttle(function (e) {
    wx.showToast({
      title: '请微信授权后再登录~',
      icon:'none'
    })
    let pages = getCurrentPages(); //获取当前页面js里面的pages里的所有信息。
    if (pages.length>=2){
      let prevPage = pages[pages.length - 2];
    }
    console.log(pages)
    if (pages.length>=2 && prevPage.route == "pages/getAuth/getAuth"){
      wx.navigateBack()
    } else {
      wx.redirectTo({
        url: `../getAuth/getAuth`
      })
    }
  }, 1000),
  
  getPhoneNumber(e) {
    var _this = this
   
    // 授权后 微信获取用户手机号一键登录
    if (e.detail.iv && e.detail.encryptedData) {

      _this.setData({
        "wxGetMes.iv": e.detail.iv,
        "wxGetMes.encryptedData": e.detail.encryptedData
      })
      wx.checkSession({
        success() {
          //session_key 未过期，并且在本生命周期一直有效
          _this.wxChatLogin()
        },
        fail() {
          // session_key 已经失效，需要重新执行登录流程
          wx.login() //重新登录
          wx.showToast({
            title: '登录信息已过期请重新获取选择登录号',
            icon: 'none',
            duration: 1000
          })
        }
      })

    }
  },
  getUserMes(){
    var _this = this;
    return new Promise((reject,reslove)=>{
      wx.getUserInfo({
        success: res => {
          //获取的用户信息还有很多，都在res中，看打印结果
          _this.setData({
            "userInfoModel.nickName": res.userInfo.nickName,
            "userInfoModel.heardImg": res.userInfo.avatarUrl,
            "userInfoModel.sex": res.userInfo.gender,
          })
          reject()
        },
        fail: err => {
          _this.goToGetAuth()
          reslove()
        }
      })
    })
  },
  async wxChatLogin() {
    // 微信登录
    var _this = this
    wx.showToast({
      icon: 'loading',
      duration: 2000
    })
    var req = {
      jsCode: _this.data.wxGetMes.code,
      data: _this.data.wxGetMes.encryptedData,
      iv: _this.data.wxGetMes.iv,
      type: 1
    }
    apiServer.post(`/app/login/login`, req).then(res => {
      wx.setStorageSync('identity', 1)
      var token = {
        token: res.data.data.token,
        authorization: res.data.data.authorization,
      }
      wx.setStorageSync("token", JSON.stringify(token))
      wx.setStorageSync("openId", res.data.data.openId)
      wx.setStorageSync("needBack", false)

      if (res.data.data.update == 1) {
        wx.showToast({
          title: '注册登录成功',
          icon: 'none',
          duration: 1000
        })
        _this.updataInfo()
      } else {
        wx.showToast({
          title: '登录成功',
          icon: 'none',
          duration: 1000
        })
        let pages = getCurrentPages(); //获取当前页面js里面的pages里的所有信息。
        let prevPage = pages[pages.length - 2];
        wx.navigateBack({
          // 返回并执行上一页面方法
          success: function () {
            prevPage.back() // 执行前一个页面的方法
          }
        });
      }
    }).catch(err => {
      console.log(err)
      wx.showToast({
        title: '登陆失败：' + err.data.msg,
        icon: 'none',
        duration: 1000
      })
    })
    
  },

  // 微信一键登陆后同步信息到后台
  updataInfo() {
    var _this = this;
4
    _this.getUserMes().then(res => {
      var req = _this.data.userInfoModel
      apiServer.post('/app/user/update', req).then(res => {
        //刷新当前页面的数据
        let pages = getCurrentPages(); //获取当前页面js里面的pages里的所有信息。
        let prevPage = pages[pages.length - 2];
        wx.navigateBack({
          // 返回并执行上一页面方法
          success: function () {
            prevPage.back() // 执行前一个页面的方法
          }
        });
      })
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this
    this.setData({
      tabbar: app.editTabbar()
    })

    wx.setStorageSync("needBack", true)
    wx.login({
      success(res) {
        _this.setData({
          "wxGetMes.code": res.code
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    wx.hideTabBar()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
})