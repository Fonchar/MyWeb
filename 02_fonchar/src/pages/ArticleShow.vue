/**
 * Copyright © 2020 Fonchar. All rights reserved.
 *
 * @another: Fonchar
 * @date: 2020-08-21
 */

<template>
 <div>

   <HomeNavbar/>

    <div class="container" :style="$screen.containerH">
      <div class="row">
        <div style="padding:12px 30px; box-shadow:none !important">
          <h3><strong>{{article.title}}</strong></h3>
          <div class="d-flex p-3">
            <div class="p-2"><p class="text-info"><img :src="$Images.logo_sm"/></p></div>
            <div class="p-2"><p class="text-info">{{article.author}}</p></div>
            <div class="p-2"><p class="text-secondary">{{article.date}}</p></div>
            <div class="p-2">
              <span class="badge badge-light m-r-2 border border-success" v-for="tag in article.tags" :key="tag">{{tag}}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-sm-9">
          <div>
            <div class="v-note-wrapper markdown-body shadow">
              <mavon-editor :ishljs = "true" codeStyle="monokai" v-html="article.html" name="mymavon" style="padding:12px 30px; box-shadow:none !important">
              </mavon-editor>
            </div>
          </div>
        </div>
        <div class="col-sm-3">
          <div class="aside-box">
            <h3 class="archive-title">文章列表</h3>
            <ul class="nav nav-pills flex-column">
              <li v-for="item in list" :key="item.id" class="nav-item">
                <a class="nav-link" @click="queryArticleByID(item.id)">{{item.title}}</a>
              </li>
            </ul>
          </div>
          <!-- <div class="aside-box">
            <h3 class="archive-title">分类专栏</h3>
            <ul class="nav nav-pills flex-column">
              <li v-for="item in list" :key="item.id" class="nav-item">
                <a class="nav-link" @click="queryArticleByID(item.id)">{{item.title}}</a>
              </li>
            </ul>
          </div> -->
          <div class="aside-box">
            <h3 class="archive-title">归档</h3>
            <div class="archive-content">
              <div class="archive-item" v-for="item in list" :key="item.id">
                <a>
                  <span class="time">{{8 + item.id}}月</span>
                  <span class="count">6篇</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

   <BottomBar/>

 </div>
</template>

<script>
import HomeNavbar from './../components/common/HomeNavbar'
import BottomBar from './../components/common/BottomBar'

import { mapState, mapActions } from 'vuex'

// 导入mavonEditor相关依赖
import { mavonEditor } from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'

export default {
  name: 'ArticleShow',
  data () {
    return {
      archiveBox: [

      ]
    }
  },
  computed: {
    ...mapState({
      article: (state) => state.article.article,
      list: (state) => state.article.list
    })
  },
  components: {
    'HomeNavbar': HomeNavbar,
    'BottomBar': BottomBar,
    'mavonEditor': mavonEditor
  },
  //  生命周期 - 创建完成（访问当前this实例）
  created () {
    this.init()
  },
  //  生命周期 - 挂载完成（访问DOM元素）
  mounted () {
  },
  methods: {
    ...mapActions('article', [
      'queryArticle',
      'getUrlSearch',
      'setUrlSearch'
    ]),
    async init () {
      let search = await this.getUrlSearch()
      await this.queryArticle()
      await this.queryArticle(search === false ? 5 : search)
      await this.setUrlSearch(search)
    },
    async queryArticleByID (id) {
      await this.queryArticle({id: id})
      await this.setUrlSearch({id: id})
    }
  }
}

</script>

<style scoped>
/* @import url(); 引入css类 */
a {
  cursor: pointer;
  display: block;
  color: #555666;
}
a:hover {
  color: #28a745;
}
.m-r-2 {
  margin-right: 0.5rem;
}
.nav-link {
  cursor: pointer;
}
.box-shadow {
  box-shadow: 0 0rem 1rem rgba(0,0,0,.3)!important;
}
.aside-box {
  margin-bottom: 8px;
  background-color: #fff;
  -webkit-box-shadow: 0 2px 4px 0 rgba(0,0,0,0.05);
  box-shadow: 0 2px 4px 0 rgba(0,0,0,0.05);
}
.archive-title {
  font-size: 20px;
  line-height: 26px;
  color: #4a4d52;
  margin-bottom: 8px;
  padding: 0 6px;
}
.archive-content {
  display: flex;
  -ms-flex-wrap: wrap;
  flex-wrap: wrap;
}
.archive-item {
  width: 56px;
  margin-right: 6px;
  margin-left: 6px;
  margin-bottom: 12px;
}
.archive-item span {
  display: block;
}
.archive-item span.time {
  height: 22px;
  background-color: #edf0f3;
  border-radius: 6px 6px 0 0;
  opacity: .8;
  color: #999aaa;
  line-height: 22px;
  margin-bottom: 1px;
  text-align: center;
}
.archive-item span.count {
  height: 22px;
  background-color: #f6f8fa;
  border-radius: 0 0 6px 6px;
  color: #555666;
  line-height: 20px;
  font-weight: 500;
  text-align: center;
}

</style>
