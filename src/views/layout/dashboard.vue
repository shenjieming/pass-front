<template>
   <div class="dashboard">
     <nav-bar></nav-bar>
     <div class="dashboard-body">
       <router-view/>
     </div>
   </div>
</template>

<script>
  import navBar from './navBar'
  export default {
    name: 'layout',
    components: {
      navBar
    }
  }
</script>
