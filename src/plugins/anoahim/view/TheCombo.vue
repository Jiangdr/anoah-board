<template>
  <div class="k-btn-wrap k-letters">
    <ul class="fl num-ul">
      <li
        v-for="(row, idx) in cp_ordinary"
        :key="idx"
        class="clear-fix k-row"
        :class="{['k-row-' + cp_ordinary.length]: 1}">
            <span
              class="fl k-btn"
              v-for="(btn, i) in row"
              @click.stop="btnClick($event, btn)"
              :class="{['k-' + btn.type]: 1, ['k-btn-' + row.length]: 1}"
              :key="i">{{(isUpper && btn.type === 'default') && btn.text.toUpperCase() || btn.text}}</span>
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
    name: 'TheCombo',
    data() {
      return {
        isUpper: false, // 是否大写
        model: 'text',
      }
    },
    props: {
      boardData: {
        type: Object,
        required: true,
      },
      boardModel: {
        type: String,
        default: '',
      },
    },
    mounted,
    methods: {
      btnClick(e, data) {
        let {expect, type, text} = data,
          isUpper = null;
        if (expect === 'caseSwitch') {
          this.isUpper = !this.isUpper;
          return
        }
        ({isUpper} = this);
        if (isUpper && type === 'default') {
          text = text.toUpperCase();
        }

        this.$emit('btn-click', e, Object.assign({}, data, {
          text,
          isUpper: this.isUpper,
        }));
      },
    },
    computed: {
      cp_ordinary() {
        let {symbols, keysText: {ordinary}} = this.boardData,
          origin = ordinary[3],
          lastArr = null;
        if (symbols.length > 4) {
          lastArr = [{
            text: '更多',
            type: "symbol",
            expect: "switch"
          }, ...symbols.slice(0, 1), origin[0], ...symbols.slice(1, 3), origin[1]];
        } else {
          lastArr = [origin[0], ...symbols.slice(0, 2), origin[1], ...symbols.slice(2, 3), ...origin.slice(2, 4)];
        }

        return [...ordinary.slice(0, 3), lastArr]
      },
      // cp_symbol() {
      //   let {symbols, keysText: {ordinary}} = this.boardData,
      //     origin = ordinary[3];
      //
      //   return [...ordinary.slice(0, 3), [...symbols.slice(0, 2), origin[0], ...symbols.slice(2, 4), origin[1]]]
      // },
      cp_right() {
        return this.boardData.keysText.large && {
          width: '20%',
        }
      },
      cp_left() {
        return this.boardData.keysText.large && {
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
