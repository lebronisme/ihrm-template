import router from '@/router'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import store from '@/store/index'
// 路由白名单  去这些路由直接放行
const whiteList = ['/login', '/404']
// 前置路由守卫
router.beforeEach(async (to, from, next) => {
  NProgress.start()
  const token = store.state.user.token
  if (token) {
    if (to.path === '/login') {
      // 如果登陆过了，就不能再登录了，就让他去主页
      NProgress.done()
      next('/')
    } else {
      // 如果登陆过了，要去其他页面，就直接放行,并拿到当前页面的数据
      if (!store.state.user.userInfo.id) {
        const { roles } = await store.dispatch('user/getInfoFn')
        // console.log(roles)
        // newRouter就是得到的动态路由
        const newRouter = await store.dispatch('permission/filterRouter', roles.menus)
        console.log(newRouter)
        // addRoute必须用next（地址）
        router.addRoutes([...newRouter, { path: '*', redirect: '/404', hidden: true }])// 添加动态路由到路由表
        next(to.path)
      } else {
        next()
      }
    }
  } else {
    if (whiteList.includes(to.path)) {
      // 如果没有登陆，要去的页面在白名单里面，就直接放行
      next()
    } else {
      next('/login')
    }
  }
})
// 后置路由守卫
router.afterEach(() => {
  // 结束进度效果
  NProgress.done()
})
