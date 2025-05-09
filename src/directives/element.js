import usePermissionStore from '@/stores/permission'

const elementDirective = {
  mounted(el, binding) {
    const store = usePermissionStore()
    const [value, route] = binding.value

    if (!value) return

    // const key = JSON.stringify([route.meta.parentPath, route.path, value])
    // el.dataset.grant = key

    el.addEventListener('click', () => {
      const key = JSON.stringify([route.meta.parentPath, route.path, value])
      console.log('key', key)
      store.setElementName(key)
    })
  },
}

export default elementDirective
