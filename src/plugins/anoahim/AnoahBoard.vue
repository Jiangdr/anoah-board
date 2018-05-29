<template>
  <transition name='fade'>
    <div
      class='anoahimdiv'
      v-bind:class='{"phone":vthis&&vthis.rootdata.screenflag==2,"pad":vthis&&vthis.rootdata.screenflag==1&&vthis.rootdata.bookflag==0,"book_pad":vthis&&vthis.rootdata.screenflag==1&&vthis.rootdata.bookflag==1}'
      v-show='show'>

      <div class='aimtooldiv clear-fix'>
        <p class='k-candidate' v-show="pinyinstr">{{pinyinstr}}</p>
        <div class="hiddth-scroll fl">
          <div class='aimresultdiv'>
            <ul
              class='result clear-fix'
              :style="cp_result">
              <li
                class="fl result-li"
                v-for='(value,key) in cp_candidate'
                :key='key'
                :data-idx='(key+1)'
                :style="cp_result_li"
                @click.stop.stop='choicehz(value)'>{{value}}
              </li>
            </ul>
          </div>
        </div>
        <div class='aimclosediv fr' v-on:click.stop='closeclick'>关闭</div>
      </div>

      <component
        :is="cp_board.compName"
        :board-data="cp_board"
        @btn-click="btnClick"></component>

      <!--<div-->
      <!--v-for='(value,key) in (numflag == 1 && type == 0) ? keypadjson[type].numsrc : keypadjson[type].src'-->
      <!--:key='key'-->
      <!--class='aimbnrowdiv'>-->
      <!--<div-->
      <!--v-for='(value1,key1) in value'-->
      <!--:key='key1' class='signnumdiv'-->
      <!--v-bind:class='[value1.class]'-->
      <!--v-on:click.stop='bnclick($event, (capflag == 1 && type == 0 && value1.value.length == 1) ? value1.value.toUpperCase() : value1.value)'>-->
      <!--{{(capflag==1&&type==0&&value1.value.length==1) ? value1.value.toUpperCase() : value1.value}}-->
      <!--</div>-->
      <!--</div>-->
    </div>

  </transition>
</template>

