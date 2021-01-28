<template>
  <div>
    <sideBar></sideBar>
    <container></container>
  </div>
</template>

<script>
  import sideBar from './sideBar'
  import container from './container'
  import './css/home.scss'
  export default {
    name: 'home',
    components: {
      sideBar,
      container
    }
  }
</script>

<style rel="stylesheet/scss"  lang="scss" scoped>

</style>
