import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/deviceControl',
    children: [{
      path: 'deviceControl',
      name: 'DeviceControl',
      component: () => import('@/views/deviceControl/index'),
      meta: { title: 'DeviceControl', icon: 'dashboard', affix: true }
    }]
  }
]

export const asyncRoutes = [
  {
    path: '/system',
    component: Layout,
    redirect: '/system/project',
    name: 'System',
    meta: { title: 'System', icon: 'example', roles: ['editor'] },
    children: [
      {
        path: 'project',
        name: 'Project',
        component: () => import('@/views/project/index'),
        meta: { title: 'Project', icon: 'table', roles: ['editor'] }
      },
      {
        path: 'user',
        name: 'User',
        component: () => import('@/views/tree/index'),
        meta: { title: 'User', icon: 'tree' }
      },
      {
        path: 'alarm',
        name: 'Alarm',
        component: () => import('@/views/tree/index'),
        meta: { title: 'Alarm', icon: 'tree' }
      },
      {
        path: 'equipment',
        name: 'Equipment',
        component: () => import('@/views/tree/index'),
        meta: { title: 'Equipment', icon: 'tree' }
      }
    ]
  },

  {
    path: '/arm',
    component: Layout,
    meta: { roles: ['editor'] },
    children: [
      {
        path: 'list',
        name: 'ArmList',
        component: () => import('@/views/form/index'),
        meta: { title: 'ArmList', icon: 'form' }
      }
    ]
  },

  {
    path: '/exit',
    component: Layout,
    name: 'Exit',
    meta: { title: 'Exit', icon: 'nested', roles: ['editor', 'china'] }
  },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