<script>
  import * as comp from './view'
  import keysTextJson from './json/keystext.json'
  import querySymbol from './json/querySymbol.json'
  import pyinput from "./pyinput.json"
  import Bus from './view/emitBus'


  export default {
    data() {
      return {
        vthis: "", //组件对象this
        show: false,
        keypadjson: [],
        type: 0,
        i: 0,
        enterflag: 0, // 换行和下一空标记
        maxlength: "",
        closeimfun: function () {
        },
        inputarray: [],
        pinyinflag: 1, // 拼音输入标记
        capflag: 0, // 大小写标记
        numflag: 0, // 通用键盘的数字标记
        hanziarray: [], // 候选汉字的汉字
        pyinputjson: {}, //拼音字库


        isUpper: false, // 英文字符是否大写
        boardType: 'number', // 键盘类型
        symbolType: 'math', // 符号类型
        nextId: '', // 下一个跳转ID
        gId: {}, // 匹配的符号组id
        candidate: '', // 候选的汉字
        pinyinstr: '', // 候选拼音
        boardModel: 'text', // 候选拼音
      };
    },
    created: function () {
      console.time('start')
      let self = this;
      // this.pyinputjson = require("./pyinput.json");
      // this.keypadjson = require("./keypad.json");
      window.addEventListener('click', function (e) {
        self.show && (e.path.includes(self.$el) || self.closeclick());
      }, false);
      // console.log('created');
    },
    components: {...comp},
    methods: {
      //拼音输入选中汉字
      choicehz: function (hz) {
        this.getinputstr(hz);
        this.pinyinstr = "";
        this.hanziarray = [];
      },
      /*点击键盘*/
      btnClick(e, {expect, text, type}) {
        let {boardType, isUpper} = this;
        /*点击下一空*/
        if (expect === 'next') {
          if (!Bus.toNext(this.nextId, this.vthis.id)) { // 没有下一个输入框
            this.show = false;
            this.removecursor();
          }
          return;
        }
        /*点击切换符号键盘*/
        if (expect === 'showSymbol') {
          this.boardModel = 'symbol';
          return;
        } else if (expect === 'goback') {
          this.boardModel = 'text';
          return;
        }
        /*中文模式*/
        if (boardType === 'chinese') {
          if (expect === 'delete') {
            if (this.pinyinstr !== '') {
              this.pinyinstr = this.pinyinstr.slice(0, this.pinyinstr.length - 1);
            } else {
              this.getinputstr('delete');
            }
          } else if (expect === 'caseSwitch') {

          } else {
            this.pinyinstr += text;
          }
          return
        } else if (boardType = 'letters' && isUpper && type === 'default') {
          text = text.toUpperCase();
        }
        /*特殊按键*/
        if (expect === 'caseSwitch') {
          this.isUpper = !this.isUpper;
          return
        } else if (['delete', 'fraction'].includes(expect)) {
          text = expect;
        }

        this.getinputstr(text);

      },
      //选中事件
      bnclick: function (event, keystr) {

        if (this.type == 0) {
          let key = keystr;
          if (key == "中/英") {
            if (this.pinyinflag == 1) {
              this.pinyinflag = 0;
            } else {
              this.pinyinflag = 1;
            }
            return;
          } else if (key == "A/a") {
            if (this.capflag == 1) {
              this.capflag = 0;
            } else {
              this.capflag = 1;
            }
            return;
          } else if (key == "123") {
            if (this.numflag == 1) {
              this.numflag = 0;
            } else {
              this.numflag = 1;
            }
            return;
          }
          if (this.pinyinflag == 1) {
            if (key >= "a" && key <= "z" && key.length == 1) {
              if (key == "v") {
                key = "ü";
              }
              this.pinyinstr = this.pinyinstr + key;
              this.hanziarray = this.getSingleHanzi(this.pinyinstr);
              return;
            }
            if (key == "delete" && this.pinyinstr.length > 0) {
              this.pinyinstr = this.pinyinstr.substring(
                0,
                this.pinyinstr.length - 1
              );
              this.hanziarray = this.getSingleHanzi(this.pinyinstr);
              return;
            }
          }
        }
        this.getinputstr(keystr);

        //this.getinputstr(event.currentTarget.innerHTML);
      },
      //单个拼音转单个汉字，例如输入 'a' 返回 '阿啊呵腌嗄吖锕'
      getSingleHanzi: function (pinyin) {
        return
      },
      //查找光标
      findcursor: function () {
        let pos = {i: -1, j: -1, k: -1, dir: -1};
        for (let i = 0; i < this.inputarray.length; i++) {
          for (let j = 0; j < this.inputarray[i].length; j++) {
            if (this.inputarray[i][j].name == "cursor") {
              return {i: i, j: j, k: -1, dir: -1};
            } else {
              //查找公式里的光标
              if (
                this.inputarray[i][j].name == "fraction" ||
                this.inputarray[i][j].name == "sqrt2" ||
                this.inputarray[i][j].name == "sqrt3" ||
                this.inputarray[i][j].name == "aimsup" ||
                this.inputarray[i][j].name == "aimsub"
              ) {
                let k = this.inputarray[i][j].value.up.findIndex(
                  (value, index, arr) => {
                    return value.name == "cursor";
                  }
                );
                if (k >= 0) {
                  return {i: i, j: j, k: k, dir: "up"};
                } else {
                  let k = this.inputarray[i][j].value.down.findIndex(
                    (value, index, arr) => {
                      return value.name == "cursor";
                    }
                  );
                  if (k >= 0) {
                    return {i: i, j: j, k: k, dir: "down"};
                  }
                }
              }
            }
          }
        }
        return {i: -1, j: -1, k: -1, dir: -1};
      },
      //添加光标
      addcursor: function (event, i, j, k, dir, {nextId, gId}) {
        this.nextId = nextId;
        this.gId = gId;
        let pos = this.findcursor();
        //删除光标
        if (pos.i >= 0 && pos.j >= 0) {
          if (pos.k == -1) {
            this.inputarray[pos.i].splice(pos.j, 1);
          } else {
            this.inputarray[pos.i][pos.j].value[pos.dir].splice(pos.k, 1);
          }
        }
        if (i == -1) {
          //输入框点击
          this.inputarray[this.inputarray.length - 1].push({
            name: "cursor"
          });
        } else {
          if (j == -1) {
            //单行点击
            console.log("单行点击");
            this.inputarray[i].push({
              name: "cursor"
            });
          } else {
            if (dir == -1) {
              //单个元素点击
              let aime = event.target;
              if (pos.i == i && pos.j < j) {
                j--;
              }
              if (event.offsetX < aime.offsetWidth / 2) {
                this.inputarray[i].splice(j, 0, {name: "cursor"});
              } else {
                this.inputarray[i].splice(j + 1, 0, {name: "cursor"});
              }
            } else {
              if (k == -1) {
                //公式内行点击
                if (pos.i == i && pos.j < j) {
                  j--;
                }
                this.inputarray[i][j].value[dir].push({name: "cursor"});
              } else {
                //公式内单个元素点击
                let aime = event.target;

                if (pos.i == i && pos.j == j && pos.dir == dir && pos.k < k) {
                  k--;
                }
                if (event.offsetX < aime.offsetWidth / 2) {
                  this.inputarray[i][j].value[dir].splice(k, 0, {
                    name: "cursor"
                  });
                } else {
                  this.inputarray[i][j].value[dir].splice(k + 1, 0, {
                    name: "cursor"
                  });
                }
              }
            }
          }
        }
      },
      //删除公式数组里的光标等位置
      deletefraccur: function (frac) {
        let k = frac.findIndex((value, index, arr) => {
          return value.name == "cursor";
        });
        if (k >= 0) {
          //删除光标
          frac.splice(k, 1);
        }
        return 0;
      },
      //删除光标
      removecursor: function (inputarray = this.inputarray) {
        this.isUpper = false;
        this.pinyinstr = '';
        for (let i = 0; i < inputarray.length; i++) {
          for (let j = 0; j < inputarray[i].length; j++) {
            if (inputarray[i][j].name == "cursor") {
              //删除光标
              inputarray[i].splice(j, 1);
              return;
            } else {
              //删除公式里的光标
              if (
                inputarray[i][j].name == "fraction" ||
                inputarray[i][j].name == "sqrt2" ||
                inputarray[i][j].name == "sqrt3" ||
                inputarray[i][j].name == "aimsup" ||
                inputarray[i][j].name == "aimsub"
              ) {
                this.deletefraccur(inputarray[i][j].value.up);
                this.deletefraccur(inputarray[i][j].value.down);
              }
            }
          }
        }
      },
      //关闭按钮
      closeclick: function (event) {
        this.show = false;
        this.vthis.rootdata.imshow = 0;
        this.removecursor();

        this.pinyinstr = "";
        this.hanziarray = [];

        this.vthis.$nextTick(() => {
          let qtimain = this.vthis.rootdata.qtimaindiv;
          //关闭输入法时滚动条在最底部就回滚一个像素
          if (qtimain && qtimain.scrollTop + qtimain.offsetHeight >= qtimain.scrollHeight) {
            qtimain.scrollTop = qtimain.scrollTop - 1;
          }
        });
      },
      //判定是否是运算符号
      is_calcsign: function (str) {
        if (str == "+" || str == "-" || str == "×" || str == "÷") {
          return true;
        }
        return false;
      },
      //插入字符和判断
      insertstr: function (array, index, str) {
        let length = array.length;
        //脱式计算需要判断输入
        if (this.type == 2) {
          //检查前一个元素
          //小数点前必须是数字
          if (str == "." && index == 0) {
            this.$toast("小数点前必须是数字");
            return;
          }
          if (index > 0) {
            if (str == "." && isNaN(array[index - 1].value)) {
              this.$toast("小数点前必须是数字");
              return;
            }
            if (array[index - 1].name == "fraction" && !isNaN(str)) {
              this.$toast("数字前不能是分数");
              return;
            }
            if (
              this.is_calcsign(array[index - 1].value) &&
              this.is_calcsign(str)
            ) {
              this.$toast("运算符号前不能是运算符号");
              return;
            }
          }
          if (index + 1 < length) {
            if (array[index + 1].value == "." && isNaN(str)) {
              this.$toast("小数点后必须是数字");
              return;
            }
            if (
              this.is_calcsign(array[index + 1].value) &&
              this.is_calcsign(str)
            ) {
              this.$toast("运算符号前不能是运算符号");
              return;
            }
          }
        }

        //console.log("this.i", this.i, "length", this.inputarray[this.i].length,"maxlength",this.maxlength);
        if (this.maxlength) {
          if (this.inputarray[this.i].length > this.maxlength[this.i]) {
            this.$toast("超过输入长度限制");
            return;
          }
        }
        array.splice(index, 0, {name: "aime", value: str});
      },
      //查找公式数组里的光标的位置并插入字符
      findfraccurinsert: function (name, str, frac_ele, other_ele) {
        let k = frac_ele.findIndex((value, index, arr) => {
          return value.name == "cursor";
        });
        if (k >= 0) {
          if (
            str == "fraction" ||
            str == "sqrt2" ||
            str == "sqrt3" ||
            str == "aimsup" ||
            str == "aimsub"
          ) {
            if (str == name && str != "sqrt2" && str != "sqrt3") {
              frac_ele.splice(k, 1);
              other_ele.push({name: "cursor"});
              return 1;
            } else {
              this.$toast("公式里不能插入公式");
              return 1;
            }
          } else if (str == "delete") {
            if (k > 0) {
              frac_ele.splice(k - 1, 1);
            }
          } else if (str == "enter") {
            //换行标记
            if (this.enterflag == 0) {
              this.$toast("公式里不能换行");
              return 1;
            } else {
              if (this.i + 1 < this.inputarray.length) {
                this.i++;
                this.addcursor(null, this.i, -1, -1, -1);
              }
            }
          } else {
            if (str == "=") {
              this.$toast("公式里不允许插入=符号");
              return 1;
            }

            if (frac_ele.length >= 9) {
              this.$toast("公式里最多8位");
              return 1;
            }
            this.insertstr(frac_ele, k, str);
          }
        }
        return 0;
      },
      //从输入法得到输入的字符
      getinputstr: function (str) {
        let l = this.inputarray.length,
          j_l = null,
          name = null,
          temp = null,
          i = 0,
          j = 0,
          poolArr = ["fraction", "sqrt2", "sqrt3", "aimsup", "aimsub"];

        for (; i < l; i++) {
          j_l = this.inputarray[i].length;
          for (; j < j_l; j++) {
            temp = this.inputarray[i][j];
            name = temp.name;

            if (name == "cursor") {
              //光标位置插入字符
              if (poolArr.includes(str)) {
                if (j > 0 && this.inputarray[i][j - 1].name == "fraction") {
                  if (str == "fraction") this.$toast("分数前不能是分数");
                  else this.$toast("公式前不能是分数");
                  return;
                }
                if (
                  j + 1 < this.inputarray[i].length &&
                  this.inputarray[i][j + 1].name == "fraction"
                ) {
                  if (str == "fraction") this.$toast("分数后不能是分数");
                  else this.$toast("公式后不能是分数");
                  return;
                }
                if (this.maxlength) {
                  if (this.inputarray[this.i].length > this.maxlength[this.i]) {
                    this.$toast("超过输入长度限制");
                    return;
                  }
                }
                //光标位置替换成公式
                if (str == "aimsup" || str == "aimsub") {
                  this.inputarray[i].splice(j, 1, {
                    name: str,
                    value: {up: [{name: "cursor"}], down: []}
                  });
                } else {
                  this.inputarray[i].splice(j, 1, {
                    name: str,
                    value: {up: [], down: [{name: "cursor"}]}
                  });
                }
              } else if (str == "delete") {
                if (j == 0) {
                  if (i > 0) {
                    //先将这一行的元素移动到上一行
                    let length = this.inputarray[i].length - j;
                    for (let k = 0; k < length; k++) {
                      this.inputarray[i - 1].push(this.inputarray[i].shift());
                    }
                    //再删除这一行
                    this.inputarray.splice(i, 1);

                    //换行的时候重新计算滚动条高度

                    this.changemainscroll();
                  }
                } else {
                  if (this.type == 1) {
                    this.inputarray.splice(i, 1, [
                      {name: "aime", value: ""},
                      {name: "cursor"}
                    ]);
                  } else {
                    this.inputarray[i].splice(j - 1, 1);
                  }
                }
              } else if (str == "enter") {
                //换行标记
                if (this.enterflag == 0) {
                  //只有光标的时候不允许换行
                  if (
                    this.inputarray[i].length == 1 &&
                    this.inputarray[i][j].name == "cursor"
                  ) {
                    this.$toast("空行不能换行!");
                    return;
                  }
                  //先增加一行
                  this.inputarray.splice(i + 1, 0, []);
                  //再将光标以后的元素挪到下一行
                  let length = this.inputarray[i].length - j;
                  for (let k = 0; k < length; k++) {
                    this.inputarray[i + 1].unshift(this.inputarray[i].pop());
                  }
                  //换行的时候重新计算滚动条高度
                  this.changemainscroll();
                } else {
                  if (this.vthis.rootdata.bookflag) {
                    for (let k = this.i + 1; k < this.inputarray.length; k++) {
                      if (this.vthis.is_correct[k] == -1) {
                        this.i = k;
                        this.addcursor(null, this.i, -1, -1, -1);
                        //换行的时候重新计算滚动条高度
                        this.changemainscroll();
                        break;
                      }
                    }
                  } else {
                    if (this.i + 1 < this.inputarray.length) {
                      this.i++;
                      this.addcursor(null, this.i, -1, -1, -1);
                      //换行的时候重新计算滚动条高度
                      this.changemainscroll();
                    }
                  }
                }
              } else if (str == "space") {
                this.insertstr(this.inputarray[i], j, " ");
                //this.inputarray[i].splice(j, 0, { name: 'aime', value: str });
              } else if (str == "next") {
                if (this.type == 1) {
                  let fisrti = -1;
                  //最后一空的时候检查前方是否有没有填的空
                  if (i + 1 == this.inputarray.length) {
                    for (let ii = 0; ii < i; ii++) {
                      if (this.inputarray[ii][0].value == "") {
                        fisrti = ii;
                        break;
                      }
                    }
                  } else {
                    fisrti = i + 1;
                  }

                  if (fisrti >= 0) {
                    this.addcursor(null, fisrti, -1, -1, -1);
                  }
                }
              } else {
                //判断是否是竖式题
                if (this.type == 1) {
                  this.inputarray.splice(i, 1, [
                    {name: "aime", value: str},
                    {name: "cursor"}
                  ]);
                  this.getinputstr("next");
                } else {
                  this.insertstr(this.inputarray[i], j, str);
                }
                //this.inputarray[i].splice(j, 0, { name: 'aime', value: str });
              }
              return;
            } else if (poolArr.includes(name)) {
              let flag = this.findfraccurinsert(
                name,
                str,
                temp.value.up,
                temp.value.down
              );
              if (flag == 0) {
                this.findfraccurinsert(
                  name,
                  str,
                  temp.value.down,
                  temp.value.up
                );
              }
            }
          }
        }
      },
      /*调整界面到合适位置*/
      moveSight(e) {
        this.$nextTick(() => {
          let app = document.getElementById('app'),
            {$el} = this,
            $el_rect = $el.getBoundingClientRect();

          if (this.show) {
            let cursor = document.getElementsByClassName('k-board cursor')[0];
            if (!cursor) return;
            let cur_rect = cursor.getBoundingClientRect(),
              differ = $el_rect.top - cur_rect.bottom,
              appTop = document.documentElement.scrollTop || document.body.scrollTop || window.pageYOffset,
              endTop = appTop;
            setCss.call(app, {
              marginBottom: $el_rect.height + 'px',
            });

            if (differ < 0) { // 光标低于键盘时
              endTop = appTop - differ + 15;
            } else if (cur_rect.top < 0) { // 光标高于屏幕
              endTop = appTop + cur_rect.top - 20;
            }

            scrollTo((endTop - appTop) / 200 * 16, appTop, endTop)
          } else {
            setCss.call(app, {
              marginBottom: '0px',
            });
          }
        });
      },

    },
    watch: {
      /*监听输入值变化*/
      'inputarray'(val, old) {
        val === old || this.removecursor(old);

        this.moveSight();
      },
      /*监听关闭键盘，恢复app位置*/
      show(val) {
        val || setCss.call(document.getElementById('app'), {
          top: this.appTop = 0,
        });
      },

    },
    mounted() {
    },
    computed: {
      cp_board() {
        let {boardType, gId} = this,
          keysText = keysTextJson[boardType].data,
          matchSymbol = {
            required: {},
            group: {},
          };
        /*数字键盘时，重置符号*/
        if (boardType === 'number') {
          Object.entries(gId).forEach(([k, val]) => {
            let g = querySymbol[k] || {};
            /*必备的符号*/
            Object.assign(matchSymbol.required, val);
            /*匹配的符号组*/
            Object.assign(matchSymbol.group, g);
          });
        }


        return {
          compName: keysTextJson[boardType].model,
          keysText,
          matchSymbol,
        }
      },
      cp_candidate() {
        return (pyinput[this.pinyinstr] || "")
      },
      cp_result() {
        return {
          width: 10 * this.cp_candidate.length + '%'
        }
      },
      cp_result_li() {
        return {
          width: 100 / this.cp_candidate.length + '%'
        }
      },
    },
  }

  function setCss(obj) {
    Object.entries(obj).forEach(([k, val]) => {
      this.style[k] = val;
    })
  }

  function scrollTo(step, appTop, endTop) {
    if (step !== 0) {
      let t = appTop + step;
      if ((step > 0 && t > endTop) || (step < 0 && t < endTop)) {
        t = endTop;
      } else {
        setTimeout(() => {
          scrollTo(step, t, endTop);
        }, 20);
      }
      document.body.scrollTop = t;
      document.documentElement.scrollTop = t;
    }
  }
