/**
 * Copyright © 2020 Fonchar. All rights reserved.
 *
 * @another: Fonchar
 * @date: 2020-08-11
 */

<template>
 <div>

   <HomeNavbar/>

     <div class="container" :style="$screen.containerH">
      <h1>Shopping Cart Example</h1>
      <hr>
      <h2>Products</h2>
      <ProductList/>
      <hr>
      <ShoppingCart/>
     </div>

   <BottomBar/>

 </div>
</template>

<script>
import HomeNavbar from './../components/common/HomeNavbar'
import BottomBar from './../components/common/BottomBar'
import App from './../components/App'
import ProductList from './../components/ProductList'
import ShoppingCart from './../components/ShoppingCart'

export default {
  name: 'Shopping',
  data () {
    return {
      msg: 'Shopping.vue'
    }
  },
  components: {
    'HomeNavbar': HomeNavbar,
    'BottomBar': BottomBar,
    'App': App,
    'ProductList': ProductList,
    'ShoppingCart': ShoppingCart
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
