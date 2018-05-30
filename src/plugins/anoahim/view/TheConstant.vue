<template>
  <div class="k-btn-wrap">
    <transition-group
      name='fade'>
      <div class="clear-fix k-btn-box" key="text">
        <ul class="fl num-ul" :style="cp_left">
          <li
            v-for="(row, idx) in cp_ordinary"
            :key="idx"
            class="clear-fix k-row"
            :class="{['k-row-' + cp_ordinary.length]: 1}">
        <span
          class="fl k-btn"
          v-for="(btn, i) in row"
          @click.stop="$emit('btn-click', $event, btn)"
          :class="{['k-' + btn.type]: 1, ['k-btn-' + row.length]: 1}"
          :key="i">{{btn.text}}</span>
          </li>
        </ul>
        <ul class="fr sym-ul sym-pad" :style="cp_right">
          <li
            class="k-row"
            :class="{['k-row-' + cp_large.length]: 1}"
            v-for="(row, idx) in cp_large"
            :key="idx">
        <span
          class="k-btn"
          :class="{['k-' + btn.type]: 1, ['k-btn-' + row.length]: 1}"
          v-for="(btn, i) in row"
          @click.stop="$emit('btn-click', $event, btn)"
          :key="i">{{btn.text}}</span>
          </li>
        </ul>
      </div>
    </transition-group>
  </div>
</template>

<script>
  /******************/
  /******************/
  //region    //import
  import Bus from './emitBus'


  //endregion

  /******************/
  /******************/
  //region    //initialize


  //endregion

  /******************/
  /******************/
  //region    //export

  export default {
    name: 'TheConstant',
    data() {
      return {}
    },
    props: {
      boardData: {
        type: Object,
        required: true,
      },
    },
    mounted,
    methods: {
      btnClick(e, data) {
      },
    },
    computed: {
      cp_right() {
        return this.cp_large && {
          width: '20%',
        }
      },
      cp_left() {
        return this.cp_large && {
          width: '80%',
        }
      },
      cp_ordinary() {
        return this.boardData.keysText.ordinary
      },
      cp_large() {
        return this.boardData.keysText.large
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

  .num-ul, .sym-pad {
    height: 100%;
    width: 100%;
  }

  .k-btn-wrap {
    position: relative;
  }

  .sym-aside, .k-btn-box {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    padding: 10px;
    background: #f5f7f8;
  }

  .k-btn-box {
    z-index: 0;
  }
</style>
