<template>
  <el-dialog
    title="选择负责人"
    :visible.sync="dialogVisible"
    width="600">
    <el-tree
      :data="userList"
      ref="userList"
      show-checkbox
      node-key="id"
      default-expand-all
      :default-checked-keys="selectedUser"
      :props="treeProps">
    </el-tree>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="save">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  name: 'selectUserList',
  props: {
    selectNode: {
      type: Array,
      default: () => {
        return []
      }
    },
    selectedUser: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data() {
    return {
      treeProps: {
        label: 'label',
        children: 'children'
      },
      userList: [{
        id: 1,
        label: '群组A',
        children: [{
          id: 4,
          label: '张三',
          children: [{
            id: 9,
            label: '刘二'
          }, {
            id: 10,
            label: '李四'
          }]
        }]
      }, {
        id: 2,
        label: '群组B',
        children: [{
          id: 5,
          label: '王五'
        }, {
          id: 6,
          label: '曹刘'
        }]
      }, {
        id: 3,
        label: '群组C',
        children: [{
          id: 7,
          label: '陆奇'
        }, {
          id: 8,
          label: '杨八'
        }]
      }],
      dialogVisible: false
    }
  },
  methods: {
    // 初始化
    init() {
      this.dialogVisible = true
    },
    // 获取创建人列表
    getUserList() {
    },
    save() {
      const arr = this.$refs.userList.getCheckedKeys()
      if (arr.length) {
        console.log(this.$refs.userList.getCheckedNodes())
        this.$emit('update:selectedUser', this.$refs.userList.getCheckedNodes())
        this.$emit('update:selectNode', arr)
        this.dialogVisible = false
      } else {
        this.$message.error('选择负责人')
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.dialog-footer {
  text-align: right;
}
</style>
