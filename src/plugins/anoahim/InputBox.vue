<template>

  <div
    :style="cp_position"
    v-if="num==-1"
    class="iminputdiv"
    :class="{custom: custom}"
    v-on:click.stop="addcursor($event,-1,-1,-1,-1)">

    <div
      v-for="(value,key) in inputarray"
      :key="key"
      class="row clear-fix"
      v-on:click.stop="addcursor($event,key,-1,-1,-1)"
      v-bind:class="{'red':is_correct?is_correct[key]=='0':0,'green':is_correct?is_correct[key]=='1':0}">
      <template v-for="(value1,key1) in value">
        <span v-if="value1.name=='cursor'" :key="key1" class="k-board cursor fl"></span>
        <span
          class="fl"
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
          class="fl"
          :key="key1"
          v-bind:class="[value1.name,{'equal':value1.value=='='}]"
          v-on:click.stop="addcursor($event,key,key1,-1,-1)">{{value1.value}}
        </span>
      </template>
    </div>

  </div>

  <!--<div-->
  <!--v-else-->
  <!--:key="num"-->
  <!--class="iminputdiv qti_fill_input"-->
  <!--v-bind:class="{'red':is_correct?is_correct[num]=='0':0,'green':is_correct?is_correct[num]=='1':0}"-->
  <!--v-on:click.stop="addcursor($event,num,-1,-1,-1)">-->

  <!--<template v-if="inputarray[num].length==0&&testdata.msubmitflag==1">?</template>-->

  <!--&lt;!&ndash;<template v-else v-for="(value1,key1) in inputarray[num]">&ndash;&gt;-->

  <!--&lt;!&ndash;<template&ndash;&gt;-->
  <!--&lt;!&ndash;v-if="inputarray[num].length==1&&value1.name=='aime'&&value1.value==''&&testdata.msubmitflag==1">?&ndash;&gt;-->
  <!--&lt;!&ndash;</template>&ndash;&gt;-->
  <!--&lt;!&ndash;<div v-else-if="value1.name=='cursor'" :key="key1" class="k-board cursor">1</div>&ndash;&gt;-->
  <!--&lt;!&ndash;<div&ndash;&gt;-->
  <!--&lt;!&ndash;v-else-if="value1.name=='fraction'||value1.name=='sqrt2'||value1.name=='sqrt3'||value1.name=='aimsup'||value1.name=='aimsub'"&ndash;&gt;-->
  <!--&lt;!&ndash;:key="key1" v-bind:class="[value1.name,{'click':is_cursor(value1.value)==1}]"&ndash;&gt;-->
  <!--&lt;!&ndash;v-bind:style="{ width: value1.name=='fraction'?Math.max(3,value1.value.up.length*1.4,value1.value.down.length*1.4) + 'vh':'auto' }"&ndash;&gt;-->
  <!--&lt;!&ndash;v-on:click.stop="addcursor($event,num,key1,-1,-1)">&ndash;&gt;-->
  <!--&lt;!&ndash;<div class="enterdiv up" v-on:click.stop="addcursor($event,num,key1,-1,'up')">&ndash;&gt;-->
  <!--&lt;!&ndash;<div v-for="(value2,key2) in value1.value.up" :key="key2" dir="up" :class="value2.name"&ndash;&gt;-->
  <!--&lt;!&ndash;v-on:click.stop="addcursor($event,num,key1,key2,'up')">{{value2.value}}&ndash;&gt;-->
  <!--&lt;!&ndash;</div>&ndash;&gt;-->
  <!--&lt;!&ndash;</div>&ndash;&gt;-->
  <!--&lt;!&ndash;<div class="enterdiv down" v-on:click.stop="addcursor($event,num,key1,-1,'down')">&ndash;&gt;-->
  <!--&lt;!&ndash;<div v-for="(value2,key2) in value1.value.down" :key="key2" dir="down" :class="value2.name"&ndash;&gt;-->
  <!--&lt;!&ndash;v-on:click.stop="addcursor($event,num,key1,key2,'down')">{{value2.value}}&ndash;&gt;-->
  <!--&lt;!&ndash;</div>&ndash;&gt;-->
  <!--&lt;!&ndash;</div>&ndash;&gt;-->
  <!--&lt;!&ndash;</div>&ndash;&gt;-->
  <!--&lt;!&ndash;<div v-else :key="key1" :class="value1.name" v-on:click.stop="addcursor($event,num,key1,-1,-1)">&ndash;&gt;-->
  <!--&lt;!&ndash;{{value1.value}}&ndash;&gt;-->
  <!--&lt;!&ndash;</div>&ndash;&gt;-->

  <!--&lt;!&ndash;</template>&ndash;&gt;-->

  <!--</div>-->

</template>

<script>
  import Bus from './view/emitBus'
  import mathSymbol from './json/queryGid'


  export default {
    name: 'InputBox',
    // props: ["testdata", "rootdata", "inputarray", "is_correct", "num"],
    data() {
      return {
        maxlength: "",
        inputarray: [[]],
        symbolType: [], // 符号组id
        matchBoardType: "number", // 匹配的默认键盘
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
      console.log(this._uid);
      Bus.iptComps.push({
        id: this.id,
        component: this,
        _uid: this._uid,
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
          let {rightAnswers, subject, boardType, id} = this,
            gId = {};

          switch (subject.toString()) {
            /*学科为数学*/
            case '2': {
              /*若答案中含有数字，使用数字键盘*/
              boardType = 'number';
              if (rightAnswers.match(/\d/im)) {
                boardType = 'number';
              }
              /*
              *数字+符号键盘时
              *答案中含有非数字，优先判定为符号
              */
              if (boardType === 'number' && Number(rightAnswers) != rightAnswers) {
                let y = rightAnswers.match(/\w+/igm); // 截取英文组成的符号
                y.forEach((val) => {
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
                for (let i of rightAnswers) {
                  let m = mathSymbol[i];
                  /*获取普通符号的组id*/
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
              }

            }
              break;
          }

          Bus.selectedUid = this._uid;
          this.$addcursor(this, boardType, event, i, j, k, dir, {
            gId
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
    },
    computed: {
      cp_position() {
        let {width, height, top, left} = this.rects;
        return {
          // position: 'fixed',
          // width: width + 'px',
          // height: height + 'px',
          // top: top + 'px',
          // left: left + 'px',

        }
      },
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
  @import "./iminputdiv.scss";


</style>

