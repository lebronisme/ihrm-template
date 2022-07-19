import Cookies from 'js-cookie'
// 放token缓存的文件
const TokenKey = 'vue_admin_template_token'

export function getToken () {
  return Cookies.get(TokenKey)
}

export function setToken (token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken () {
  return Cookies.remove(TokenKey)
}

const timeKey = 'heima_time_key'// 只是为了防止拼写错误，所以统一命名
// 设置时间戳
export function setTime (time) {
  return Cookies.set(timeKey, time)
}
// 获取时间戳
export function getTime () {
  return Cookies.get(timeKey)
}
