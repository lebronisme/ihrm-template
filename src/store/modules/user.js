import { login, getInfo, getUserDetailById } from '@/api/user'
import { getToken, setToken, removeToken, setTime } from '@/utils/auth'
import { resetRouter } from '@/router/index'
const state = {
  token: getToken(),
  userInfo: {}
}
const mutations = {
  setTokens (state, payload) {
    state.token = payload
  },
  setUserInfo (state, payload) {
    state.userInfo = payload
  },
  removeToken (state) {
    // vuex里面的token清除
    state.token = null
    // cookies里面的token清除
    removeToken()
  },
  removeUserinfo (state) {
    state.userInfo = {}
  }
}
const actions = {
  async loginFn (context, value) {
    const res = await login(value)
    context.commit('setTokens', res)
    // 这里的setToken，是auth.js里面的setToken，用于持久化
    setToken(res)
    // 第一次登录的时候，存入时间，用于检测token是否超时
    setTime(Date.now())
    // 这里不做try catch捕获，是因为在请求拦截器里面已经做了异常捕获
    // try {
    //   const res = await login(value)
    //   // console.log(res)
    //   context.commit('setToken', res)
    // } catch (err) {
    //   return Promise.reject(err)
    // }
  },
  async getInfoFn (context) {
    const res = await getInfo()
    const res1 = await getUserDetailById(res.userId)
    context.commit('setUserInfo', { ...res, ...res1 })
    return res
  },
  // 登出操作
  logout (context) {
    // 重置用户数据
    context.commit('removeToken')
    context.commit('removeUserinfo')
    // 重置路由
    resetRouter()
    // 重置侧边栏的权限路由
    // 子模块调用子模块的方法，可以将第三个参数设置为 root: true，就可以将当前组件变成父模块
    context.commit('permission/setRoutes', [], { root: true })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
