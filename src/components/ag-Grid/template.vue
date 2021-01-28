<template>
  <div class="grid-container">
    <div class="tb">
      <div class="setting">
        <div v-popover:popoverlist class="filter" v-if="isFilter">
          <svg-icon icon-class="filter"/>
          <span>设置</span>
        </div>
        <el-popover
          ref="popoverlist"
          v-model="visible"
          placement="bottom-end"
          width="500"
          trigger="click">
          <div class="gridField">
            <div class="popover-title">
               <span>
                    列表设置
              </span>
              <div class="fr">
                <el-button size="mini" @click="saveGridStatus()" :loading="btmDisable">保存设置</el-button>
                <!--<el-button size="mini" @click="recoverGridStatus('SNAPSHOT')" :loading="btmDisable">恢复保存</el-button>-->
                <!--<el-button size="mini" @click="recoverGridStatus('SYSTEM')" :loading="btmDisable">恢复默认</el-button>-->
              </div>
            </div>
            <div class="popover-inner-content">
              <el-checkbox-group v-model="gridCheckedList">
                <el-checkbox v-for="(item, index) in gridFiledList"  :key="index" :label="item.fieldCaption" @change="gridOpenedChange($event, item.fieldCaption)"></el-checkbox>
              </el-checkbox-group>
            </div>
          </div>
        </el-popover>
      </div>
      <ag-grid-vue style="width: 100%; height: 100%;padding: 5px;float: left" class="ag-fresh"
                   :rowSelected="onRowSelected"
                   :columnMoved="onColumnEvent"
                   :columnResized="onColumnResized"
                   :columnVisible="onColumnVisible"
                   :gridOptions="gridOptions"
                   :columnDefs="columnDefs"
                   :rowDoubleClicked="gridDbClick"
                   :rowData="girdList">
      </ag-grid-vue>
    </div>
  </div>
</template>

