/**
 * Copyright © 2020 Fonchar. All rights reserved.
 *
 * @another: Fonchar
 * @date: 2020-08-18
 */

import router from '../../router'
import { BASE_URL, saveArticle, upload } from '../../api'

// initial state
const state = {  
  title: '12312131',
  md: '### GGGGG',
  html: '',              
  form: {
    class: '',
    tags: [],
    type: '0',
    desc: '',
    state: '0',
    delivery: true,
    options: []
  }
}

// getters
const getters = {}

// actions
const actions = {  
  changeAll({ commit, state }, {value, render}) {
    // render 为 markdown 解析后的结果
    commit('changeMdHtml', {md: value, html: render})
  },
  onSubmit({ commit, state }, article_state){
    return new Promise((resolve, reject) => {
      commit('changeArticleState', article_state);
      saveArticle(state).then(res =>{        
        if (res.state === 200) {
          resolve(true)
        } else {
          resolve(false)
        }
      })
      
      // console.log('param-----------------', param)
      // articleEdit(param).then(res =>{
      //     if (res.state === 200) {
            
      //     } else {
            
      //     }
      //   }
      // )
    })
  },
  uploadFile({ commit, state }, file_data){
    return new Promise((resolve, reject) => {
      upload(file_data).then(res => {
        // success
      console.log('BASE_URL + res.url--', BASE_URL + res.url)
        if (res.state === 200) {
          resolve(BASE_URL + res.url)
        } else {
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
  changeMdHtml(state, {md, html}){
    state.html = html;
  },
  updateOneData(state, {key, value}) {
    state[key] = value
  },
  changeArticleState(state, value) {
    state.form.state = value
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
