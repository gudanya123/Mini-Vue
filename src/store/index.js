import Vue from 'vue'
import Vuex from 'vuex'

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
    addCount(state) {
      state.count++
    }
  },
  actions: {
    add({ commit }) {
      setTimeout(() => {
        commit('addCount')
      }, 1000)
    }

  },
  modules: {
  }
})
