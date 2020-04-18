const apiServer = require('../api/request.js');

const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}
// 时间戳转时间格式 yyyy-MM-dd hh:mm
const formatDate = function(date1, fmt) {
  // date1 传时间戳 1534487084
  // fmt 传格式 yyyy-MM-dd hh:mm
  fmt = fmt ? fmt : "yyyy-MM-dd hh:mm:ss"
  let date = new Date(date1)
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
  }
  let o = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds()
  }
  // 遍历这个对象
  for (let k in o) {
    if (new RegExp(`(${k})`).test(fmt)) {
      let str = o[k] + ''
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : padLeftZero(str))
    }
  }
  return fmt
}
function padLeftZero(str) {
  return ('00' + str).substr(str.length)
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

const setId = id => {
  wx.setStorageSync("id", id)
}
const getId = id => {
  return wx.getStorageSync('id')
}
const checkLogin = () => {
  var token = wx.getStorageSync("token") ? JSON.parse(wx.getStorageSync("token")) : ''
  if (token){
    return true
  }else {
    return false
  }
}

const throttle = function (fn, gapTime) {
  if (gapTime == null || gapTime == undefined) {
    gapTime = 1500
  }

  let _lastTime = null

  // 返回新的函数
  return function () {
    let _nowTime = + new Date()
    if (_nowTime - _lastTime > gapTime || !_lastTime) {
      fn.apply(this, arguments)   //将this和参数传给原函数
      _lastTime = _nowTime
    }
  }
}

const getAuthStatus = function (scopeName) {
    return new Promise((resolve, reject) => {
      wx.getSetting({
        success(res) {
          // 已拒绝过，弹设置
          if (res.authSetting[`scope.${scopeName}`] === false) {
            resolve(false);
            // 已同意
          } else if (res.authSetting[`scope.${scopeName}`]) {
            resolve(true);
          } else {
            resolve("none");
          }
        }
      });
    });
  }

const uploadImg = function(fileName){
  return new Promise((resolve, reject) => {
    wx.chooseImage({
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success(res) {
        console.log(res)
        let src = res.tempFiles[0];
        wx.showToast({
          title: '上传中',
          icon: 'loading',
          duration: 10000
        })
        wx.uploadFile({
          url: apiServer.apiUrl(`/picture/upload/${fileName}`),
          method: 'post',
          filePath: src.path,
          name: 'file',
          file: src,
          data: {},
          header: {
            'content-type': 'application/json',
            "Authorization": apiServer.getToken("authorization"),
            "token": apiServer.getToken("token"),
            "appRole": apiServer.getIdentity(),
          },
          success(res) {
            var data = JSON.parse(res.data)
            if (data.success == true) {
              wx.showToast({
                title: '上传成功',
                icon: 'none',
                duration: 1500
              })
              resolve(data)
            } else {
              wx.showToast({
                title: '上传失败',
                icon: 'none',
                duration: 1500
              })
              reject(data)
            }
          },
          fail(err) {
            wx.showToast({
              title: '上传失败',
              icon: 'none',
              duration: 1500
            })
            reject(err)
          }
        })
      }
    })
  })
}

module.exports = {
  formatTime: formatTime,
  formatDate: formatDate,
  setId: setId,
  getId: getId,
  checkLogin: checkLogin,
  throttle: throttle,
  getAuthStatus: getAuthStatus,
  uploadImg: uploadImg
}
