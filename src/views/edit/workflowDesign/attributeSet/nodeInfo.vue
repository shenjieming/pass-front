<template>
  <div class="node_dashboard">
    <div v-if="selectionNode.key">
      <h5>节点名称</h5>
      <el-input v-model="selectionNode.text" @change="changeText"></el-input>
      <div class="drive"></div>
      <h5>负责人</h5>
      <div class="tag_div" @click="selectAuditList">
        <el-tag
          v-for="item in selectionNode.auditList"
          closable
          :key="item.id"
          @close="deleteTag(item)">
          {{item.label}}
        </el-tag>
      </div>
      <div class="drive"></div>
      <h5>字段权限</h5>
      <div class="field_tem">
        <div class="node_authority">
          <span class="combo_1">可见</span>
          <span class="combo_2">可编辑</span>
        </div>
        <p>
          <span>全选</span>
          <el-checkbox v-model="allVisible" class="combo_1 check_1" @change="allVisibleChange"></el-checkbox>
          <el-checkbox v-model="allEdit" class="combo_2 check_2" @change="allEditChange"></el-checkbox>
        </p>
        <p v-for="item in selectionNode.option">
          <span>{{item.name}}</span>
          <el-checkbox v-model="item.isShow" class="combo_1 check_1"></el-checkbox>
          <el-checkbox v-model="item.isEdit" class="combo_2 check_2"></el-checkbox>
        </p>
      </div>
    </div>
    <span v-else>
      请选择节点
    </span>
    <select-user-list ref="selectUserLists" :selectedUser.sync="selectionNode.auditList"  :selectNode.sync="userIdList"></select-user-list>
  </div>
</template>

<script>
import selectUserList from './selectUserList'
export default {
  name: 'nodeInfo',
  components: {
    selectUserList
  },
  props: {
    selectionNode: {
      type: Object,
      default: () => {
        return {}
      }
    },
    formData: {
      type: Object,
      default: () => {
        return {
          layoutModel: []
        }
      }
    }
  },
  data() {
    return {
      userIdList: [],
      allVisible: false,
      allEdit: false
    }
  },
  methods: {
    changeText() {
      this.$emit('refresh')
    },
    selectAuditList() {
      this.$refs.selectUserLists.init()
    },
    // 删除标签
    deleteTag(node) {
      this.selectionNode.auditList = this.selectionNode.auditList.filter(item => item.id !== node.id)
    },
    allVisibleChange(val) {
      this.selectionNode.option.forEach(item => {
        item.isShow = val
      })
    },
    allEditChange(val) {
      this.selectionNode.option.forEach(item => {
        item.isEdit = val
      })
    }
  }
}
</script>
<style lang="scss">
.node_dashboard {
  padding: 8px;
  h5 {
    margin-bottom: 8px;
  }
  .tag_div {
    width: 100%;
    padding: 8px;
    min-height: 100px;
    border: 1px solid #ccc;
    .el-tag + .el-tag {
      margin-left: 4px;
      margin-top: 2px;
    }
  }
  .node_authority {
    font-size: 12px;
    width: 100%;
    height: 30px;
    display: flex;
    align-items: center;
    background: #FAFAFA;
    border: 1px solid #ccc;
    border-left: 0;
    border-right: 0;
  }
  .field_tem {
    position: relative;
    .el-checkbox + .el-checkbox {
      margin: 0;
    }
    p {
      //margin: 8px 2px;
      padding: 8px 2px;
      font-size: 12px;
      border-bottom: 1px solid #eee;
    }
  }
  .combo_1 {
    left: 130px;
    position: absolute;
  }
  .combo_2{
    left: 180px;
    position: absolute;
  }
  .check_1 {
    margin-left: 6px;
  }
  .check_2 {
    margin-left: 10px !important;
  }
}
</style>
