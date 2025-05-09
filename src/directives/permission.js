import usePermissionStore from '@/stores/permission'

/**
 *
 * 指令：權限檢查
 * @description - 用於檢查當前用戶是否有權限訪問該元素，支援隱藏或禁用元素(預設為隱藏)
 * @example - v-permission="'user:add'"  單個權限碼
 * @example - v-permission="['user:add', 'user:edit']"  多個權限碼
 * @example - v-permission.all="['user:add', 'user:edit']"  所有權限碼都符合
 * @example - v-permission:hide="'user:add'"  隱藏元素
 * @example - v-permission:disable="'user:add'"  禁用元素
 * @example - v-permission:hide.all="'user:add'"  隱藏元素，所有權限碼都符合
 * @example - v-permission:disable.all="'user:add'"  禁用元素，所有權限碼都符合
 */
const permissionDirective = {
  mounted(el, binding) {
    const store = usePermissionStore()

    const value = binding.value
    const mode = binding.arg || 'hide' // 支援 \:hide / \:disable，預設為 hide
    const requireAll = binding.modifiers.all === true

    const hasPermission = store.checkPermission(value, requireAll)

    if (!hasPermission) {
      if (mode === 'hide') {
        el.parentNode?.removeChild(el)
      } else if (mode === 'disable') {
        el.setAttribute('disabled', 'true')
        el.classList.add('is-disabled')
      }
    }
  },
}

export default permissionDirective
