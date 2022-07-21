
import layout from '@/layout'
// 默认导出路由规则
export default {
  path: '/social', // 路由的路径
  name: 'social', // 路由的名称
  component: layout,
  children: [
    {
      path: '', // 二级路由如果什么都不写，默认的就是这个二级路由的路径，此时这个路由，不仅有一级路由的布局，还有路径对应二级路由的页面
      component: () => import('@/views/social'),
      // 路由元信息  其实就是存储一些东西
      meta: { title: '社保', icon: 'table' }
    }
  ]
}
