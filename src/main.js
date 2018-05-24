// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'

Vue.config.productionTip = false
import axios from 'axios'

Vue.prototype.$http = axios
/*
import qtivue from 'qtivue/qtivue'
import 'qtivue/qtivue.css'
import anoahim from 'qtivue/anoahim'
import mp3player from 'qtivue/mp3player'
import tcplayer from 'qtivue/tcplayer'

//Vue.use(qti)

//qti.default.install(Vue);

Vue.use(qtivue)
Vue.use(anoahim)
Vue.use(mp3player)
Vue.use(tcplayer)*/

Vue.use(qtivue.default)

import Toast from './plugins/toast/toast.js'
Vue.use(Toast);

//mp3player插件依赖toast插件
//import Mp3player from './plugins/mp3player.js'

Vue.use(Mp3player,{'stopclass':'audio-preview','playclass':'audio-preview play','pauseclass':'audio-preview pause'});
//
import Mp3player from './plugins/mp3player/mp3player.js'
Vue.use(Mp3player);

//anoahim插件依赖toast插件
import AnoahIM from './plugins/anoahim/anoahim.js'
//console.log(5555,AnoahIM)
Vue.use(AnoahIM);

// import Tcplayer from './plugins/tcplayer/tcplayer.js'
// Vue.use(Tcplayer);

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
