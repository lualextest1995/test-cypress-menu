<template>
  <component :is="curentLayout">
    <RouterView />
  </component>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import DefaultLayout from './DefaultLayout.vue'
import TestLayout from './TestLayout.vue'
const route = useRoute()
const layouts = {
  DefaultLayout,
  TestLayout,
}
const curentLayout = computed(() => {
  const layout = route.meta.layout
  return layouts[layout] || DefaultLayout
})

onMounted(() => {
  console.log(route.meta.layout) // ❌ 依然是原始 route 設定，不是剛剛改的
})
</script>

<style lang="scss" scoped></style>
