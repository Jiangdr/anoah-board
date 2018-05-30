<template>
  <div class="clear-fix k-btn-wrap">
    <ul class="fl num-ul" :style="cp_left">
      <li
        v-for="(row, idx) in cp_board.ordinary"
        :key="idx"
        class="clear-fix k-row"
        :class="{['k-row-' + cp_board.ordinary.length]: 1}">
            <span
              class="fl k-btn"
              v-for="(btn, i) in row"
              @click.stop="$emit('btn-click', $event, btn)"
              :class="{['k-' + btn.type]: 1, ['k-btn-' + cp_board.ordinary[0].length]: 1}"
              :key="i">{{btn.text}}</span>
      </li>
    </ul>
    <ul class="fr sym-ul sym-pad" :style="cp_right">
      <li
        class="k-row"
        :class="{['k-row-' + cp_board.large.length]: 1}"
        v-for="(row, idx) in cp_board.large"
        :key="idx">
        <span
          class="k-btn"
          :class="{['k-' + btn.type]: 1, ['k-btn-' + cp_board.large[0].length]: 1}"
          v-for="(btn, i) in row"
          @click.stop="$emit('btn-click', $event, btn)"
          :key="i">{{btn.text}}</span>
      </li>
    </ul>
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
    name: 'TheNumber',
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
      cp_board() {
        let {ordinary, large} = this.boardData.keysText,
          symbols = this.boardData.symbols,
          i = 0, len = ordinary.length,
          result = symbols;
        if (symbols.length > 10) {

        } else {

        }

        return {
          ordinary: ordinary.map((arr, idx) => {
            let res = [...arr];
            if (idx === len - 1) {
              res.unshift(symbols.length > 10 ? {
                text: '更多',
                type: "symbol",
                expect: "switch"
              } : result[i++]);
              res.splice(1, 0, result[i++]);
              res.push(result[i++]);
              res.push(result[i++]);
            } else {
              res.unshift(result[i++]);
              res.push(result[i++]);
            }
            return res
          }),
          large,
        }
      },

      cp_right() {
        return this.cp_board.large && {
          width: '20%',
        }
      },
      cp_left() {
        return this.cp_board.large && {
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
    background: #f5f7f8;
  }

  .k-btn-box {
    z-index: 0;
  }
</style>
