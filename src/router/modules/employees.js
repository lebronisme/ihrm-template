
import layout from '@/layout'
// 默认导出路由规则
export default {
  path: '/employees', // 路由的路径

  component: layout,
  children: [
    {
      path: '', // 二级路由如果什么都不写，默认的就是这个路径、此时这个路径，不仅有layout的布局，还有路径对应js的页面
      component: () => import('@/views/employees'),
      name: 'employees', // 路由的名称
      // 路由元信息  其实就是存储一些东西
      meta: { title: '员工', icon: 'people' }
    },
    {
      path: 'detail/:id?', // 动态路由传参,
      component: () => import('@/views/employees/detail.vue'),
      hidden: true, // 不在左侧菜单显示
      meta: {
        title: '员工详情' // 标记当前路由规则的中文名称 后续在做左侧菜单时使用
      }
    },
    {
      path: 'print/:id',
      component: () => import('@/views/employees/print.vue'),
      hidden: true,
      mata: { title: '打印', icon: 'people' }
    }
  ]
}
