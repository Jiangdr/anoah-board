<template>
  <transition name="fade">
    <div class="toastdiv" v-show="show">
      {{message}}
    </div>
  </transition>
</template>

<script>
export default {
  data() {
    return {
      show: false,
      message: ""
    };
  }
};
</script>

<style lang="scss" scoped>
.toastdiv {
  position: fixed;
  top: 50%;
  left: 50%;

  text-align: center;
  z-index: 9999;
  background: #5d5d5d;
  border-radius: 2px;
  box-shadow: 1px 2px 1px #d6d4ca;
  color: #ffffff;
  font-size: 3vh;
  padding: 1vh 2vh;
  transform: translateY(-50%) translateX(-50%);
  -webkit-transform: translateY(-50%) translateX(-50%);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity .5s;
}
.fade-enter {
  opacity: 0;
}
.fade-leave-to {
  opacity: 0;
}
</style>