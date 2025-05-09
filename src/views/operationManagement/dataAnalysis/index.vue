<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div>
    dataAnalysis
    <p>數據分析</p>
    <!-- 任一有權限即可顯示 -->
    <button v-permission="'edit'">單一權限</button>
    <button v-permission="['edit', 'delete']">任一權限</button>

    <!-- 全部都有才顯示 -->
    <button v-permission.hide.all="['edit', 'delete']">全都符合才顯示</button>

    <!-- 任一符合即可啟用 -->
    <button v-permission:disable="['edit', 'delete']">任一權限啟用</button>

    <!-- 全部符合才啟用 -->
    <button v-permission:disable.all="['edit', 'delete']">全部符合才啟用</button>
  </div>
</template>

<script setup></script>

<style lang="scss" scoped></style>
