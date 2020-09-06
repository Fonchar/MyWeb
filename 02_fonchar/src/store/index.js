import Vue from 'vue'
import Vuex from 'vuex'

import state from './state'
import * as getters from './getters'
import mutations from './mutations'
import actions from './actions'

import m1 from './modules/m1'
import m2 from './modules/m2'
import cart from './modules/cart'
import products from './modules/products'
import article from './modules/article'

Vue.use(Vuex)

const store = new Vuex.Store({
  state,
  getters,
  mutations,
  actions,
  modules: {
    m1,
    m2,
    cart,
    products,
    article
  }
})

export default store
