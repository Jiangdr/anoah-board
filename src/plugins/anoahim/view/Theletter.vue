<template>
  <div class="k-btn-wrap"
       :class="boardData.class">
    <transition-group
      name='fade'>
      <div class="clear-fix k-btn-box" v-show="model === 'text'" key="text">
        <ul class="fl num-ul" :style="cp_left">
          <li
            v-for="(row, idx) in keysText.ordinary"
            :key="idx"
            class="clear-fix k-row"
            :class="{['k-row-' + keysText.ordinary.length]: 1}">
        <span
          class="fl k-btn"
          v-for="(btn, i) in row"
          @click.stop="$emit('btn-click', $event, btn)"
          :class="{['k-' + btn.type]: 1, ['k-btn-' + row.length]: 1}"
          :key="i">{{(isUpper && btn.type === 'default') && btn.text.toUpperCase() || btn.text}}</span>
          </li>
        </ul>
        <ul class="fr sym-ul sym-pad" :style="cp_right">
          <li
            class="k-row"
            :class="{['k-row-' + keysText.large.length]: 1}"
            v-for="(row, idx) in keysText.large"
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
      <!--符号类-->
      <div class="clear-fix sym-aside" v-show="model === 'symbol'" key="symbol">
        <ul class="fl num-ul" :style="cp_left">
          <li
            v-for="(row, idx) in symbolsText.ordinary"
            :key="idx"
            class="clear-fix k-row"
            :class="{['k-row-' + symbolsText.ordinary.length]: 1}">
        <span
          class="fl k-btn k-symbol"
          v-for="(btn, i) in row"
          @click.stop="$emit('btn-click', $event, btn)"
          :class="{['k-btn-' + row.length]: 1}"
          :key="i">{{(isUpper && btn.type === 'default') && btn.text.toUpperCase() || btn.text}}</span>
          </li>
        </ul>

        <ul class="fr sym-ul sym-pad" :style="cp_right">
          <li
            class="k-row"
            v-for="(row, idx) in symbolsText.large"
            :class="{['k-row-' + symbolsText.large.length]: 1}"
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
    name: 'BoardModul',
    data() {
      return {}
    },
    props: {
      boardData: {
        type: Object,
        required: true,
      },
      symbolsText: {
        type: Object,
        default() {
          return {}
        },
      },
      isUpper: {
        type: Boolean,
        default: false,
      },
      model: {
        type: String,
        default: 'text',
      },
    },
    mounted,
    methods: {
      btnClick(e, data) {
      },
    },
    computed: {
      cp_right() {
        return this.keysText.large && {
          width: '20%',
        }
      },
      cp_left() {
        return this.keysText.large && {
          width: '80%',
        }
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
    Bus.$on('btn-click', this.btnClick)
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
