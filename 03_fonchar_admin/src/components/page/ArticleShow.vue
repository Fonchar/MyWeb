/**
 * Copyright © 2020 Fonchar. All rights reserved.
 *
 * @another: Fonchar
 * @date: 2020-08-20
 */

<template>
  <div style="background-color: antiquewhite;">
    <div class="v-note-wrapper markdown-body shadow" style="width:60%;margin: auto; padding:12px 30px;">
      <mavon-editor :ishljs = "true" codeStyle="monokai" v-html="html"></mavon-editor>
    </div>
  </div>
</template>

<script>
import { mavonEditor } from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'

import {queryArticle} from '../../api'

export default {
  name: 'ArticleShow',
  data () {
    return {
      msg: 'ArticleShow.vue',
      html: '<h1>大鳄纷纷</h1>',
      md: '<h1>大鳄纷纷</h1>'
    }
  },
  components: {
    mavonEditor:mavonEditor
  },
  //  生命周期 - 创建完成（访问当前this实例）
  created () {
  },
  //  生命周期 - 挂载完成（访问DOM元素）
  mounted () {
    this.init()

  },
  methods: {
    init () {
      queryArticle({id:5}).then(res => {
        console.log(res.data)
        this.html = decodeURI(res.data.html)
        this.md = decodeURI(res.data.md)
      })
      queryArticle().then(res => {
        console.log('List', res.data)
        this.list = res.data
      })
    }
  }
}

</script>

<style scoped>
/* @import url(); 引入css类 */

</style>
