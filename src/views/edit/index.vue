<template>
  <div>
    <div class="dashboard-header">
      <div class="dashboard-header-nav">
        <div class="nav" @click="goBack">
          <i class="el-icon-arrow-left" style="color: #0b8bef"></i>
          <span>{{nav || '未命名的空间'}}</span>
        </div>
        <div  class="nav-center">
          <router-link to="/edit/formDesign" exact>表单设计</router-link>
          <router-link to="/edit/workflowDesign">流程设计</router-link>
          <router-link to="/edit/dataManager">数据管理</router-link>
        </div>
      </div>
    </div>
    <div style="position: absolute; top: 60px;left: 0; bottom: 0;right: 0">
      <router-view/>
    </div>
  </div>

</template>

<script>
  import { mapGetters } from 'vuex'
  export default {
    name: 'index',
    computed: {
      ...mapGetters([
        'isEditPage',
        'nav'
        // 'pageType'
      ])
    },
    methods: {
      goBack() {
        this.$router.push({ name: 'home' })
      }
    }
  }
</script>

<style scoped lang="scss">
  .nav-center  {
    top: 0; text-align: center; width: 100%;position: absolute;display: inline-block;
    a {
      margin-left: 40px;
    }
  }
  .nav-center span {
    display: inline-block;cursor: pointer;
  }
  .nav-active {
    border-bottom: 2px solid #ff934e;
  }
  .nav-right {
    position: absolute;right: 0;top: 0;display: inline-block;cursor: pointer;
  }
</style>
