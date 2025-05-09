<template>
  <div class="layout">
    <div class="header" @click="router.push('/login')">header</div>
    <slot />
    <div class="footer">footer</div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
const router = useRouter()
</script>

<style lang="scss" scoped>
.layout {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100vh;
}
.header {
  height: 50px;
  background-color: #f0f0f0;
  text-align: center;
  line-height: 50px;
}
.footer {
  height: 50px;
  background-color: #f0f0f0;
  text-align: center;
  line-height: 50px;
}
</style>
