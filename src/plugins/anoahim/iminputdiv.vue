<template>
  <div v-if="num==-1" class="iminputdiv" :xx="JSON.stringify(inputarray)" v-on:click.stop="addcursor($event,-1,-1,-1,-1)">
    <div v-for="(value,key) in inputarray" :key="key" class="row" v-on:click.stop="addcursor($event,key,-1,-1,-1)" v-bind:class="{'red':is_correct?is_correct[key]=='0':0,'green':is_correct?is_correct[key]=='1':0}">
      <template v-for="(value1,key1) in value">
        <div v-if="value1.name=='cursor'" :key="key1" class="cursor"></div>
        <div v-else-if="value1.name=='fraction'||value1.name=='sqrt2'||value1.name=='sqrt3'||value1.name=='aimsup'||value1.name=='aimsub'" :key="key1" v-bind:class="[value1.name,{'click':is_cursor(value1.value)==1}]" v-bind:style="{ width: value1.name=='fraction'?Math.max(3,value1.value.up.length*1.4,value1.value.down.length*1.4) + 'vh':'auto' }" v-on:click.stop="addcursor($event,key,key1,-1,-1)">
          <div class="enterdiv up" v-on:click.stop="addcursor($event,key,key1,-1,'up')">
            <div v-for="(value2,key2) in value1.value.up" :key="key2" dir="up" :class="value2.name" v-on:click.stop="addcursor($event,key,key1,key2,'up')">{{value2.value}}</div>
          </div>
          <div class="enterdiv down" v-on:click.stop="addcursor($event,key,key1,-1,'down')">
            <div v-for="(value2,key2) in value1.value.down" :key="key2" dir="down" :class="value2.name" v-on:click.stop="addcursor($event,key,key1,key2,'down')">{{value2.value}}</div>
          </div>
        </div>
        <div v-else :key="key1" v-bind:class="[value1.name,{'equal':value1.value=='='}]" v-on:click.stop="addcursor($event,key,key1,-1,-1)">{{value1.value}}</div>
      </template>
    </div>
  </div>
  <span v-else :key="num" class="iminputdiv qti_fill_input" v-bind:class="{'red':is_correct?is_correct[num]=='0':0,'green':is_correct?is_correct[num]=='1':0}" v-on:click.stop="addcursor($event,num,-1,-1,-1)">
    <template v-if="inputarray[num].length==0&&testdata.msubmitflag==1">?</template>
    <template v-else v-for="(value1,key1) in inputarray[num]">
      <template v-if="inputarray[num].length==1&&value1.name=='aime'&&value1.value==''&&testdata.msubmitflag==1">?</template>
      <div v-else-if="value1.name=='cursor'" :key="key1" class="cursor"></div>
      <div v-else-if="value1.name=='fraction'||value1.name=='sqrt2'||value1.name=='sqrt3'||value1.name=='aimsup'||value1.name=='aimsub'" :key="key1" v-bind:class="[value1.name,{'click':is_cursor(value1.value)==1}]"  v-bind:style="{ width: value1.name=='fraction'?Math.max(3,value1.value.up.length*1.4,value1.value.down.length*1.4) + 'vh':'auto' }" v-on:click.stop="addcursor($event,num,key1,-1,-1)">
        <div class="enterdiv up" v-on:click.stop="addcursor($event,num,key1,-1,'up')">
          <div v-for="(value2,key2) in value1.value.up" :key="key2" dir="up" :class="value2.name" v-on:click.stop="addcursor($event,num,key1,key2,'up')">{{value2.value}}</div>
        </div><div class="enterdiv down" v-on:click.stop="addcursor($event,num,key1,-1,'down')">
          <div v-for="(value2,key2) in value1.value.down" :key="key2" dir="down" :class="value2.name" v-on:click.stop="addcursor($event,num,key1,key2,'down')">{{value2.value}}</div>
        </div>
      </div>
      <div v-else :key="key1" :class="value1.name" v-on:click.stop="addcursor($event,num,key1,-1,-1)">{{value1.value}}</div>
    </template>
  </span>
</template>

<script>
export default {
  name: "Iminputdiv",
  props: ["testdata", "rootdata", "inputarray", "is_correct", "num"],
  data() {
    return {
      maxlength: ""
    };
  },
  created: function() {
    console.log(1111111111111,"iminputdiv created")
    //console.log(111, this.num, this.inputarray);
    //console.log("qtidraft created");'
    if (this.testdata.mtype == 38) {
      this.maxlength = new Array();
      for (let i = 0; i < this.testdata.manswer.length; i++) {
        this.maxlength[i] = this.testdata.manswer[i][0].length;
      }
    } else {
      this.maxlength = "";
    }
  },
  mounted: function() {
    //console.log("qtidraft mounted");
  },
  methods: {
    //点击添加光标
    addcursor: function(event, i, j, k, dir) {
      if (this.testdata.msubmitflag == 0) {
        if (this.testdata.mtype == 33) {
          this.$addcursor(this, 2, event, i, j, k, dir);
        } else if (this.testdata.mtype == 38) {
          if(this.rootdata.bookflag==1&&this.is_correct[i]==1){
            return;
          }
          this.$addcursor(this, 3, event, i, j, k, dir);
        } else {
          this.$addcursor(this, 0, event, i, j, k, dir);
        }
      }
    },
    //光标是否在公式里
    is_cursor: function(value) {
      let flag = value.up.findIndex((value, index, arr) => {
        return value.name == "cursor";
      });
      if (flag == -1) {
        flag = value.down.findIndex((value, index, arr) => {
          return value.name == "cursor";
        });
      }
      return flag != -1 ? 1 : 0;
    }
  },
  updated: function() {

  }
};
</script>
<style lang='scss' scoped>
@import "./iminputdiv.scss";
</style>