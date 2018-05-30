<template>

  <div
    v-if="num==-1"
    class="iminputdiv"
    :class="{custom: custom}"
    v-on:click.stop="addcursor($event,-1,-1,-1,-1)">

    <div
      v-for="(value,key) in inputarray"
      :key="key"
      class="row"
      v-on:click.stop="addcursor($event,key,-1,-1,-1)"
      v-bind:class="{'red':is_correct?is_correct[key]=='0':0,'green':is_correct?is_correct[key]=='1':0}">
      <template v-for="(value1,key1) in value">
        <span v-if="value1.name=='cursor'" :key="key1" class="k-board cursor">|</span>
        <span
          v-else-if="value1.name=='fraction'||value1.name=='sqrt2'||value1.name=='sqrt3'||value1.name=='aimsup'||value1.name=='aimsub'"
          :key="key1"
          v-bind:class="[value1.name,{'click':is_cursor(value1.value)==1}]"
          v-on:click.stop="addcursor($event,key,key1,-1,-1)">

          <span
            class="enterdiv up"
            v-on:click.stop="addcursor($event,key,key1,-1,'up')">
            <span
              v-for="(value2,key2) in value1.value.up"
              :key="key2"
              :class="value2.name"
              v-on:click.stop="addcursor($event,key,key1,key2,'up')">{{value2.value}}</span>
          </span>
          <span
            class="enterdiv down"
            v-on:click.stop="addcursor($event,key,key1,-1,'down')">
            <span
              v-for="(value2,key2) in value1.value.down"
              :key="key2"
              class="k-board"
              :class="value2.name"
              v-on:click.stop="addcursor($event,key,key1,key2,'down')">{{value2.value}}</span>
          </span>
        </span>
        <span
          v-else
          :key="key1"
          v-bind:class="[value1.name,{'equal':value1.value=='='}]"
          v-on:click.stop="addcursor($event,key,key1,-1,-1)">{{value1.value}}
        </span>
      </template>
    </div>

  </div>

  <div
    v-else
    :key="num"
    class="iminputdiv qti_fill_input"
    v-bind:class="{'red':is_correct?is_correct[num]=='0':0,'green':is_correct?is_correct[num]=='1':0}"
    v-on:click.stop="addcursor($event,num,-1,-1,-1)">

    <template v-if="inputarray[num].length==0&&testdata.msubmitflag==1">?</template>

    <!--<template v-else v-for="(value1,key1) in inputarray[num]">-->

    <!--<template-->
    <!--v-if="inputarray[num].length==1&&value1.name=='aime'&&value1.value==''&&testdata.msubmitflag==1">?-->
    <!--</template>-->
    <!--<div v-else-if="value1.name=='cursor'" :key="key1" class="k-board cursor">1</div>-->
    <!--<div-->
    <!--v-else-if="value1.name=='fraction'||value1.name=='sqrt2'||value1.name=='sqrt3'||value1.name=='aimsup'||value1.name=='aimsub'"-->
    <!--:key="key1" v-bind:class="[value1.name,{'click':is_cursor(value1.value)==1}]"-->
    <!--v-bind:style="{ width: value1.name=='fraction'?Math.max(3,value1.value.up.length*1.4,value1.value.down.length*1.4) + 'vh':'auto' }"-->
    <!--v-on:click.stop="addcursor($event,num,key1,-1,-1)">-->
    <!--<div class="enterdiv up" v-on:click.stop="addcursor($event,num,key1,-1,'up')">-->
    <!--<div v-for="(value2,key2) in value1.value.up" :key="key2" dir="up" :class="value2.name"-->
    <!--v-on:click.stop="addcursor($event,num,key1,key2,'up')">{{value2.value}}-->
    <!--</div>-->
    <!--</div>-->
    <!--<div class="enterdiv down" v-on:click.stop="addcursor($event,num,key1,-1,'down')">-->
    <!--<div v-for="(value2,key2) in value1.value.down" :key="key2" dir="down" :class="value2.name"-->
    <!--v-on:click.stop="addcursor($event,num,key1,key2,'down')">{{value2.value}}-->
    <!--</div>-->
    <!--</div>-->
    <!--</div>-->
    <!--<div v-else :key="key1" :class="value1.name" v-on:click.stop="addcursor($event,num,key1,-1,-1)">-->
    <!--{{value1.value}}-->
    <!--</div>-->

    <!--</template>-->

  </div>

</template>

