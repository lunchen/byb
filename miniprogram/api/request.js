// wx.showToast({
//   title: '请选择正确的时间',
//   icon: 'none',
//   duration: 1000
// })
// wx.setStorageSync('id', "99")
// var data = wx.getStorageSync('img')
const apiUrl = url => {
  return "https://test.byb88.cn/enlist"+url; 
}

const host = "https://test.byb88.cn/";
const domian = "enlist";

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
          "Authorization": "RFFcND5+NvyRnYh3GlhBVnbeJ0JjoSHeU9OiFyYMb2+uvVA26g0BNEtzCy4a1INY" 
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
