import { createRouter, createWebHashHistory } from 'vue-router'
import Layout from '/@/layout/index.vue'
import usePermissionStore from '@/stores/permission'

export const constantRoutes = [
  {
    path: '/redirect',
    name: 'Redirect',
    component: Layout,
    meta: {
      title: 'Redirect',
      hidden: true,
    },
    children: [
      {
        path: '/redirect/:path(.*)',
        name: 'Redirect1',
        component: () => import('/@/views/redirect/index.vue'),
        meta: {
          title: 'Redirect',
          hidden: true,
        },
      },
    ],
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('/@/views/login/index.vue'),
    meta: {
      hidden: true,
      title: '登录',
    },
  },
  {
    path: '/',
    name: 'Welcome',
    component: Layout,
    redirect: '/welcome',
    meta: {
      title: 'welcome',
      hidden: true,
    },
    children: [
      {
        path: 'welcome',
        name: 'Welcome1',
        component: () => import('/@/views/welcome/index.vue'),
        meta: {
          title: '0_welcome',
          icon: 'welcome',
          noCache: false,
          hidden: true,
        },
      },
    ],
  },
  {
    path: '/404',
    name: 'Error404',
    component: () => import('/@/views/error/404.vue'),
    meta: {
      hidden: true,
      title: '404',
    },
  },
  {
    path: '/401',
    name: 'Error401',
    component: () => import('/@/views/error/401.vue'),
    meta: {
      hidden: true,
      title: '401',
    },
  },
  {
    path: '/500',
    name: 'Error500',
    component: () => import('/@/views/error/500.vue'),
    meta: {
      hidden: true,
      title: '500',
    },
  },
  {
    path: '/c',
    component: Layout,
    name: 'C',
    meta: { hidden: true, title: '修改' },
    children: [
      {
        path: '/changePwd',
        component: () => import('/@/views/changePwd/index.vue'),
        name: 'ChangePwd',
        meta: { title: '1_updatePwd', noCache: false },
      },
      {
        path: '/changeIdentityPwd',
        component: () => import('/@/views/changeIdentityPwd/index.vue'),
        name: 'ChangeIdentityPwd',
        meta: { title: '1_updateSFPwd', noCache: false },
      },
    ],
  },
  {
    path: '/:pathMatch(.*)',
    redirect: '/',
    name: 'pathMatch',
  },
]

const router = createRouter({
  history: createWebHashHistory('./'),
  routes: constantRoutes,
  scrollBehavior: () => ({ left: 0, top: 0 }),
})

/**
 * 重置路由 - 移除所有非靜態路由
 * 用於權限變更或登出時重置路由狀態
 */
export function resetRouter() {
  try {
    const allRoutes = router.getRoutes()
    const constantRoutesNames = constantRoutes
      .map((item) => item.name)
      .filter((name) => name !== undefined)

    const constantRoutesNameSet = new Set(constantRoutesNames)

    allRoutes
      .filter((route) => {
        const { name } = route
        return name !== undefined && router.hasRoute(name) && !constantRoutesNameSet.has(name)
      })
      .forEach((route) => {
        router.removeRoute(route.name)
      })
  } catch (error) {
    console.error('重置路由失敗:', error)
  }
}

/**
 * 更新路由 - 根據權限動態添加路由
 * @param accessRoutes - 後端返回的路由數據
 * @returns - 無返回值
 */
export function updateRouter(accessRoutes) {
  resetRouter()
  accessRoutes.forEach((item) => {
    addRoute(item)
  })
}

/**
 * 添加路由
 * @param parentNameOrRoute - 父路由名稱或完整路由配置
 * @param route - 子路由配置 (當第一個參數為父路由名稱時必須提供)
 * @returns - 無返回值
 */
export function addRoute(parentNameOrRoute, route) {
  try {
    // 情況1: 添加頂層路由
    if (typeof parentNameOrRoute === 'object') {
      router.addRoute(parentNameOrRoute)
      return
    }

    // 情況2: 添加子路由
    if (typeof parentNameOrRoute === 'string' && route) {
      router.addRoute(parentNameOrRoute, route)
      return
    }
  } catch (error) {
    console.error('添加路由失敗:', error)
  }
}

/**
 * 獲取當前路由名稱
 * @returns 當前路由名稱
 */
export function getCurrentRouteName() {
  const currentRoute = router.currentRoute.value
  return currentRoute.name
}

/**
 * 跳轉到指定路由
 * @param path - 跳轉的路由路徑
 * @returns 無返回值
 */
export function redirectRoute(path) {
  if (!path) {
    return
  }
  const currentRoute = router.currentRoute.value
  const currentRoutePath = currentRoute.path
  if (currentRoutePath !== path) {
    router.push(path)
  }
}

export default router

router.beforeEach((to, from) => {
  const permissionStore = usePermissionStore()
  const requiredPermission = to.meta.permission ?? []
  permissionStore.setPermissions(to.name, requiredPermission)
})
