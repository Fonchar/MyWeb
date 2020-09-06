import Vue from 'vue'
import Vuex from 'vuex'

import state from './state'
import * as getters from './getters'
import mutations from './mutations'
import actions from './actions'

import m1 from './modules/m1'
import m2 from './modules/m2'

import login from './modules/login'
import articleEdit from './modules/articleEdit'

Vue.use(Vuex)

const store = new Vuex.Store({
  state,
  getters,
  mutations,
  actions,
  modules: {
    m1,
    m2,
    login,
    articleEdit
  }
})

export default store
