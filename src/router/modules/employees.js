
import layout from '@/layout'
// 默认导出路由规则
export default {
  path: '/employees', // 路由的路径
  name: 'employees', // 路由的名称
  component: layout,
  children: [
    {
      path: '', // 二级路由如果什么都不写，默认的就是这个路径、此时这个路径，不仅有layout的布局，还有路径对应js的页面
      component: () => import('@/views/employees'),
      // 路由元信息  其实就是存储一些东西
      meta: { title: '员工', icon: 'people' }
    }
  ]
}
