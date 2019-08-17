/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const myAppsRouter = {
  path: '/myApps',
  component: Layout,
  redirect: '/myApps/jjc',
  name: 'myApps',
  meta: {
    title: 'myApps',
    icon: 'table'
  },
  children: [
    {
      path: 'jjc',
      component: () => import('@/views/myApps/JJC.vue'),
      name: 'jjc',
      meta: { title: 'jjc' }
    },
    {
      path: 'nuannuan',
      component: () => import('@/views/myApps/nuannuan.vue'),
      name: 'nuannuan',
      meta: { title: 'nuannuan' }
    },
    {
      path: 'clothes',
      component: () => import('@/views/myApps/clothes.vue'),
      name: 'clothes',
      meta: { title: 'clothes' }
    },
    {
      path: 'suit',
      component: () => import('@/views/myApps/suit.vue'),
      name: 'suit',
      meta: { title: 'suit' }
    },
    {
      path: 'evalLevelUpCost',
      component: () => import('@/views/myApps/evalLevelUpCost.vue'),
      name: 'evalLevelUpCost',
      meta: { title: 'evalLevelUpCost' }
    }
  ]
}
export default myAppsRouter
