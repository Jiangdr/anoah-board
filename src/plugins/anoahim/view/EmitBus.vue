<template>
  <div></div>
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
        selectedUid: '',
      }
    },
    mounted,
    methods: {
      /*跳转下一空之前*/
      /*跳转下一空*/
      toNext(nextId, id) {
        console.log(nextId, id);
        this.$emit('before-next', id, (redirect) => {
          redirect !== undefined && (nextId = redirect);
        });
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
