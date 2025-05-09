<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div>
    dataOverview
    <p>数据总览</p>
    <button @click="test" v-element="['test', $route]">fetch data</button>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'
const route = useRoute()
function test() {
  console.log('test')
}
// this.$router.push('/dataAnalysis
onMounted(() => {
  console.log('route', route)
})
</script>

<style lang="scss" scoped></style>
