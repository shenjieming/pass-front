<template>
    <div class="frame-left">
      <div class="widget-cate">
        基础字段
      </div>
      <ul style="padding: 0 10px 10px">
        <!--ghostClass:'ghost-tool-bar'-->
        <draggable v-model="toolBarArray.basicList"
                   :options="{animation:150,group:{pull: 'clone', put: false, name: 'draggableModel'},sort :false,forceFallback: true,dragClass:'drag-tool-bar-class',draggable:'.widget-label',filter: '.frame-right'}"
                   @end="onEnd"
                   :move="onMove">
        <li class="widget-label" v-for="(item, index) in toolBarArray.basicList" :key="index" :name="item.input" @click="dragAdd(item,index)">
          <a class="dragging">
            <i :class="item.icon"></i>
            <span class="pl-5" style="cursor: move">
             {{item.name}}
            </span>
          </a>
        </li>
        </draggable>
      </ul>
    </div>
</template>
<script>
  import draggable from 'vuedraggable'
  export default {
    name: 'toolBar',
    props: {
      layoutModel: {
        type: Array,
        default: []
      },
      selectField: {
        type: Object,
        default: {
          TransformList: []
        }
      }
    },
    data() {
      return {
        toolBarArray: {
          basicList: [
            { name: '单行文本', type: 'input', TransformList: [{ name: '下拉框', type: 'combo' }, { name: '单选按钮组', type: 'radioGroup' }, { name: '单行文本', type: 'input' }], icon: 'el-icon-edit-outline', desc: '', content: '', active: false, id: 1 },
            { name: '多行文本', type: 'textArea', icon: 'el-icon-edit-outline', desc: '', content: '', active: false, id: 2 },
            { name: '数字', type: 'number', icon: 'el-icon-edit-outline', desc: '', content: '', active: false, id: 3 },
            { name: '日期时间', type: 'dateTime', icon: 'el-icon-edit-outline', desc: '', content: '', active: false, id: 4 },
            { name: '单选按钮组', type: 'radioGroup', TransformList: [{ name: '下拉框', type: 'combo' }, { name: '单选按钮组', type: 'radioGroup' }, { name: '单行文本', type: 'input' }], icon: 'el-icon-edit-outline', desc: '', content: '', active: false, id: 5 },
            { name: '复选框组', type: 'checkBoxGroup', TransformList: [{ name: '下拉复选框', type: 'comboCheck' }, { name: '复选框组', type: 'checkBoxGroup' }], icon: 'el-icon-edit-outline', desc: '', content: [{ label: '选择1', id: 1 }, { label: '选择2', id: 2 }, { label: '选择3', id: 3 }], active: false, id: 6 },
            { name: '下拉框', type: 'combo', TransformList: [{ name: '下拉框', type: 'combo' }, { name: '单选按钮组', type: 'radioGroup' }, { name: '单行文本', type: 'input' }], icon: 'el-icon-edit-outline', desc: '', list: [{ label: '选择1', id: 1 }, { label: '选择2', id: 2 }, { label: '选择3', id: 3 }], content: '', optionType: 0, active: false, id: 6 },
            { name: '下拉复选框', type: 'comboCheck', TransformList: [{ name: '下拉复选框', type: 'comboCheck' }, { name: '复选框组', type: 'checkBoxGroup' }], icon: 'el-icon-edit-outline', desc: '', list: [{ label: '选择1', id: 1 }, { label: '选择2', id: 2 }, { label: '选择3', id: 3 }], content: [], optionType: 0, active: false, id: 7 },
            { name: '分割线', type: 'cut-off', icon: 'el-icon-edit-outline', desc: '', content: ['solid'], list: [{ code: 'solid', name: '实线' }, { code: 'dotted', name: '虚线' }, { code: 'double', name: '粗线' }], active: false, id: 8 }
          ]
        },
        dragIndex: ''
      }
    },
    components: {
      draggable
    },
    methods: {
      /* 判断拖拽体是否包含在 另一个装载容器的区域内，如果是的话 则显示 区域框，否的话删除区域框*/
      onEnd(event) {
        this.$emit('drag-change', false)
      },
      /* 拖拽事件开始*/
      onMove({ relatedContext, draggedContext }) {
        this.$emit('drag-change', true)
        this.dragIndex = draggedContext.futureIndex
      },
      /* 点击新增一条数据，并且处于激活状态   避免 drag-tool-bar-Class 样式污染*/
      dragAdd(item, index) {
        const random = Math.random()
        const dgItem = JSON.parse(JSON.stringify(item))
        this.$set(dgItem, 'id', random)
        this.layoutModel.push(dgItem)
        this.$emit('group-item-click', dgItem)
        document.getElementsByClassName('widget-label')[index].classList.remove('drag-tool-bar-class')
      }
    },
    created() {
      this.toolBarArray.basicList.forEach(item => {
        item.isRequire = true
        item.isShow = true
        item.isEdit = true
      })
    }
  }
</script>

<style scoped lang="scss">
  .sortable-ghost {
    text-align: center;
    background: #F4F6FC;
    /*border: 1px dashed #0DB3A6;*/
  }
</style>
