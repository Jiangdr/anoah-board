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
    name: 'EmitBus',
    data() {
      return {
        iptComps: [],
      }
    },
    mounted,
    methods: {
      toNext(nextId) {
        console.log(nextId, this.iptComps);
        let item = this.iptComps.find(item => item.id === nextId);
        if (item) {
          item.component.addcursor({}, 0, -1, -1, -1);
        }
        return item !== undefined
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