<script>
  import { getParamValues } from '@/utils'
  export default {
    props: {
      // grid数据
      girdList: {
        type: Array,
        default: []
      },
      // 表格头过滤栓选
      isFilter: {
        type: Boolean,
        default: true
      },
      // 自定义模板
      girdEditModule: {
        type: Object,
        default: {}
      }
    },
    components: {
      AgGridVue: () => import('ag-grid-vue/dist/agGridVue'),
      inputModule: {
        // template: '<input v-model="params.value" style="width: 80px;height: 28px" @keyup="onFocus"  oninput="this.value=this.value.replace(/\\D/g,\'\').replace(/^0+(?=\\d)/,\'\')"/>',
        template: '<el-input-number v-model="params.value" :controls="false" :min="0" :max="maxNum"></el-input-number>',
        computed: {
          maxNum() {
            return 100
          }
        }
      },
      editModule: {
        template: '<div ><el-button @click="addRow(params)" >递增</el-button><el-button @click="deleteRow(params)">递减</el-button></div>',
        methods: {
          addRow(params) {
            params.data.inputValue++
            this.params.context.componentParent.$parent.methodFromParent(this.params.node.rowIndex)
          },
          deleteRow(params) {
            params.data.inputValue--
            this.params.context.componentParent.$parent.methodFromParent(this.params.node.rowIndex)
          }
        }
      }
    },
    data() {
      return {
        // 表格选项
        gridOptions: null,
        // 列数据（定义每列的属性， 列名称，字段等）
        columnDefs: [],
        // 每列表格数据
        gridFiledList: [
          { fieldCaption: '姓名', field: 'name', width: 150, visibleFlag: 1 },
          { fieldCaption: '工号', field: 'id', width: 150, visibleFlag: 1 },
          { fieldCaption: '测试', field: 'department', width: 150, visibleFlag: 1 },
          { fieldCaption: '测试备注', field: 'remark', width: 150, visibleFlag: 1 }
          // { fieldCaption: '输入框', field: 'inputValue', width: 200,suppressMenu: 'true', visibleFlag: 1 }
        ],
        // 列表头默认选中列表
        gridCheckedList: [],
        /* 控制彈出框是否可见*/
        visible: false,
        btmDisable: false
      }
    },
    methods: {
      /*
      * 1. 给grid 新增数据
      * 2.this,gridOpened  为 grid 过滤栓选内容
      * 3.this.gridCheckedList 为默认选中列名数组
      * */
      createColumnDefs() {
        this.gridCheckedList = []
        this.columnDefs = [{
          headerName: '',
          headerCheckboxSelection: true,
          headerCheckboxSelectionFilteredOnly: true,
          checkboxSelection: true,
          pinned: 'left',
          width: 20
        }]
        if (this.girdEditModule) {
          this.columnDefs.push(this.girdEditModule)
        }
        for (const o in this.gridFiledList) {
          const arr = {
            'headerName': '' + this.gridFiledList[o].fieldCaption + '',
            'field': this.gridFiledList[o].field,
            'width': this.gridFiledList[o].width,
            'tooltipField': this.gridFiledList[o].fieldCaption,
            'throttleScroll': true,
            'hide': !(this.gridFiledList[o].visibleFlag === 1),
            'enableFilter': true,
            'enableSorting': true
          }
          this.columnDefs.push(arr)
          if (this.gridFiledList[o].visibleFlag === 1) {
            this.gridCheckedList.push(this.gridFiledList[o].fieldCaption)
          }
        }
        this.columnDefs.push({
          'headerName': '输入框',
          'field': 'inputValue',
          'width': 200,
          'tooltipField': '输入框',
          'suppressMenu': true,
          'cellRendererFramework': 'inputModule'
        })
      },
      // 显示隐藏列控制
      gridOpenedChange(visibleFlag, fieldCaption) {
        this.gridOptions.columnApi.setColumnVisible('' + fieldCaption + '', visibleFlag)
        for (const i in this.gridFiledList) {
          if (this.gridFiledList[i].fieldCaption.indexOf(fieldCaption) !== -1) {
            if (visibleFlag) {
              this.gridFiledList[i].visibleFlag = 1
            } else {
              this.gridFiledList[i].visibleFlag = 0
            }
          }
        }
      },
      // 导出表格，只支持csv格式
      onBtExport() {
        const params = {
          columnKeys: getParamValues('colId', this.gridOptions.columnApi.getAllDisplayedVirtualColumns()),
          fileName: '表格下载'
        }
        this.gridOptions.api.exportDataAsCsv(params)
      },
      // 表格打印
      onBtPrint() {
        // 目前暂时有bug,因为打印只能打印当前页面所见数据，并不能打印全部数据
        const headstr = '<html><head><title></title></head><body>' // 打印头部
        const footstr = '</body></html>' // 打印尾部
        const printData = document.getElementById('signGrid').innerHTML // 获得 p 里的所有 html 数据
        const oldstr = document.body.innerHTML
        document.body.innerHTML = headstr + printData + footstr
        window.print()
        document.body.innerHTML = oldstr // 保持原页面格式
      },
      // 列宽度调整
      onColumnResized(event) {
        /*  当用户每次拖动表格列宽时，请求后台 表头更新api*/
        if (event.finished && event.source === 'uiColumnDragged') {
          this.btmDisable = true
        }
      },
      // 列移动
      onColumnEvent(event) {
        /* 当用户移动整列表格，自动更新表格数据*/
        const gridList = event.columnApi.getAllGridColumns()
        for (const i in gridList) {
          for (const j in this.isHeaderList) {
            if (gridList[i].colId === this.isHeaderList[j].fieldName) {
              this.isHeaderList[j].displayOrder = i
            }
          }
        }
        this.btmDisable = true
      },
      // 行选择或取消选择
      onRowSelected(event) {
        this.$emit('onRowSelected', event)
      },
      saveGridStatus() {
        // 保存设置
        this.btmDisable = true
        this.createColumnDefs()
        this.visible = false
        this.btmDisable = false
      },
      // 显示隐藏列触发
      onColumnVisible(event) {
        // console.log('列隐藏/显示')
      },
      // 双击列表事件
      gridDbClick(row) {
        this.$emit('gridDbClickFnc', row.data)
      }
    },
    created() {
      this.createColumnDefs()
    },
    beforeMount() {
      this.gridOptions = {
        context: {
          componentParent: this
        },
        rowSelection: 'multiple',
        enableSorting: true,
        enableColResize: true,
        enableFilter: true,
        suppressRowClickSelection: true,
        suppressDragLeaveHidesColumns: true,
        rowHeight: 32,
        headerHeight: 32,
        suppressExcelExport: true,
        suppressCopyRowsToClipboard: true,
        enableRangeSelection: true,
        suppressContextMenu: true,
        toolPanelSuppressSideButtons: true,
        overlayLoadingTemplate: '<span class="ag-overlay-loading-center">loading...</span>',
        overlayNoRowsTemplate: '<span class="grid-norows"><img class="pic" src="./static/images/none_icon.png"><span>暂无相关记录</span></span>'
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .grid-container {
    margin-top: 10px;
    .tb {
      height: 100%;
      min-height: 210px;
      .setting {
        position: absolute;
        right: 0;
      }
    }
    .filter {
      display: inline-block;
      color: #666666;
      border: #ccc 1px solid;
      padding: 6px;
      border-radius: 3px;
      cursor: pointer;
      background-color: #fff;
      font-size: 14px;
    }
  }
</style>
