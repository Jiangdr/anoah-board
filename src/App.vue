<template>
  <div id="app" class="root-app">
    <router-view/>
  </div>
</template>

<script>
  export default {
    name: 'App',
    watch: {
      $route() {
        this.$closeanoahim();
      },
    },
  }
</script>

<style>
  #app {
    margin: 0;
    padding: 0;
    height: 100%;
    top: 0;
    -webkit-transition: top .2s linear;
    -moz-transition: top .2s linear;
    -ms-transition: top .2s linear;
    -o-transition: top .2s linear;
    transition: top .2s linear;
  }
</style>
