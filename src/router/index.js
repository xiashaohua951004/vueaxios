import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router);
const HelloWorld = resolve => require(['@/components/HelloWorld'], resolve);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'HelloWorld',
      component: HelloWorld
    }
  ]
})
