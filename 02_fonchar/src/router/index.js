import Vue from 'vue'
import Router from 'vue-router'

import HelloWorld from '@/components/HelloWorld'

// 页面组件
import IndexPage from '@/pages/IndexPage'
import FrontDev from '@/pages/FrontDev'
import AboutBlog from '@/pages/AboutBlog'
import ArticleShow from '@/pages/ArticleShow'
import Essay from '@/pages/Essay'
import Shopping from '@/pages/Shopping'

// 公共组件
import HomeNavbar from '@/components/common/HomeNavbar'
import BottomBar from '@/components/common/BottomBar'
import SassView from '@/components/common/SassView'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    // 页面组件
    {
      path: '/',
      name: 'IndexPage',
      component: IndexPage
    },
    {
      path: '/FrontDev',
      name: 'FrontDev',
      component: FrontDev
    },
    {
      path: '/AboutBlog',
      name: 'AboutBlog',
      component: AboutBlog
    },
    {
      path: '/ArticleShow',
      name: 'ArticleShow',
      component: ArticleShow
    },
    {
      path: '/Essay',
      name: 'Essay',
      component: Essay
    },
    {
      path: '/Shopping',
      name: 'Shopping',
      component: Shopping
    },
    {
      path: '/HelloWorld',
      name: 'HelloWorld',
      component: HelloWorld
    },
    // 公共组件
    {
      path: '/HomeNavbar',
      name: 'HomeNavbar',
      component: HomeNavbar
    },
    {
      path: '/BottomBar',
      name: 'BottomBar',
      component: BottomBar
    },
    {
      path: '/SassView',
      name: 'SassView',
      component: SassView
    }
  ]
})
