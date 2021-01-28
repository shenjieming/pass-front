<template>
  <div>
    <div class="fr" style="margin-right: 70px">
      <el-button @click="onBtExport"   size="mini">导出</el-button>
      <el-button @click="onBtPrint"   size="mini">打印</el-button>
    </div>
    <div class="gridList">
      <ag-grid ref="signGrid"  id="signGrid" :girdList="gridList" :girdEditModule="girdEditModule" @onRowSelected="onRowSelected" :gridDbClick="gridDbClickFnc"></ag-grid>
    </div>
  </div>

</template>
<script>
  import axios from 'axios'
  // import { getMockData } from  '@/api/mockTest'
  export default {
    name: 'index',
    components: {
      agGrid: () => import('@/components/ag-Grid/template'),
      editModule: {
        template: '<div ><el-button @click="addRow(params)" >递增</el-button><el-button @click="deleteRow(params)">递减</el-button></div>',
        methods: {
          addRow(params) {
            params.data.inputValue++
            // params.api.refreshcell()
            console.log(params)
            this.params.context.componentParent.methodFromParent(this.params.node.rowIndex)
          },
          deleteRow(params) {
            params.data.inputValue--
          }
        }
      }
    },
    data() {
      return {
        // 表单数据
        gridList: [],
        // 表格列自定义
        girdEditModule: {
          'headerName': '操作',
          'field': 'edit',
          'width': 200,
          'suppressMenu': true,
          'pinned': 'left',
          'cellRendererFramework': 'editModule'
        }
      }
    },
    methods: {
      // 表格双击
      gridDbClickFnc(row) {
        console.log(row)
      },
      // 表格选中事件
      onRowSelected(row) {
        console.log(row)
      },
      // 表格导出
      onBtExport() {
        this.$refs.signGrid.onBtExport()
      },
      // 表格打印
      onBtPrint() {
        this.$refs.signGrid.onBtPrint()
      },
      // 表格自定义模板按钮事件
      methodFromParent(index) {
        this.$refs.signGrid.createColumnDefs()
      }
    },
    mounted() {
      axios.get('/9000:/api/data').then(res => {
        this.gridList = res.data.data
        console.log(res)
      })
    }
  }
</script>

<style scoped type="scss">

</style>
