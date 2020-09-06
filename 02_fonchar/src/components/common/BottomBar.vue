/**
 * Copyright © 2020 Fonchar. All rights reserved.
 *
 * @another: Fonchar
 * @date: 2020-08-09
 */

<template>
 <div>
  <div class="jumbotron text-center" style="margin-bottom:0">
    <img :src="$Images.logo" alt="Fonchar" style="width:250px;">
    <p>Copyright © 2020 Fonchar. All rights reserved</p>
  </div>
 </div>
</template>

<script>

export default {
  name: 'BottomBar',
  data () {
    return {
      msg: 'BottomBar.vue'
    }
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
