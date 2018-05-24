<template>
  <transition name='fade'>
    <div class='anoahimdiv'
         v-bind:class='{"phone":vthis&&vthis.rootdata.screenflag==2,"pad":vthis&&vthis.rootdata.screenflag==1&&vthis.rootdata.bookflag==0,"book_pad":vthis&&vthis.rootdata.screenflag==1&&vthis.rootdata.bookflag==1}'
         v-show='show'>

      <div class='aimtooldiv'>
        <div v-if='type==0' class='aimresultdiv'>
          <div class='pinyin'>{{pinyinstr}}</div>
          <div class='result'>
            <ol>
              <li v-if='key<10' v-for='(value,key) in hanziarray' :key='key' :data-idx='(key+1)'
                  v-on:click.stop.stop='choicehz(value)'>{{value}}
              </li>
            </ol>
          </div>
        </div>
        <div class='aimclosediv' v-on:click.stop='closeclick'>关闭</div>
      </div>

      <keep-alive>
        <component
          :is="cp_board.compName"
          :keys-text="cp_board.data"
          @btn-click="btnClick"
          class="k-btn-wrap"
          :class="cp_board.class"></component>
      </keep-alive>

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
  import comp from './view'
  import keysText from './json/keystext'

  export default {
    data() {
      return {
        vthis: "", //组件对象this
        show: true,
        keypadjson: [],
        type: 0,
        i: 0,
        enterflag: 0, // 换行和下一空标记
        maxlength: "",
        closeimfun: function () {
        },
        inputarray: "",
        pinyinflag: 1, // 拼音输入标记
        capflag: 0, // 大小写标记
        numflag: 0, // 通用键盘的数字标记
        hanziarray: [], // 候选汉字的汉字
        pinyinstr: "", // 候选拼音
        pyinputjson: {} //拼音字库
      };
    },
    created: function () {
      let self = this;
      this.pyinputjson = require("./pyinput.json");
      this.keypadjson = require("./keypad.json");
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
      btnClick(e, data) {

        this.getinputstr(data.text)

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
        return this.pyinputjson[pinyin] ? this.pyinputjson[pinyin].split("") : "";
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
      addcursor: function (event, i, j, k, dir) {
        // console.log(i, j, k, dir, event);
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
              console.log("单个元素点击");
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
        //滚动条
        this.changemainscroll(event == null ? null : event.target);
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
      //修改滚动条
      changemainscroll: function (target) {
        //console.log(333333,target);
        let qtimain = this.vthis.rootdata.qtimaindiv;
        if (this.vthis.rootdata.imshow == 1 && qtimain) {
          this.vthis.$nextTick(() => {
            //target没传递的时候取光标元素
            if (target == undefined || target == null) {
              if (this.type == 1) {
                target = this.vthis.$el.querySelector("div.numberbox.click");
              } else {
                target = this.vthis.$el.querySelector("div.cursor");
                console.log(44444, target);
                if (this.enterflag == 1) {
                  console.log(this.i, this.vthis.$el.parentElement);
                  target = this.vthis.$el.parentElement.querySelectorAll(
                    ".qti_fill_input"
                  )[this.i];
                  console.log(55555, target);
                }
                //console.log(444,target)
              }
            }
            /*
            console.log(
              'target top+Height',
              target.offsetTop + target.offsetHeight
            );

            console.log(
              'qtimain scrollTop+height',
              qtimain.scrollTop + qtimain.offsetHeight
            );
            console.log('qtimain scrollHeight', qtimain.scrollHeight);
            console.log('blank Height', parseInt(qtimain.offsetHeight * 0.45));
  */
            //绝对定位坐标需要加父元素offsettop
            let parenttop = 0;
            //console.log(1111,target)
            if (target.style.top != "") {
              parenttop = target.parentElement.offsetTop;
            }
            //console.log(22222)
            //console.log('parenttop', parenttop, qtimain.scrollTop);
            //光标位置被键盘遮挡滚动条往下滚
            if (
              target.offsetTop + target.offsetHeight + parenttop >=
              qtimain.offsetHeight + qtimain.scrollTop
            ) {
              qtimain.scrollTop =
                target.offsetTop +
                target.offsetHeight +
                parenttop -
                qtimain.offsetHeight;
            } else {
              //光标位在上面被遮挡滚动条往上滚
              if (qtimain.scrollTop > target.offsetTop) {
                qtimain.scrollTop = qtimain.scrollTop - target.offsetHeight;
              }
            }
          });
        }
      },
      //关闭按钮
      closeclick: function (event) {
        console.log("closeclick", this.vthis);
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
        console.log("insertstr", index, array[index].name);

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
        for (let i = 0; i < this.inputarray.length; i++) {
          //console.log(22222, this.inputarray[i]);
          //console.log(this.findstrindex(this.inputarray[i],'cursor'));
          for (let j = 0; j < this.inputarray[i].length; j++) {
            if (this.inputarray[i][j].name == "cursor") {
              //光标位置插入字符
              if (
                str == "fraction" ||
                str == "sqrt2" ||
                str == "sqrt3" ||
                str == "aimsup" ||
                str == "aimsub"
              ) {
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
            } else if (
              this.inputarray[i][j].name == "fraction" ||
              this.inputarray[i][j].name == "aimsup" ||
              this.inputarray[i][j].name == "aimsub" ||
              this.inputarray[i][j].name == "sqrt2" ||
              this.inputarray[i][j].name == "sqrt3"
            ) {
              let flag = this.findfraccurinsert(
                this.inputarray[i][j].name,
                str,
                this.inputarray[i][j].value.up,
                this.inputarray[i][j].value.down
              );
              if (flag == 0) {
                this.findfraccurinsert(
                  this.inputarray[i][j].name,
                  str,
                  this.inputarray[i][j].value.down,
                  this.inputarray[i][j].value.up
                );
              }
            }
          }
        }
      }
    },
    updated: function () {
      //console.log(this);
      console.log("anoahim updated");
    },
    watch: {
      'inputarray'(val, old) {
        val === old || this.removecursor(old);
      },
    },
    mounted() {
    },
    computed: {
      cp_board() {
        return Object.assign({
          compName: 'BoardModul',
        }, keysText.letters)
      },
    },
  }
</script>

<style lang='scss' scoped>
  @import "./anoahim.scss";

  .k-btn-wrap {
    padding: 10px;
    height: 85%;
    background: #f5f7f8;
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
    }
    ul, li {
      list-style: none;
      padding: 0;
      margin: 0;
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
      &.k-btn-3 {
        width: calc((100% - #{$interval} * 2) / 3);
      }
      &.k-btn-4 {
        width: calc((100% - #{$interval} * 3) / 4);
      }
      &.k-btn-5 {
        width: calc((100% - #{$interval} * 4) / 5);
      }
    }

    .k-symbol, .k-space {
      background: #e8ebee;
      box-shadow: $symbol-shadow;
    }

    .k-delete {
      height: 50%;
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
        &.k-btn-3 {
          width: calc((100% - #{$interval} * 2) / 3);
        }
        &.k-btn-4 {
          width: calc((100% - #{$interval} * 3) / 4);
        }
        &.k-btn-5 {
          width: calc((100% - #{$interval} * 4) / 5);
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

</style>
