import AnoahIMComponent from './AnoahBoard.vue'

const AnoahIM = {};
import InputBox from "./InputBox.vue";

// 注册AnoahIM
AnoahIM.install = function (Vue) {
  Vue.component(InputBox.name, InputBox);
  // 生成一个Vue的子类
  // 同时这个子类也就是组件
  const AnoahIMConstructor = Vue.extend(AnoahIMComponent)
  // 生成一个该子类的实例
  const instance = new AnoahIMConstructor();

  // 将这个实例挂载在我创建的div上
  // 并将此div加入全局挂载点内部
  instance.$mount(document.createElement('div'))
  document.body.appendChild(instance.$el);


  // 通过Vue的原型注册一个方法
  // 让所有实例共享这个方法
  Vue.prototype.$anoahim = (vthis, type, getinputstr, inputdivblur, inputarray) => {

    instance.vthis = vthis;
    instance.type = type;
    instance.show = true;
    instance.getinputstr = getinputstr;
    instance.inputdivblur = inputdivblur;
    instance.inputarray = inputarray;

  }
  //移除光标
  Vue.prototype.$closeanoahim = () => {
    instance.closeclick();
  }
  //增加光标
  Vue.prototype.$addcursor = (vthis, type, event, i, j, k, dir, {symbols}) => {
    instance.vthis = vthis;
    instance.vthis.rootdata.imshow = 1;
    instance.type = type;
    instance.boardType = type;
    instance.show = true;
    instance.inputarray = vthis.inputarray;
    /**/
    if (vthis.testdata.mtype == 38) {
      instance.enterflag = 1;
      instance.i = i;
      instance.maxlength = vthis.maxlength;
    } else if (vthis.testdata.mtype == 4) {
      instance.enterflag = 1;
      instance.i = i;
      instance.maxlength = "";
    } else {
      instance.enterflag = 0;
      instance.maxlength = "";
    }
    instance.addcursor(event, i, j, k, dir, {nextId: vthis.nextId, symbols});
  };

  Object.defineProperties(Vue.prototype, {
    $_replace: {
      value() {
        Array.from(this.$el.querySelectorAll('input[type="text"]')).forEach((el, idx) => {
          let comp = Vue.extend(Iminputdiv),
            div = document.createElement('div'),
            {height, width} = el.getClientRects()[0],
            valType = el.dataset.valType,
            defaultStr = el.value,
            boardType = undefined;

          if (!Object.is(Number(defaultStr), NaN)) { // 竖式键盘
            boardType = 1;
          } else if (defaultStr.search(/\(|\)|{|}|\[|\]/igm) !== -1) { // 带符号键盘
            boardType = 2;
          } else if (1) {}

          el.style.display = 'none';
          div.style.display = 'inline-block';
          div.style.minWidth = width + 'px';
          div.style.minHeight = height + 'px';
          div.style.verticalAlign = 'middle';
          el.parentNode.replaceChild(div, el);
          div.appendChild(el);
          let ipt = new comp({
            propsData: {
              prev: {
                el: el,
              },
              rects: el.getClientRects()[0],
              custom: true,
              boardType: valType && valType,
              id: idx,
              nextId: ++idx,
            },
          }).$mount();
          // console.log(ipt, 99);
          el.parentNode.insertBefore(ipt.$el, el.nextSibling);
        });
      },
      writable: true,
    },
  });

}

export default AnoahIM
