// vuex中此模块默认用来存放 静态路由+当前用户的 权限路由
import { constantRoutes, asyncRouter } from '@/router/index'

const state = {
  routes: constantRoutes// 所有人都默认有静态路由
}
const mutations = {
  setRoute (state, newRouter) {
    state.routes = [...constantRoutes, ...newRouter] // 每次添加理由，应该在默认静态路由的基础上添加
  }
}
const actions = {
  // 第二个参数为当前用户所拥有的的菜单权限
  filterRouter (context, menus) {
    const newRouter = []
    // console.log(asyncRouter)
    menus.forEach(key => {
      // 筛选出menus中能和asyncRoutes对应上的动态路由，定义一个空数组来接收
      newRouter.push(...asyncRouter.filter(item =>
        item.children[0].name === key
      ))
    })
    // actions修改数据，只能通过actions
    context.commit('setRoute', newRouter)
    return newRouter // 给左侧菜单用的，为后续做准备
  }
}
export default {
  namespaced: true,
  state,
  mutations,
  actions
}
