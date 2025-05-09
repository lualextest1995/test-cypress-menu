<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div>
    <h1>login</h1>
    <button @click="addRoute">add route</button>
    <button @click="clearRoute">clear route</button>
    <button @click="router.push('/dataOverview')">數據總覽</button>
    <button @click="router.push('/dataAnalysis')">數據分析</button>
  </div>
</template>

<script setup>
import usePermissionStore from '@/stores/permission'
import { useRouter } from 'vue-router'
import { updateRouter, resetRouter } from '@/router/index.js'
const router = useRouter()
const permissionStore = usePermissionStore()
const data = {
  roleID: 1, // role.id
  name: '管理员', // role.name
  menu: [
    {
      name: '运营管理', // menu.name
      path: '/operationManagement', // menu.path
      isShow: true, // menu.isShow
      page: [
        {
          name: '数据总览', // page.name
          path: '/dataOverview', // page.path
          isShow: true, // page.isShow
          grant: {
            //  join api pageID = page.id, grantKey = key, value = boolean (join apiPermission)
            list: true, // api.grantKey
            export: true,
          },
        },
        {
          name: '数据分析', // page.name
          path: '/dataAnalysis', // page.path
          isShow: true, // page.isShow
          grant: {
            //  join api pageID = page.id, grantKey = key, value = boolean (join apiPermission)
            edit: true, // api.grantKey,
            delete: true,
          },
        },
      ],
    },
  ],
  permission: {
    // apiPermission
    GET: [
      // api.verb
      '/operationManagement/dataOverview', // api.path
      '/operationManagement/dataOverview/export',
    ],
  },
}

function addRoute() {
  const accessRoutes = permissionStore.createAsyncRoutes(data.menu)
  updateRouter(accessRoutes)
}

function clearRoute() {
  resetRouter()
}
</script>

<style lang="scss" scoped></style>
