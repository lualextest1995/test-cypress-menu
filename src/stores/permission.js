import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { constantRoutes } from '/@/router'
import Layout from '/@/layout/index.vue'

const usePermissionStore = defineStore('permission', () => {
  const routes = ref([])
  const permissions = ref(new Map())
  const currentRouteName = ref('')
  const accessRoutesName = ref([])
  const elementName = ref('')

  /**
   *
   * 遞迴組建路由
   * @param modules - 後端返回的路由數據
   * @param parentPath - 父路由路徑
   * @param level - 當前路由層級
   * @returns - 返回組建好的路由數組
   */
  const buildRoutes = (modules, parentPath = '', level = 0) => {
    return modules.map((item) => {
      console.log('item', item)
      const fullPath = item.path
      const currentSegment = fullPath.replace('/', '')
      const currentSegmentSplit = currentSegment.split('/')
      const currentSegmentLast = currentSegmentSplit[currentSegmentSplit.length - 1]
      const name = `${currentSegmentLast.charAt(0).toUpperCase()}${currentSegmentLast.slice(1)}`
      const component =
        level === 0 ? Layout : () => import(`/@/views${parentPath}/${currentSegment}/index.vue`)
      const permission = Object.entries(item.grant ?? {})
        .filter(([_, value]) => value)
        .map(([key]) => key)
      const meta = {
        id: item.id ?? -1, // 到時候要拿掉，因為不需要打 userPower 了
        noCache: false,
        title: item.name,
        hidden: item.hidden ?? false,
        isShow: item.isShow ?? true,
        permission,
        parentPath,
      }

      const hasChildren = Array.isArray(item.page) && item.page.length > 0

      const route = {
        path: fullPath,
        name,
        component,
        meta,
      }

      if (hasChildren) {
        const childParentPath = `${parentPath}/${currentSegment}`
        route.children = buildRoutes(item.page, childParentPath, level + 1)
      }

      return route
    })
  }

  /**
   * 遞迴提取所有路由名稱
   * @param routes - 後端返回的路由數據
   * @returns - 返回所有路由名稱
   */
  const extractAllNames = (routes) => {
    return routes.reduce((acc, route) => {
      if (route.name && typeof route.name === 'string') {
        acc.push(route.name)
      }
      if (Array.isArray(route.children)) {
        acc.push(...extractAllNames(route.children))
      }
      return acc
    }, [])
  }

  /**
   *
   * 建立動態路由
   * @param powerList - 後端返回的路由數據
   * @returns - 返回動態路由
   */
  const createAsyncRoutes = (powerList) => {
    const asyncRoutes = buildRoutes(powerList)
    accessRoutesName.value = extractAllNames(asyncRoutes)
    routes.value = constantRoutes.concat(asyncRoutes)
    return asyncRoutes
  }

  /**
   *
   * 設置權限
   * @param routeName - 當前路由名稱
   * @param permissionsList - 當前路由的權限列表
   */
  const setPermissions = (routeName, permissionsList) => {
    currentRouteName.value = routeName
    permissions.value.set(routeName, permissionsList)
  }

  /**
   *
   * 檢查當前路由是否有權限
   * @param code - 權限代碼
   * @returns - 返回是否有權限
   */
  const hasPermission = (code) => {
    return permissions.value.get(currentRouteName.value)?.includes(code) ?? false
  }

  /**
   *
   * 清除權限
   * @description - 清除所有權限
   * @returns - 無返回值
   */
  const clearPermissions = () => {
    permissions.value.clear()
  }

  /**
   *
   * 檢查權限碼
   * @description - 檢查權限碼是否符合要求，支援單個或多個權限碼的檢查
   * @param value - 權限碼
   * @param requireAll - 是否需要所有權限碼都符合
   * @returns- 是否符合要求
   * @example - checkPermission('user:add')  單個權限碼
   * @example - checkPermission(['user:add', 'user:edit'])  多個權限碼
   * @example - checkPermission(['user:add', 'user:edit'], true)  所有權限碼都符合
   */
  const checkPermission = (value, requireAll = false) => {
    if (Array.isArray(value)) {
      return requireAll ? value.every((p) => hasPermission(p)) : value.some((p) => hasPermission(p))
    } else if (typeof value === 'string') {
      return hasPermission(value)
    }
    return false
  }

  const setElementName = (name) => {
    elementName.value = name
  }

  return {
    routes: computed(() => routes.value),
    accessRoutesName: computed(() => accessRoutesName.value),
    createAsyncRoutes: createAsyncRoutes,
    setPermissions: setPermissions,
    clearPermissions: clearPermissions,
    checkPermission: checkPermission,
    // 以下測試用
    permissions: computed(() => permissions.value),
    currentRouteName: computed(() => currentRouteName.value),
    setElementName: setElementName,
  }
})

export default usePermissionStore
