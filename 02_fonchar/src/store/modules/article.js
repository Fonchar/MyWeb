/**
 * Copyright © 2020 Fonchar. All rights reserved.
 *
 * @another: Fonchar
 * @date: 2020-08-21
 */
import * as api from '../../api'
import dataformat from 'date-format'

// initial state
const state = {
  article: {
    // id:'',
    title: '',
    date: '',
    author: '佚名',
    // class:'',
    tags: '',
    // types:'',
    html: '<h2>暂无数据</h2>'
    // moduleName: 'article'
  },
  list: []
}

// getters
const getters = {}

// actions
const actions = {
  queryArticle ({state, commit}, prams) {
    return new Promise((resolve, reject) => {
      api.queryArticle(prams).then(res => {
        if (res.state === 200) {
          console.log('prams', prams)
          if (prams !== undefined && prams.id) {
            commit('changeArticle', res.data)
          } else {
            commit('changeList', res.data)
          }
          resolve(prams)
        } else {
          resolve({})
        }
      })
    })
  },
  getUrlSearch ({state, commit}) {
    return new Promise((resolve, reject) => {
      let search = window.location.search
      let searchArr = []
      let prams = {}
      if (search !== '') {
        searchArr = search.split('?')[1].split('&')
        searchArr.forEach(item => {
          let itemArr = item.split('=')
          prams[itemArr[0]] = itemArr[1]
          resolve(prams)
        })
      } else {
        resolve(false)
      }
    })
  },
  setUrlSearch ({state, commit}, prams) {
    return new Promise((resolve, reject) => {
      let newSearch = '?'
      let newSearchArr = []
      for (const key in prams) {
        if (prams.hasOwnProperty(key)) {
          newSearchArr.push(key + '=' + prams[key])
        }
      }
      newSearch += newSearchArr.join('&')
      let location = window.location
      window.history.pushState(null, null, location.origin + location.pathname + newSearch)
      resolve(true)
    })
  }
}

// mutations
const mutations = {
  changeArticle (state, data) {
    state.article.id = data.id
    state.article.title = data.title
    state.article.date = dataformat('yyyy-MM-dd', new Date(data.date))
    state.article.author = data.author
    state.article.class = data.class
    state.article.tags = data.tags.split(',')
    state.article.tags_id = data.tags_id
    state.article.html = decodeURI(data.html)
  },
  changeList (state, data) {
    state.list = data
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
