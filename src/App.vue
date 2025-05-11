<template>
  <p>el-table</p>
  <el-table :data="tableData" style="width: 100%" data-cy="el-table">
    <el-table-column prop="date" label="Date" width="180" />
    <el-table-column prop="name" label="Name" width="180" />
    <el-table-column prop="address" label="Address" />
  </el-table>
  <el-input v-model="input" style="width: 240px" placeholder="Please input" data-cy="input" />
  <hr />
  <p>bootstraptable</p>
  <table id="table1" data-cy="bootStrapTable"></table>
  <el-input v-model="input1" style="width: 240px" placeholder="Please input" data-cy="input1" />

  <RouterView />
</template>

<script setup>
import { onMounted, ref } from 'vue'
import $ from 'jquery'
const input = ref('')
const input1 = ref('')
const tableData = [
  {
    date: '2016-05-03',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    date: '2016-05-02',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    date: '2016-05-04',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    date: '2016-05-01',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  },
]

function showTable() {
  $('#table1').bootstrapTable({
    columns: [
      {
        field: 'id',
        title: 'Item ID',
      },
      {
        field: 'name',
        title: 'Item Name',
      },
      {
        field: 'price',
        title: 'Item Price',
      },
    ],
    data: [
      {
        id: 1,
        name: 'Item 1',
        price: '$1',
      },
      {
        id: 2,
        name: 'Item 2',
        price: '$2',
      },
    ],
  })
}

onMounted(() => {
  showTable()
})
</script>

<style lang="scss" scoped></style>
