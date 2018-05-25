<template>

</template>

<script>
  /******************/
  /******************/
  //region    //import


  //endregion

  /******************/
  /******************/
  //region    //initialize


  //endregion

  /******************/
  /******************/
  //region    //export

  export default {
    data() {
      return {
        iptComps: [],
      }
    },
    mounted,
    methods: {
      toNext(id) {
        let idx = this.iptComps.findIndex(item => item.id === id),
          comp = null,
          match = idx !== -1 && (comp = this.iptComps[++idx]);
        if (match) {
          comp.component.addcursor({}, 0, -1, -1, -1);
        }
        return match
      },
    },

  }
  //endregion

  /******************/
  /******************/
  //region    //function

  /**
   *组件挂载成功执行函数
   */
  function mounted() {

  }

  //endregion

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">

</style>
