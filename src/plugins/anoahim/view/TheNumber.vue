<template>
  <div class="k-btn-wrap">
    <transition-group
      name='fade'>
      <div class="clear-fix k-btn-box" v-show="model === 'text'" key="text">
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
              :key="i">{{(isUpper && btn.type === 'default') && btn.text.toUpperCase() || btn.text}}</span>
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
      <!--符号类-->
      <div class="clear-fix sym-aside" v-show="model === 'symbol'" key="symbol">
        <!--<ul class="fl num-ul" :style="cp_left">-->
        <!--<li-->
        <!--v-for="(row, idx) in boardData.symbolsText.ordinary"-->
        <!--:key="idx"-->
        <!--class="clear-fix k-row"-->
        <!--:class="{['k-row-' + boardData.symbolsText.ordinary.length]: 1}">-->
        <!--<span-->
        <!--class="fl k-btn k-symbol"-->
        <!--v-for="(btn, i) in row"-->
        <!--@click.stop="$emit('btn-click', $event, btn)"-->
        <!--:class="{['k-btn-' + row.length]: 1}"-->
        <!--:key="i">{{(isUpper && btn.type === 'default') && btn.text.toUpperCase() || btn.text}}</span>-->
        <!--</li>-->
        <!--</ul>-->

        <!--<ul class="fr sym-ul sym-pad" :style="cp_right">-->
        <!--<li-->
        <!--class="k-row"-->
        <!--v-for="(row, idx) in boardData.symbolsText.large"-->
        <!--:class="{['k-row-' + boardData.symbolsText.large.length]: 1}"-->
        <!--:key="idx">-->
        <!--<span-->
        <!--class="k-btn"-->
        <!--:class="{['k-' + btn.type]: 1, ['k-btn-' + row.length]: 1}"-->
        <!--v-for="(btn, i) in row"-->
        <!--@click.stop="$emit('btn-click', $event, btn)"-->
        <!--:key="i">{{btn.text}}</span>-->
        <!--</li>-->
        <!--</ul>-->
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
      return {
        isUpper: false,
        model: 'text',
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
        let {ordinary, defaultSymbol, large} = this.boardData.keysText,
          {required, group} = this.boardData.matchSymbol,
          i = 0, len = ordinary.length,
          aside = {...group, ...defaultSymbol},
          aside_keys = Object.keys(aside),
          intruder = {},
          cache = Bus.iptComps.find(itm => itm._uid === Bus.selectedUid) || {},
          result = cache.symbol;

        /*选择10个干扰符号*/
        if (!result) {
          Array.from({length: 10}).forEach(() => {
            let k = aside_keys.splice(Math.floor(Math.random() * aside_keys.length), 1)[0];
            return intruder[k] = aside[k];
          });
          cache.symbol = result = Object.entries(Object.assign({}, required, intruder)).slice(0, 10).map(([k, itm]) => {
            return Object.assign({}, itm, {
              text: k,
            })
          });
          result.forEach((itm, idx, arr) => {
            let j = Math.floor(Math.random() * 10);
            [arr[idx], arr[j]] = [arr[j], arr[idx]];
          });
        }

        console.log(required);
        return {
          ordinary: ordinary.map((arr, idx) => {
            let res = [...arr];
            if (idx === len - 1) {
              res.unshift(result[i++]);
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
