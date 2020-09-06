/**
 * Copyright © 2020 Fonchar. All rights reserved.
 *
 * @another: Fonchar
 * @date: 2020-08-09
 */

<template>
 <div>
    <nav class="navbar navbar-expand-sm bg-light navbar-light">
      <a class="navbar-brand" href="/">
        <img :src="$Images.logo" alt="Fonchar" style="width:250px;">
      </a>
      <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#collapsibleNavbar">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="collapsibleNavbar">
        <ul class="navbar-nav">
          <li class="nav-item">
            <a class="nav-link" href="/">主页</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="/FrontDev">前端开发</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="#">作品案例</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="#">全栈开发</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="/AboutBlog">关于博客</a>
          </li>
          <!-- <li class="nav-item">
            <a class="nav-link" href="/HelloWorld">HelloWorld</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="/SassView">SassView</a>
          </li> -->
          <li class="nav-item">
            <a class="nav-link" href="/Essay">随笔</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="/Shopping">Shopping</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="/ArticleShow">ArticleShow</a>
          </li>
        </ul>
      </div>
    </nav>
 </div>
</template>

<script>

export default {
  name: 'HomeNavbar',
  data () {
    return {
      msg: 'HomeNavbar.vue'
    }
  },
  //  生命周期 - 创建完成（访问当前this实例）
  created () {
    // this.init()
  },
  //  生命周期 - 挂载完成（访问DOM元素）
  mounted () {

  },
  methods: {
    init () {
      console.log(this.msg)
    }
  }
}

</script>

<style scoped>
/* @import url(); 引入css类 */

</style>
