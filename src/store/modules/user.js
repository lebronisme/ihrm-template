import { login, getInfo, getUserDetailById } from '@/api/user'
import { getToken, setToken, removeToken, setTime } from '@/utils/auth'
const state = {
  token: getToken(),
  userInfo: {}
}
const mutations = {
  setTokens (state, payload) {
    state.token = payload
  },
  setUserInfo (state, payload) { state.userInfo = payload },
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
    // console.log('res', res)
    context.commit('setUserInfo', { ...res, ...res1 })
    // console.log('res1', res1)
  },
  logout (context) {
    context.commit('removeToken')
    context.commit('removeUserinfo')
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
