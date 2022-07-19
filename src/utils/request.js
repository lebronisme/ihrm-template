import axios from 'axios'
import { Message } from 'element-ui'
import store from '@/store'
import { getTime } from './auth'
import router from '@/router'
const request = axios.create({
  baseURL: process.env.VUE_APP_BASE_API,
  timeout: 10000
})

// 添加请求拦截器
request.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么
  const token = store.state.user.token
  if (token) {
    // 判断当前时间与登陆时间的时间差，如果大于2小时，就强制重新登录
    const time = Date.now() - getTime()
    // 每次发起ajax请求的时候，都要看一下token有没有过期
    if (time > 720000) {
      store.dispatch('user/logout')
      router.push('/login')
    }
    // 这里只改请求头里面的Authorization
    config.headers.Authorization = 'Bearer ' + token
    // config.headers = {
    //   Authorization: 'Bearer ' + token
    // }
  }
  return config
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error)
})

// 添加响应拦截器
request.interceptors.response.use(function (response) {
  // 对响应数据做点什么
  console.log(response)
  const { data, message, success } = response.data
  // console.log(data)
  if (success) {
    return data
  } else {
    Message.error(message)
    // 只有写了这行代码，才能在错误之后进去catch，可见login的vue文件handleLogin方法
    return Promise.reject(new Error(message))
  }
}, function (error) {
  // 对响应错误做点什么
  console.dir(error)
  // 如果错误了，让其重新登录(主动清除token也要让其重新登录)
  if (error.response && error.response.data && error.response.data.code === 10002) {
    store.dispatch('user/logout')
    router.push('/login')
  }
  return Promise.reject(error)
})
export default request
