/**
 * Copyright © 2020 Fonchar. All rights reserved.
 *
 * @another: Fonchar
 * @date: 2020-08-10
 */

<template>
 <div>

  <HomeNavbar/>

  <div class="container" :style="$screen.containerH">
    <div class="row border-success blog-box">
      <div class="col-sm-12">
        <hr>
        <h5>博主简介</h5>
        <div class="title-line"></div>
        <div class="row info-row">
          <div class="col-sm-6">姓名：傅恩泉</div>
          <div class="col-sm-6">民族：瑶</div>
        </div>
        <div class="row info-row">
          <div class="col-sm-6">星座：射手座</div>
          <div class="col-sm-6">学历：本科</div>
        </div>
        <div class="row info-row">
          <div class="col-sm-6">籍贯：广西桂林</div>
          <div class="col-sm-6">专业：信息对抗</div>
        </div>
        <div class="row info-row">
          <div class="col-sm-6">自述：</div>
          <div class="col-sm-6"></div>
        </div>
        <p class="info-text">
          <strong> “一片竹林，一张椅子，一杯茶，天空下着蒙蒙细雨，微风拂面而过。”</strong> 这便是我的<strong> 风雨茶 。</strong>我的憧憬，我的向往，希望年老之时可以如此度过。
        </p>
        <p class="info-text">
          然而我现在子是个为生存而战的码农，来自广西桂林某处的大山。高中才正式接触，后来考上了<strong> 桂林电子科技大学 </strong>，于 <strong>信息对抗专业</strong> 主修通信类课程。
          因为属于武器类专业，没能进入部队，毕业后转行做了软件开发。17年7月，入职的第一家公司在桂林，主要负责的是当地政府的一些项目，主要技术JSP+JAVA，前后端分离的开发模式。
          我主要负责页面的设计、编写、以及和甲方对接。经过一年多的实践，算是入门了IT行业。
        </p>
        <p class="info-text">
          为了有更好的发展，告辞了这家公司，自学了一个多月的VUE、NODE便来到深圳，应聘各种碰壁，最终入职了。刚入职我的待遇是我在桂林的三倍多，无比兴奋。这家公司主要做的NODE开发，
          我算是有些基础，但是我起初主要是做前端，前端采用JADE语言，我认为之时强迫患者语言，对格式的要求非常严格，但这也为我的代码规范奠定了基础。后来在前辈的推荐下拜读了《重构》（Martin Fowler），
          代码质量有了质的提升，这是一本技术书也是一本工具书，看得越多越有用。在后来的工作中负责了各类工作：旧系统的维护升级，新功能、新产品的策划制定实施部署上线。因为业务需求，
          JAVA、Android、iSO、小程序、react、RN都有涉及。
        </p>
        <p class="info-text">
          随着经手的项目越来越多，越发的感受到框架设计对应用开发的重要性，无论你做的是前端还是后端，这便是我今后要不断学习探索的地方。
        </p>
      </div>
    </div>
  </div>

  <BottomBar/>

 </div>
</template>

<script>
import HomeNavbar from './../components/common/HomeNavbar'
import BottomBar from './../components/common/BottomBar'

export default {
  name: 'Essay',
  data () {
    return {
      msg: 'Essay.vue'
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

.fakeimg {
  height: 300px;
  background: #aaa;
}
.blog-box {
  border: 1px solid;
  border-radius: 0.5em;
  padding-top: 1em;
}
.about_blog_bg {
  background-size: 100% auto;
  background-position: center center;
}
.avatar {
  width: 100%;
  border-radius: 50%;
}
.alias{
  display: inline-block;
  text-align: center;
  color: #FFFF;
}
.title-line {
  widows: 100%;
  border-bottom: 1px solid #3cd4c9;
}
.info-row div{
  height: 40px;
  line-height: 40px;
}
.info-text {
  text-indent: 2rem;
  font-size: 14px;
  line-height: 30px;
  color: #999;
}
.h-40x {
  height: 40px;
}
.lh-40x {
  line-height: 40px;
}
.paddiing-top {
  padding-top: 1em;
}
.margin-top {
  margin-top: 1em;
}
.margin-top-x2 {
  margin-top: 2em;
}
</style>
