var host = "https://www.byb88.cn/";
var domian = "enlist2";

// var host = "https://test.byb88.cn/";
var domian = "enlist2";

const apiUrl = url => {
  return host + domian + url; 
}

const getToken = function(keyName){
  var userToken = wx.getStorageSync("token") ? JSON.parse(wx.getStorageSync("token"))[keyName] : '';
  if (wx.getStorageSync("identity")){
    if (wx.getStorageSync("identity") == 1 && keyName == "token"){
      return ''
    }
  }
  return userToken
}
const getIdentity = function () {
  var identity = wx.getStorageSync("identity") ? wx.getStorageSync("identity") : 1;
  return identity
}
var theLocation = function(){
  var that = this 
  this.latitude = '';
  this.longitude = '';
  this.getLocation = function () {
    wx.getLocation({
      type: 'wgs84',
      success(res) {
        const lati = res.latitude
        const long = res.longitude
        const speed = res.speed
        const accuracy = res.accuracy
        that.latitude = lati
        that.longitude = long
      },
      fail(err) {
        that.latitude = ''
        that.longitude = ''
      }
    })
  }
}
var nowLocation = new theLocation()

const service = {
  post(url, data, methods) {
    return new Promise((resolve, reject) => {
      wx.request({
        method: methods ? methods : 'post',
        url: host + domian + url,
        data: data,
        header: { 
          "content-type": "application/json",
          "Authorization": getToken("authorization"),
          "token": getToken("token"),
          "appRole": getIdentity(),
          longitude: nowLocation.longitude,
          latitude: nowLocation.latitude
        },
        success: (res) => {
          // 调用接口成功
          if(res.data.code == 200){
            resolve(res)
          } else if (res.data.code == 401) {
            wx.showToast({
              title: "登陆信息已过期，请重新登陆",
              icon: 'none',
              duration: 2000
            })
            wx.clearStorageSync();
            if (!wx.getStorageSync("identity")) {
              wx.setStorageSync('identity', 1)
            }
            // wx.navigateTo({
            //   url: '/pages/getAuth/getAuth',
            // })
            reject(res)
          } else {
            wx.showToast({
              title: res.data.msg,
              icon: 'none',
              duration: 1500
            })
            reject(res)
          }
        },
        fail: (err) => {
          // 调用接口失败
          reject(err)
        }
      })
    })
  }
}

module.exports = {
  post: (url, data, methods) => {
    data = data ? data : {};
    return service.post(url, data, methods)
  },
  apiUrl: apiUrl,
  getToken: getToken,
  getIdentity: getIdentity,
  nowLocation: nowLocation
}
