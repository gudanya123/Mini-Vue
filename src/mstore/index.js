import Vue from 'vue'
import Vuex from './mvuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    count: 0
  },
  getters: {
    getDoubleCount(state) {
      return state.count * 2
    }
  },
  mutations: {
    addCount(state, payload) {
      state.count += payload
    }
  },
  actions: {
    //解构上下文
    add({ commit }, payload) {
      setTimeout(() => {
        commit('addCount', payload)
      }, 1000)
    }

  },
  modules: {
  }
})
