<template>
  <div>
    <ul class="nav clear-fix">
      <li
        class="nav-list fl"
        v-for="(li, idx) in lis"
        :key="idx"
        @click="select = idx">{{li.name}}
      </li>
    </ul>
    <!---->
    <ul>
      <li
        v-for="(li, i) in lis"
        :key="i"
        class="item"
        v-show="select === i">
        <label>{{li.name}}</label>
        <input-box
          v-for="(ipt, idx) in li.value"
          :key="idx"
          @after-change="afterChange"
          @before-next="beforeNext"
          :custom="true"
          v-model="ipt.value"
          :next-id="idx + 1"
          :id="idx"
          :boardType="li.type"></input-box>
      </li>
    </ul>
    <!--<span>input输入框的值：{{text}}</span>-->
    <!--<button @click="replaceBroad" v-show="toggle">替换成自定义键盘</button>-->

    <!--<iminputdiv-->
    <!--:prev="{el: $el}"-->
    <!--:custom="true"-->
    <!--class="direct"-->
    <!--:next-id="1"-->
    <!--boardType="chinese"-->
    <!--id="a"></iminputdiv>-->
  </div>
</template>

<script>
  /******************/
  /******************/
  //region    //import


  //endregion

  /******************/
  /******************/
  //region    //initialize


  //endregion

  /******************/
  /******************/
  //region    //export

  export default {
    data() {
      return {
        lis: [
          {
            type: 'vertical',
            value: [
              {
                value: '',
              },
              {
                value: '',
              },
              {
                value: '',
              },
              {
                value: '',
              },
              {
                value: '',
              },
              {
                value: '',
              },
            ],
            name: '竖式计算',
          },
          {
            type: 'takeOff',
            value: [
              {
                value: '',
              },
              {
                value: '',
              },
              {
                value: '',
              },
            ],
            name: '脱式计算',
          },
          {
            type: 'number',
            value: [
              {
                value: '',
              },
              {
                value: '',
              },
              {
                value: '',
              },
            ],
            name: '数字键盘',
          },

          // {
          //   type: 'number',
          //   value: '',
          //   name: '数字',
          // },
          // {
          //   type: 'vertical',
          //   value: 7,
          //   name: '竖式',
          // },
          // {
          //   type: 'letters',
          //   value: '56/12',
          //   name: '英文',
          // },
        ],
        select: 0,
        num: -1,
        toggle: true,
        text: '',
      }
    },
    mounted,
    methods: {
      replaceBroad() {
        this.$_replace();
        this.toggle = false;
      },
      afterChange(toNext, {value}) {
        if (this.select === 0 && value.length > 1) {
          this.lis[0].value.some((item, idx) => {
            let res = item.value === '';
            res && toNext(idx);
            return res
          }) || toNext();
        }
      },
      beforeNext(toNext, {currentId}) {
        if (this.select === 0 && currentId === this.lis[0].value.length - 1) {
          this.lis[0].value.some((item, idx) => {
            let res = item.value === '';
            res && toNext(idx);
            return res
          }) || toNext();
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
    this.replaceBroad()
  }

  //endregion

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">

  .direct.iminputdiv {
    width: 50px;
  }

  .item {
    border-bottom: 1px solid #8a8;
    margin-bottom: 15px;
    padding: 10px 0;
  }

  .nav {
    padding: 0;
  }

  .nav-list {
    list-style: none;
    padding: 4px 8px;
    border-radius: 4px;
    background: #4effbe;
    & + .nav-list {
      margin-left: 10px;
    }
  }

  .custom {
    margin: 40px 0;
  }
</style>
