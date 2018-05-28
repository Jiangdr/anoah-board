import Vue from 'vue'
import Router from 'vue-router'
import AnoahIM from '@/components/AnoahIM'
import ReplaceIpt from '@/components/ReplaceIpt'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'AnoahIM',
      component: ReplaceIpt
    },
    {
      path: '/repmodel',
      name: 'ReplaceIpt',
      component: ReplaceIpt
    },
  ]
})
