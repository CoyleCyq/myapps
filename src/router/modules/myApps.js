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
    }
  ]
}
export default myAppsRouter
