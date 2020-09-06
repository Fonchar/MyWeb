/**
 * Copyright © 2020 Fonchar. All rights reserved.
 *
 * @another: Fonchar
 * @date: 2020-08-09
 */

<template>
  <div>

    <HomeNavbar/>

    <div class="container" :style="$screen.containerH">
      <div class="row">
        <div class="col-sm-4">
          <h2>{{$t('i18n.about_me')}}</h2>
          <h5>我的照片:</h5>
          <div class="fakeimg">这边插入图像</div>
          <p>关于我的介绍..</p>
          <h3>一些链接</h3>
          <p>说明文本</p>
          <ul class="nav nav-pills flex-column">
            <li class="nav-item">
              <a class="nav-link active" href="#">激活状态</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="#">链接</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="#">链接</a>
            </li>
            <li class="nav-item">
              <a class="nav-link disabled" href="#">禁用</a>
            </li>
          </ul>
          <hr class="d-sm-none">
        </div>
        <div class="col-sm-8">
          <h2>标题</h2>
          <h5>副标题</h5>
          <div class="fakeimg">图像</div>
          <p>一些文本..</p>
          <p>菜鸟教程，学的不仅是技术，更是梦想！！！菜鸟教程，学的不仅是技术，更是梦想！！！菜鸟教程，学的不仅是技术，更是梦想！！！</p>
          <br>
          <h2>标题</h2>
          <h5>副标题</h5>
          <div class="fakeimg">图像</div>
          <p>一些文本..</p>
          <p>菜鸟教程，学的不仅是技术，更是梦想！！！菜鸟教程，学的不仅是技术，更是梦想！！！菜鸟教程，学的不仅是技术，更是梦想！！！</p>
        </div>
      </div>
    </div>

    <BottomBar/>

  </div>
</template>

<script>
import HomeNavbar from './../components/common/HomeNavbar'
import BottomBar from './../components/common/BottomBar'

import {mapState} from 'vuex'

export default {
  name: 'IndexPage',
  data () {
    return {
      msg: 'IndexPage.vue'
    }
  },
  components: {
    'HomeNavbar': HomeNavbar,
    'BottomBar': BottomBar
  },
  //  生命周期 - 创建完成（访问当前this实例）
  created () {
    this.init()
  },
  //  生命周期 - 挂载完成（访问DOM元素）
  mounted () {},
  computed: {
    ...mapState(['name', 'app', 'user'])

  },
  methods: {
    init () {
      console.log(this.msg)
      console.log('this.$store.state.name: ', this.$store.state.name)
      console.log('this.$store.state.app.name: ', this.$store.state.app.name)
      // console.log('this.$store.state.user.name: ', this.$store.state.user.name)

      // console.log('name: ', this.name)
      // console.log('app: ', this.app.name)
      // console.log('user: ', this.user.name)
    }
  }
}
</script>

<style scoped>
/* @import url(); 引入css类 */
.fakeimg {
  height: 200px;
  background: #aaa;
}
</style>
