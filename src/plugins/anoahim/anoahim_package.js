import AnoahIMComponent from './AnoahBoard.vue'

const AnoahIM = {};

// 注册AnoahIM
AnoahIM.install = function (Vue) {
  // 生成一个Vue的子类
  // 同时这个子类也就是组件
  const AnoahIMConstructor = Vue.extend(AnoahIMComponent)
  // 生成一个该子类的实例
  const instance = new AnoahIMConstructor();

  // 将这个实例挂载在我创建的div上
  // 并将此div加入全局挂载点内部
  instance.$mount(document.createElement('div'))
  document.body.appendChild(instance.$el)

  // 通过Vue的原型注册一个方法
  // 让所有实例共享这个方法
  Vue.prototype.$anoahim = (vthis, type, getinputstr, inputdivblur, inputarray) => {

    instance.vthis = vthis;
    instance.type = type;
    instance.show = true;
    instance.getinputstr = getinputstr;
    instance.inputdivblur = inputdivblur;
    instance.inputarray = inputarray;
    //console.log(1111,inputarray)
  }
  //移除光标
  Vue.prototype.$closeanoahim = () => {
    instance.closeclick();
  }
  //增加光标
  Vue.prototype.$addcursor = (vthis,type,event,i,j,k,dir) => {
    instance.vthis = vthis;
    instance.vthis.rootdata.imshow = 1;
    instance.type = type;
    instance.show = true;
    instance.inputarray = vthis.inputarray;
    instance.addcursor(event,i,j,k,dir);
  }
}

export default AnoahIM
