
import layout from '@/layout'
// 默认导出路由规则
export default {
  path: '/approvals', // 路由的路径
  component: layout,
  children: [
    {
      path: '', // 二级路由如果什么都不写，默认的就是这个路径、此时这个路径，不仅有layout的布局，还有路径对应js的页面
      component: () => import('@/views/approvals'),
      name: 'approvals', // 路由的名称
      // 路由元信息  其实就是存储一些东西
      meta: { title: '权限管理', icon: 'tree-table' }
    }
  ]
}