</script>

<style lang='scss' scoped>
  /*@import "./anoahim.scss";*/

  .anoahimdiv {
    box-sizing: border-box;
    display: block;
    -webkit-user-select: none;
    user-select: none;
    width: 100%;
    height: 55%;
    min-height: 300px;
    position: fixed;
    z-index: 4000;
    bottom: 0px;
    right: 0px;
    font-size: 4vh;
    background: #fff;
    border: 1px solid #cccccc;
    text-align: center;
  }

  .k-btn-wrap {
    padding: 10px;
    height: 85%;
  }

  .aimtooldiv {
    position: relative;
    height: 15%;
    background: #efefef;
    .hiddth-scroll {
      height: 100%;
      overflow: hidden;
      width: calc(100% - 70px);
    }
    .aimresultdiv {
      height: calc(100% + 20px);
    }
    .aimclosediv {
      width: 70px;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .k-candidate {
      position: absolute;
      bottom: calc(100% + 1px);
      left: -1px;
      padding: 0 10px;
      height: 80%;
      background: #efefef;
    }
  }

  .aimresultdiv {
    overflow-x: auto;

    .result {
      padding: 0 10px;
      height: calc(100% - 20px);
      .result-li {
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }
  }
</style>

<style lang="scss">
  $interval: 20px; // 横向间隔
  $vertical: 9px; // 纵向间隔
  $trans: all .1s;
  $shadow: 0 1px 4px 2px rgba(150, 150, 150, 0.3); // 数字阴影
  $symbol-shadow: 0 1px 4px 2px rgba(40, 40, 40, 0.2); // 字符阴影

  .clear-fix {
    &:before, &:after {
      content: '';
      display: table;
    }
    &:after {
      clear: both;
    }
  }

  .fl {
    float: left;
  }

  .fr {
    float: right;
  }

  .anoahimdiv {
    * {
      box-sizing: border-box;
      padding: 0;
      margin: 0;
    }
    ul, li {
      list-style: none;
    }
  }

  .k-btn-wrap {
    font-size: 20px;
    .k-row {
      & + .k-row {
        margin-top: $vertical;
      }
      &.k-row-2 {
        height: calc((100% - #{$vertical} * 1) / 2);
      }
      &.k-row-3 {
        height: calc((100% - #{$vertical} * 2) / 3);
      }
      &.k-row-4 {
        height: calc((100% - #{$vertical} * 3) / 4);
      }
      &.k-row-5 {
        height: calc((100% - #{$vertical} * 4) / 5);
      }

    }

    .k-btn {
      border-radius: 6px;
      background: #fff;
      box-shadow: $shadow;
      height: 100%;
      -webkit-transform: $trans;
      -moz-transform: $trans;
      -ms-transform: $trans;
      -o-transform: $trans;
      transform: $trans;
      display: flex;
      align-items: center;
      justify-content: center;
      & + .k-btn {
        margin-left: $interval;
      }
      &:active {
        background: #13d098;
      }

      @for $i from 3 through 10 {
        &.k-btn-#{$i} {
          width: calc((100% - #{$interval} * #{$i - 1}) / #{$i});
        }
      }

    }

    .k-symbol, .k-space {
      background: #e8ebee;
      box-shadow: $symbol-shadow;
    }

    .k-delete {
      height: 50%;
    }

    .k-hidden {
      display: none;
    }

    .sym-pad {
      padding-left: $interval;
    }
  }

  .k-letters {
    .k-btn-6 {
      width: calc((100% - #{$interval} * 5) / 7);
    }
    .k-btn-6 + .k-space {
      width: calc((100% - #{$interval} * 5) / 3.5);
    }
    .k-btn-10, .k-btn-9 {
      width: calc((100% - #{$interval} * 9) / 10);
    }
    .k-btn-9:first-child {
      margin-left: calc((100% - #{$interval} * 9) / 20 + #{$interval} * .5);
    }
    .k-btn-9.k-symbol {
      width: calc((100% - #{$interval} * 9) / 10 + #{$interval});
    }
    .k-btn-9.k-symbol:first-child {
      margin-left: calc((100% - #{$interval} * 9) / 20 - #{$interval} * .5);
    }
  }

  /*手机端*/
  @media screen and (max-width: 600px) {
    $interval: 8px; // 横向间隔
    $vertical: 15px; // 纵向间隔

    .k-btn-wrap {
      font-size: 18px;
      .k-row {
        & + .k-row {
          margin-top: $vertical;
        }
        &.k-row-2 {
          height: calc((100% - #{$vertical} * 1) / 2);
        }
        &.k-row-3 {
          height: calc((100% - #{$vertical} * 2) / 3);
        }
        &.k-row-4 {
          height: calc((100% - #{$vertical} * 3) / 4);
        }
        &.k-row-5 {
          height: calc((100% - #{$vertical} * 4) / 5);
        }

      }

      .k-btn {
        border-radius: 6px;
        box-shadow: $shadow;
        & + .k-btn {
          margin-left: $interval;
        }
        @for $i from 3 through 10 {
          &.k-btn-#{$i} {
            width: calc((100% - #{$interval} * #{$i - 1}) / #{$i});
          }
        }
      }

      .sym-pad {
        padding-left: $interval;
      }
    }

    .k-letters {
      .k-btn-6 {
        width: calc((100% - #{$interval} * 5) / 7);
      }
      .k-btn-6 + .k-space {
        width: calc((100% - #{$interval} * 5) / 3.5);
      }
      .k-btn-10, .k-btn-9 {
        width: calc((100% - #{$interval} * 9) / 10);
      }
      .k-btn-9:first-child {
        margin-left: calc((100% - #{$interval} * 9) / 20 + #{$interval} * .5);
      }
      .k-btn-9.k-symbol {
        width: calc((100% - #{$interval} * 9) / 10 + #{$interval});
      }
      .k-btn-9.k-symbol:first-child {
        margin-left: calc((100% - #{$interval} * 9) / 20 - #{$interval} * .5);
      }
    }
  }

  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.3s;
  }

  .fade-enter {
    opacity: 0;
  }

  .fade-leave-to {
    opacity: 0;
  }
</style>
