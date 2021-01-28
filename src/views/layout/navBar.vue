<template>
    <div class="dashboard-header">
      <div class="dashboard-header-nav">
        <i class="el-icon-menu" style="color: cornflowerblue"></i>
        <span> 导航栏</span>
      </div>
    </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  export default {
    name: 'navBar',
    computed: {
      ...mapGetters([
        'isEditPage',
        'nav'
        // 'pageType'
      ])
    }
  }
</script>

<style rel="stylesheet/scss"  lang="scss" scoped>
  .nav-center  {
    top: 0; text-align: center; width: 100%;position: absolute;display: inline-block;
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
