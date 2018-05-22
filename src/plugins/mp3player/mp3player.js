import Mp3playerComponent from './Mp3player.vue'

const Mp3player = {};

// 注册Toast
Mp3player.install = function (Vue) {
  // 生成一个Vue的子类
  // 同时这个子类也就是组件
  const Mp3playerConstructor = Vue.extend(Mp3playerComponent)
  // 生成一个该子类的实例
  const instance = new Mp3playerConstructor();

  // 将这个实例挂载在我创建的div上
  // 并将此div加入全局挂载点内部
  instance.$mount(document.createElement('div'))
  document.body.appendChild(instance.$el)
/*
  instance.$el.onloadeddata = this.playerready;
  instance.$el.onended = this.playerended;
  instance.$el.onerror = this.playererror;
*/
  // 通过Vue的原型注册一个方法
  // 让所有实例共享这个方法 
  Vue.prototype.$mp3player = (url, target) => {
    //console.log(2222222,target)
    instance.playclick(url, target);
  }

  Vue.prototype.$mp3playerpause = () => {
    console.log('1111','mp3playerpause')
    if (instance.playerstatus == 2) {
      instance.audioele.pause();
      instance.playerstatus = 3;
      instance.mp3divele.className = instance.pauseclass;
    }
  }
}

export default Mp3player
