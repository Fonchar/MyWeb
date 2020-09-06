/**
 * Copyright © 2020 Fonchar. All rights reserved.
 *
 * @another: Fonchar
 * @date: 2020-08-09
 */

<template>
 <div>
  <div v-html="mdSource"/>
 </div>
</template>

<script>

export default {
  name: 'MdLoader',
  props: {
    mdSource: String
  },
  data () {
    return {
      msg: 'MdLoader.vue'
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
