// wx.showToast({
//   title: '请选择正确的时间',
//   icon: 'none',
//   duration: 1000
// })
// wx.setStorageSync('id', "99")
// var data = wx.getStorageSync('img')
wx.getSystemInfo({
  success(res) {
    // 异步将数据更新到视图层
    console.log(res)
  }
})

var host = "https://test.byb88.cn/";
var domian = "enlist";


// var host = "http://192.168.1.121";
// var domian = ":9088";
const apiUrl = url => {
  return host + domian + url; 
}

const getToken = function(keyName){
  // console.log(wx.getStorageSync("token"))
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
const service = {
  get(url, data) {
    return new Promise((resolve, reject) => {
      wx.request({
        method: 'get',
        url: host + domian + url,
        data: data,
        header: { "content-type": "application/json" },
        success: (res) => {
          // 调用接口成功
          if (res.data.code == 200) {
            resolve(res)
          } else {
            reject(res)
          }
        },
        fail: (err) => {
          // 调用接口失败
          reject(err)
        }
      })
    })
  },
  post(url, data) {
    return new Promise((resolve, reject) => {
      wx.request({
        method: 'post',
        url: host + domian + url,
        data: data,
        header: { 
          "content-type": "application/json",
          "Authorization": getToken("authorization"),
          "token": getToken("token"),
          "appRole": getIdentity()
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
            console.log("wocaole")
            console.log(wx.getStorageSync("identity"))
            if (!wx.getStorageSync("identity")) {
              console.log("resetsf")
              wx.setStorageSync('identity', 1)
            }
            reject(res)
          } else {
            console.log("res报错")
            reject(res)
          }
        },
        fail: (err) => {
          // 调用接口失败
          console.log("err报错")
          reject(err)
        }
      })
    })
  }
}

module.exports = {
  get: (url, data) => {
    data = data ? data : {};
    return service.get(url, data)
  },
  post: (url, data) => {
    data = data ? data : {};
    return service.post(url, data)
  },
  apiUrl: apiUrl,
  getToken: getToken,
  getIdentity: getIdentity,
}
