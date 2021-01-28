<template>
  <div class="node_dashboard ">
    <div class="cf_button">
      <el-button @click="save">管理流程版本</el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'flowInfo',
  data() {
    return {
    }
  },
  methods: {
    save() {
      this.$message.info('功能开发中...')
    }
  }
}
</script>
<style scoped lang="scss">
.cf_button {
  width: 100%;
  .el-button {
    width: 100%;
  }
}
</style>
