<template>
  <transition name="fade">
    <div class="tcplayerdiv" v-show="show">
      <span class="tcplayerclosediv" v-on:click="closediv"></span>
      <iframe v-if="url" class="iframe" :src="url"></iframe>
    </div>
  </transition>
</template>

<script>
export default {
  data() {
    return {
      show: false,
      htmlstr: "",
      url: ""
    };
  },
  methods: {
    closediv() {
      console.log(11111);
      this.url = "";
      this.show = false;
    }
  }
};
</script>

<style lang="scss" scoped>
.tcplayerdiv {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  text-align: center;
  z-index: 999;
  background: #5d5d5d;
  color: #f00;
  font-size: 3vh;
  padding: 0;
  iframe {
    top: 0px;
    right: 0px;
    z-index: 1;
    position: absolute;
    width: 100%;
    height: 100%;
    border: 0;
    padding: 0;
    margin: 0;
  }
  span {
    &.tcplayerclosediv {
      opacity: 1;
      background: transparent;
      color: #ffffff;
      border-radius: 12px;
      line-height: 0vh;
      text-align: center;
      height: 0vh;
      width: 0vh;
      font-size: 0vh;
      padding: 1px;
      top: 0px;
      left: 0px;
      z-index: 2;
      position: absolute;
      &::before {
        content: "\2716";
      }
    }
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter {
  opacity: 0;
}
.fade-leave-to {
  opacity: 0;
}
</style>