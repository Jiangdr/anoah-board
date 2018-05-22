import TcplayerComponent from './tcplayer.vue'

const Tcplayer = {};

// 注册Toast
Tcplayer.install = function (Vue) {
  // 生成一个Vue的子类
  // 同时这个子类也就是组件
  const TcplayerConstructor = Vue.extend(TcplayerComponent)
  // 生成一个该子类的实例
  const instance = new TcplayerConstructor();

  // 将这个实例挂载在我创建的div上
  // 并将此div加入全局挂载点内部
  instance.$mount(document.createElement('div'))
  document.body.appendChild(instance.$el)

  // 通过Vue的原型注册一个方法
  // 让所有实例共享这个方法 
  Vue.prototype.$tcplayer = (url) => {
    instance.show = true;
    instance.url = './static/qqvideo.html?param='+encodeURIComponent(url);
  }
}

export default Tcplayer
