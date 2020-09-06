<template>
  <div>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
            <i class="el-icon-lx-calendar"></i> 文本编辑
        </el-breadcrumb-item>
        <el-breadcrumb-item>MD编辑</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <div class="plugins-tips">        
            <div>
                <el-form ref="form" :model="form" label-width="80px">
                  <el-row>
                    <el-col :span="20">
                      <el-form-item label="标题">
                          <el-input v-model="title"></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="3">
                      <el-button @click="drawer = true" type="primary" plain style="margin-left: 16px;">
                        保存草稿
                      </el-button>
                      <el-button @click="drawer = true" type="danger" style="margin-left: 16px;">
                        发布
                      </el-button>
                    </el-col>
                  </el-row>
                </el-form>
            </div>
            <div>
              <el-drawer
                title="文章附加信息"
                :visible.sync="drawer"
                :direction="direction">   
                <el-form ref="form" :model="form" label-width="80px">
                  <el-form-item label="文章分类">
                    <el-select v-model="form.class" placeholder="请选择">
                      <el-option key="front" label="前端" value="1"></el-option>
                      <el-option key="backEnd" label="后端" value="2"></el-option>
                      <el-option key="server" label="随笔" value="3"></el-option>
                      <el-option key="essay" label="服务器" value="4"></el-option>
                    </el-select>
                  </el-form-item>                  
                    <el-form-item label="文章标签">
                        <el-checkbox-group v-model="form.tags">
                            <el-checkbox label="VUE" name="type" value="VUE"></el-checkbox>
                            <el-checkbox label="REACT" name="type" value="REACT"></el-checkbox>
                            <el-checkbox label="NODE" name="type" value="NODE"></el-checkbox>
                        </el-checkbox-group>
                    </el-form-item>
                    <el-form-item label="文章描述">
                        <el-input type="textarea" rows="5" v-model="form.desc"></el-input>
                    </el-form-item>                    
                    <el-form-item label="发布形式">
                      <el-radio-group v-model="form.type">
                        <el-radio label="0">私密</el-radio>
                        <el-radio label="1">公开</el-radio>
                        <el-radio label="2">VIP可见</el-radio>
                      </el-radio-group>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" plain @click="onSubmit(0)">保存为草稿</el-button>
                        <el-button type="danger" @click="onSubmit(1)">发布文章</el-button>
                    </el-form-item>
                </el-form>
              </el-drawer>
            </div>
      </div>
      <mavon-editor
        v-model="md"
        ref="md"
        @imgAdd="$imgAdd"
        @change="change"
        style="min-height: 600px"
      />
      <el-button type="danger" @click="submit">submit</el-button>
    </div>
  </div>
</template>

<script>
import { mavonEditor } from 'mavon-editor';
import 'mavon-editor/dist/css/index.css';

import { mapState, mapActions } from 'vuex';


export default {
    name: 'ArticleEdit',
    data: function(){
      return {
        html:'',        
        configs: {},
        drawer: false,
        direction: 'rtl'        
      }
    },
    computed: {
      ...mapState({
        // md: (state) => state.articleEdit.md, //vuex是数据单向流 不支持v-mode
        form: (state) => state.articleEdit.form
      }),
      title: {
        get () {
          return this.$store.state.articleEdit.title
        },
        set (value) {
          this.$store.commit('articleEdit/updateOneData', {key:'title', value:value})
        }
      },
      md: {
        get () {
          return this.$store.state.articleEdit.md
        },
        set (value) {
          this.$store.commit('articleEdit/updateOneData', {key:'md', value:value})
        }
      }
    },
    components: {
        mavonEditor
    },
    methods: {
      ...mapActions('articleEdit', ['changeAll', 'onSubmit', 'uploadFile']),
        // 将图片上传到服务器，返回地址替换到md中
      async $imgAdd(pos, $file) {
          var formdata = new FormData();
          formdata.append('file', $file);
          let url = await this.uploadFile(formdata);
          this.$refs.md.$img2Url(pos, url);
      },
      change(value, render) {
          // render 为 markdown 解析后的结果
          this.html = render;
          this.changeAll({value, render})
      },
      async submit() {
          console.log('this.title', this.title);
          console.log(this.md);
          console.log(this.html);
          let submitResult = await this.onSubmit();
          if (submitResult) {
            this.$message.success('提交成功！');            
          } else {
            this.$message.error('提交失败！');              
          }
      }
    }
};
</script>
<style scoped>
.editor-btn {
    margin-top: 20px;
}
</style>