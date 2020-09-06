/**
 * Copyright © 2020 Fonchar. All rights reserved.
 *
 * @another: Fonchar
 * @date: 2020-08-09
 */

<template>
 <div>
  <HomeNavbar/>
  <MdLoader v-bind:mdSource = "mdSource"/>
 </div>
</template>

<script>
import HomeNavbar from './../components/common/HomeNavbar'
import MdLoader from './../components/common/MdLoader'

import mdSource from '../../static/files/md/linux_install_java.md'

export default {
  name: 'FrontDev',
  data () {
    return {
      msg: 'FrontDev.vue',
      mdSource: mdSource
    }
  },
  components: {
    'HomeNavbar': HomeNavbar,
    'MdLoader': MdLoader
  },
  //  生命周期 - 创建完成（访问当前this实例）
  created () {
    this.init()
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
