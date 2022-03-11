import Vue from 'vue'
import App from './App.vue'
// import router from './router'
import router from './mrouter '
// import store from './store'
import store from './mstore'
import create from './utils/create'


//插件注册
Vue.use(create)

Vue.config.productionTip = false

//事件总线
// Vue.prototype.$create = create 

new Vue({
  router,   //挂载router实例, Vue.prototype.$router = router
  store,
  render: h => h(App)
}).$mount('#app')
