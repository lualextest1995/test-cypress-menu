<template>
  <p>el-table</p>
  <!-- <el-table :data="tableData" style="width: 100%" data-cy="el-table">
    <el-table-column prop="date" label="Date" width="180" />
    <el-table-column prop="name" label="Name" width="180" />
    <el-table-column prop="address" label="Address" />
  </el-table>
  <el-input v-model="input" style="width: 240px" placeholder="Please input" data-cy="input" />
  <hr />
  <p>bootstraptable</p>
  <table id="table1" data-cy="bootStrapTable"></table>
  <el-input v-model="input1" style="width: 240px" placeholder="Please input" data-cy="input1" />
  <hr /> -->
  <div data-cy="datePicker" style="width: 50%; border: 1px solid red">
    <!-- <el-date-picker
      v-model="value2"
      type="datetimerange"
      :shortcuts="shortcuts"
      range-separator="To"
      start-placeholder="Start date"
      end-placeholder="End date"
    /> -->
    <el-date-picker v-model="value1" type="date" placeholder="Pick a day" />
  </div>

  <!-- <RouterView /> -->
</template>

<script setup>
import { onMounted, ref } from 'vue'
import $ from 'jquery'
const input = ref('')
const input1 = ref('')
const value1 = ref('')
const value2 = ref('')

const shortcuts = [
  {
    text: 'Last week',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setDate(start.getDate() - 7)
      return [start, end]
    },
  },
  {
    text: 'Last month',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setMonth(start.getMonth() - 1)
      return [start, end]
    },
  },
  {
    text: 'Last 3 months',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setMonth(start.getMonth() - 3)
      return [start, end]
    },
  },
]
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

onMounted(async () => {
  // const res = await fetch('http://localhost:3000/userFunction')
  // const data = await res.json()
  // console.log('data', data)
  // showTable()
})
</script>

<style lang="scss" scoped></style>
