/**
 * Copyright © 2020 Fonchar. All rights reserved.
 *
 * @another: Fonchar
 * @date: 2020-08-11
 */
import router from '../../router'
import { login } from '../../api'

// initial state
const state = {
  param: {
    username: 'fonchar',
    password: 'fonchar123456'
  },
  rules: {
    username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
    password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
  },
  loginMsg: {
    success: false,
    msg: ''
  }
}

// getters
const getters = {}

// actions
const actions = {
  login({ commit, state }) {
    return new Promise((resolve, reject) => {
      login(state.param).then(res => {
        // success
        if (res.state === 200) {
          localStorage.setItem('ms_username', state.param.username);
          commit('loginSuccess', res);
          router.push('/')
          resolve(true)
        } else {
          commit('loginFail', res);
          resolve(false)
        }
      }).catch((error) => {
        // error
        console.log(error)
      })
    })
  }
}

// mutations
const mutations = {
  loginSuccess(state, { msg }) {
    state.loginMsg.msg = msg;
    state.loginMsg.success = true
  },
  loginFail(state, { msg }) {
    state.loginMsg.msg = msg;
    state.loginMsg.success = false
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
