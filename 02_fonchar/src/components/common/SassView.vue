/**
 * Copyright © 2020 Fonchar. All rights reserved.
 *
 * @another: Fonchar
 * @date: 2020-08-10
 */

<template>
 <div>
   <!-- <span v-for="item in list">{{item}}</span> -->
   <span v-for="item in list" :key="item.text" :style="{'--text': item.text, '--color': item.color}"></span>
   <div class="ff">FFFFFFFFFFFFFFFFFF</div>
 </div>
</template>

<script>

export default {
  name: 'SassView',
  data () {
    return {
      color: 'blue',
      list: [
        { text: '"中"', color: 'red' },
        { text: '"华"', color: 'orange' },
        { text: '"人"', color: 'yellow' },
        { text: '"民"', color: 'orange' },
        { text: '"共"', color: 'green' },
        { text: '"和"', color: 'cyan' },
        { text: '"国"', color: 'blue' }
      ]
    }
  },
  //  生命周期 - 创建完成（访问当前this实例）
  created () {
    this.init()
  },
  //  生命周期 - 挂载完成（访问DOM元素）
  mounted () {
    $('.ff').css('background-color', 'yellow')
  },
  methods: {
    init () {
    }
  }
}

</script>

<style lang="scss" scoped>
span::after {
  content: var(--text);
  background-color: var(--color);
}
// .ff {
//   background-color: var(color);
// }
</style>