<script>
  import Bus from './view/emitBus'
  import mathSymbol from './json/queryGid'
  import querySymbol from './json/querySymbol.json'
  import keysTextJson from './json/keystext.json'

  export default {
    name: 'InputBox',
    data() {
      return {
        maxlength: "",
        inputarray: [[]],
        matchBoardType: "none", // 匹配的默认键盘
        symbols: (() => {
          if (this.boardType === 'none') return [];
          return Object.entries(keysTextJson[this.boardType].data.defaultSymbol || {}).map(([k, val]) => {
            return Object.assign({}, val, {
              text: k,
            })
          })
        })(),
      };
    },
    props: {
      testdata: {
        type: Object,
        default() {
          return {
            manswer: [],
          }
        },
      },
      is_correct: { // 输入框文字颜色
        type: Array,
        default() {
          return []
        },
      },
      rootdata: { //
        type: Object,
        default() {
          return {imshow: 0}
        },
      },
      num: { //
        type: [Number, String],
        default: -1,
      },
      /**/
      rects: { // 要替换的输入框client rects
        type: DOMRect,
        default() {
          return new DOMRect();
        },
      },
      prev: { // 要替换的输入框元素
        type: Object,
        default() {
          return {el: null}
        }
      },
      custom: { // 是否使用自定义的样式
        type: Boolean,
        default: false,
      },
      id: { // 当前组件的id，用于下一空跳转标识
        type: [Number, String],
        default: '',
      },
      nextId: { // 下一空跳转的id
        type: [Number, String],
        default: '',
      },
      boardType: { // 键盘类型
        type: [Number, String],
        default: 'none',
      }, // 指定键盘类型
      value: {
        type: [String, Number],
        default: '',
      },
      /*正确答案*/
      rightAnswers: {
        type: [String, Number],
        default: '',
      },
      subject: {
        type: [String, Number],
        default: 2, // 默认学科：数学
      }, // 学科编号
    },
    created: function () {
      Bus.iptComps.push({
        id: this.id,
        component: this,
      });
      /**/
      Bus.$on('before-next', (id, callback) => {
        id === this.id && this.$emit('before-next', callback, {
          currentId: this.id,
        });
      });


      let {el} = this.prev,
        initial = this.value.toString();
      if (this.testdata.mtype == 38) {
        this.maxlength = new Array();
        for (let i = 0; i < this.testdata.manswer.length; i++) {
          this.maxlength[i] = this.testdata.manswer[i][0].length;
        }
      } else {
        this.maxlength = "";
      }
      if (el && el.value.length > 0) {
        initial = el.value;
      }
      for (let v of initial) {
        this.inputarray[0].push({
          name: 'aime',
          value: v,
        });
      }
    },
    methods: {
      //点击添加光标
      addcursor: function (event, i, j, k, dir) {
        if (this.testdata.msubmitflag == 0) { // qti调用键盘
          if (this.testdata.mtype == 33) {
            this.$addcursor(this, 2, event, i, j, k, dir);
          } else if (this.testdata.mtype == 38) {
            if (this.rootdata.bookflag == 1 && this.is_correct[i] == 1) {
              return;
            }
            this.$addcursor(this, 3, event, i, j, k, dir);
          } else {
            this.$addcursor(this, 0, event, i, j, k, dir);
          }
        } else { // 通用环境调动键盘
          let {boardType, symbols, matchBoardType} = this;

          this.$addcursor(this, boardType === 'none' ? matchBoardType : boardType, event, i, j, k, dir, {
            symbols
          });
        }
      },
      //光标是否在公式里
      is_cursor: function (value) {
        let flag = value.up.findIndex((value, index, arr) => {
          return value.name == "cursor";
        });
        if (flag == -1) {
          flag = value.down.findIndex((value, index, arr) => {
            return value.name == "cursor";
          });
        }
        return flag != -1 ? 1 : 0;
      },
      /*获取输入的值*/
      formatVal(arr) {
        let res = '';
        arr.forEach(({value = '', name = 'aime'}) => {
          switch (name) {
            case 'aime': {
              res += value;
            }
              break;
            case 'fraction': {
              res += ' ' + this.formatVal(value.up) + '/' + this.formatVal(value.down);
            }
              break;
            case 'sqrt2': {
              res += ' sprt2(' + this.formatVal(value.down) + ')';
            }
              break;
            case 'sqrt3': {
              res += ' sprt3(' + this.formatVal(value.down) + ')';
            }
              break;
            case 'aimsup': {
              res += ' ' + this.formatVal(value.up) + '^' + this.formatVal(value.down);
            }
              break;
            case 'aimsub': {
              res += ' ' + this.formatVal(value.up) + '_' + this.formatVal(value.down);
            }
              break;
          }
        });
        return res
      },


      /*转移焦点*/
      toNext(nextId = this.nextId) {
        if (!Bus.toNext(nextId)) { // 没有下一个输入框
          this.$closeanoahim();
        }
      },
      /*识别符号组*/
      matchSymbol(calcType, rightAnswers) {
        let gId = {};
        /*
        *数字+符号键盘时
        *答案中含有非数字，优先判定为符号
        */
        if (calcType === 'number' && Number(rightAnswers) != rightAnswers) {

        } else if (calcType === 'letters') {
          /*字母键盘时，当做都有符号处理
          * 识别以空格区分的符号*/
          rightAnswers.split(' ').forEach(val => {
            let m = mathSymbol[val];
            if (m) {
              if (!gId[m.gid]) {
                gId[m.gid] = {
                  [val]: {type: "symbol"},
                };
              } else {
                gId[m.gid][val] = {type: "symbol"};
              }
            }
          });

        }

        /*截取英文组成的符号*/
        let y = rightAnswers.match(/\w+/igm) || [];
        y.forEach(val => {
          let m = mathSymbol[val];
          /* // 获取英文组成的符号的组id*/
          if (m) {
            if (!gId[m.gid]) {
              gId[m.gid] = {
                [val]: {type: "symbol"},
              };
            } else {
              gId[m.gid][val] = {type: "symbol"};
            }
          }
        });
        /*获取普通符号的组id*/
        for (let i of rightAnswers) {
          let m = mathSymbol[i];
          if (m) {
            if (!gId[m.gid]) {
              gId[m.gid] = {
                [i]: {type: "symbol"},
              };
            } else {
              gId[m.gid][i] = {type: "symbol"};
            }
          }
        }

        return gId
      },
    },
    computed: {
    },
    mounted() {

      let {subject, boardType, rightAnswers} = this,
        gId = null,
        required = {}, // 必须具备的符号
        group = {},
        calcType = null;
      /*未传递键盘类型时，通过正确答案判断类型*/
      if (rightAnswers) {
        /*获取gid*/
        switch (subject.toString()) {
          /*学科为数学*/
          case '2': {
            /*若答案中含有数字，使用数字键盘*/
            if (rightAnswers.match(/\d/im)) {
              this.matchBoardType = 'number';
            } else if (rightAnswers.match(/[a-z]/im)) {
              /*答案中没有数字且含有字母，使用英文键盘*/
              this.matchBoardType = 'letters';
            } else {
              this.matchBoardType = 'symbol';
            }
            /*未指定键盘类型时，使用匹配出的键盘类型*/
            calcType = boardType === 'none' ? this.matchBoardType : boardType;

            /*获取符号组id*/
            gId = this.matchSymbol(calcType, rightAnswers);
          }
            break;
        }
        console.log(gId);

        Object.entries(gId).forEach(([k, val]) => {
          let g = querySymbol[k] || {};
          /*必备的符号*/
          Object.assign(required, val);
          /*匹配的符号组*/
          Object.assign(group, g);
        });

        let group_keys = Object.keys(group),
          group_length = group_keys.length,
          required_length = Object.keys(required).length,
          symNum = 0, // 不同键盘类型最少需要符号个数
          minNum = 0, // 实际的最少符号个数
          sum = null, // 干扰符号个数
          intruder = {},
          defaultSym = keysTextJson[boardType].data.defaultSymbol;
        /*数字键盘时，重置符号*/
        if (calcType === 'number') {
          symNum = 10;
        } else if (calcType === 'letters') {
          /*字母键盘时*/
          symNum = 4;
        }

        /*必备符号多于键盘符号按键，显示符号组所有符号*/
        if (required_length > symNum) {
          minNum = group_length;
          intruder = group;
        } else {
          minNum = symNum;
          sum = Math.min(symNum, group_length);
          /*选择干扰符号*/
          Array.from({length: sum}).forEach(() => {
            let k = group_keys.splice(Math.floor(Math.random() * group_keys.length), 1)[0];
            intruder[k] = group[k];
          });
        }


        this.symbols = Object.entries(Object.assign({}, required, intruder, defaultSym)).slice(0, minNum).map(([k, itm]) => {
          return Object.assign({}, itm, {
            text: k,
          })
        });

        /*打乱符号顺序*/
        this.symbols.forEach((itm, i, arr) => {
          let j = Math.floor(Math.random() * arr.length);
          [arr[i], arr[j]] = [arr[j], arr[i]];
        });

      }

    },
    watch: {
      inputarray: {
        deep: true,
        handler(val) {
          val = this.formatVal(val[0]);
          if (this.prev.el) {
            let e = document.createEvent("HTMLEvents");
            e.initEvent("input", true, true);
            this.prev.el.value = val;
            this.prev.el.dispatchEvent(e);
          }
          this.$emit('input', val);
        },
      },
      value(val) {
        this.$emit('after-change', this.toNext, {
          value: val,
        });
      },
    },
  };
</script>

<style lang='scss' scoped>
  @import "iminputdiv";


</style>

