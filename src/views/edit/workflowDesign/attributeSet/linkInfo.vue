<template>
  <div class="node_dashboard">
    <div v-if="selectionNode.fromPort">
      <h5>节点备注</h5>
      <p>{{selectionNode.text}}</p>
      <div class="drive"></div>
      <h5>数据流转条件</h5>
      <el-input type="textarea" v-modal="selectionNode.parameter" placeholder="请输入流转条件公式"></el-input>
    </div>
    <div v-else>
      请选择连接线..
    </div>
  </div>
</template>

<script>
export default {
  name: 'linkInfo',
  props: {
    selectionNode: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      formData: {}
    }
  },
  methods: {

  }
}
</script>

<style scoped>
p {
  font-size: 12px;
  margin: 6px 0;
}
</style>
