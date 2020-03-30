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

const apiUrl = url => {
  return "https://test.byb88.cn/enlist"+url; 
}

const host = "https://test.byb88.cn/";
const domian = "enlist";
const getToken = function(keyName){
  // console.log(wx.getStorageSync("token"))
  var userToken = wx.getStorageSync("token") ? JSON.parse(wx.getStorageSync("token"))[keyName] : '';
  return userToken
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
        },
        success: (res) => {
          // 调用接口成功
          if(res.data.code == 200){
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
}
