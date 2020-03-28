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

const apiUrl = url => {
  return "https://test.byb88.cn/enlist"+url; 
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

module.exports = {
  formatTime: formatTime,
  formatDate: formatDate,
  apiUrl: apiUrl,
  setId: setId,
  getId: getId,
  checkLogin: checkLogin
}
