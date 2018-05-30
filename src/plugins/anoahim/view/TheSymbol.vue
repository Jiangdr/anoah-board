<template>
  <div class="k-btn-wrap">
    <ul class="fl num-ul">
      <li
        v-for="(row, idx) in Math.ceil(cp_ordinary.length / 6)"
        :key="idx"
        class="clear-fix k-row k-row-4">
            <span
              class="fl k-btn k-symbol k-btn-6"
              v-for="(btn, i) in 6"
              v-if="(idx * 6 + i) < cp_ordinary.length"
              @click.stop="$emit('btn-click', $event, cp_ordinary[idx * 6 + i])"
              :key="i">{{cp_ordinary[idx * 6 + i].text}}</span>
      </li>
    </ul>
    <ul class="fr sym-ul sym-pad">
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
    name: 'TheSymbol',
    data() {
      return {
        isUpper: false,
      }
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
        let {defaultSymbol, large} = this.boardData.keysText,
          {symbols, prevBoardType} = this.boardData,
          pool = {
            'number': 9,
            'letters': 3,
          };
        if (symbols.length > 0) defaultSymbol = symbols;
        if (prevBoardType) {
          large = [...large, [{
            text: '返回',
            expect: 'goback',
            type: 'symbol',
          }]];
        }
        return {
          ordinary: Object.entries(defaultSymbol).map(([k, val]) => {
            return Object.assign({}, {
              text: k,
            }, val)
          }).slice(pool[prevBoardType] || 0),
          large,
        }
      },
      cp_ordinary() {
        return this.cp_board.ordinary
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

  .num-ul {
    height: calc(100% - 10px);
    width: calc(80% - 10px);
    overflow-y: auto;
    margin: 5px;
    padding: 5px;
  }

  .sym-pad {
    height: 100%;
    width: 20%;
    padding: 10px;
  }

  .k-btn-wrap {
    position: relative;
    padding: 0;
    background: #f5f7f8;
  }

  .k-btn-box {
    z-index: 0;
  }
</style>
