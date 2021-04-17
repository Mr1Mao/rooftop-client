<template>
  <div class="container">
    <div class="title-bar">
      <el-button
        icon="el-icon-arrow-left"
        type="info"
        size="default"
        @click="redict('/user/myArticles')"
        plain
        >文章管理</el-button
      >
      <el-button
        icon="el-icon-position"
        type="info"
        size="default"
        @click="submit()"
        class="fr"
        >发布文章</el-button
      >
      <el-button
        icon="el-icon-plus"
        type="info"
        size="default"
        @click="addDraft()"
        plain
        class="fr"
        >保存草稿</el-button
      >
      <el-button
        @click="drawer = true"
        type="info"
        icon="el-icon-s-operation"
        class="fr"
        plain
      >
        文章设置
      </el-button>
    </div>

    <div>
      <el-drawer
        :visible.sync="drawer"
        direction="ltr"
        :before-close="handleClose"
      >
        <h2 class="drawer-title" slot="title">文章设置</h2>
        <el-form
          :model="form"
          ref="form"
          :rules="rules"
          style="padding: 0 20px"
          label-position="top"
        >
          <el-form-item label="文章标题">
            <el-input
              v-model="form.title"
              placeholder="请输入文章标题"
              maxlength="30"
              show-word-limit
            ></el-input>
          </el-form-item>
          <el-form-item label="简述">
            <el-input
              type="textarea"
              v-model="form.brief"
              placeholder="请输入文章简述"
              :autosize="{ minRows: 3, maxRows: 3 }"
              maxlength="100"
              show-word-limit
            ></el-input>
          </el-form-item>
          <el-form-item label="文章分类 & 背景图片">
            <div style="display: flex; justify-content: space-between">
              <el-select
                v-model="categoryId"
                placeholder="请选择活动区域"
                style="width: 260px"
              >
                <el-option
                  v-for="item in categories"
                  :key="item.categoryId"
                  :label="item.category"
                  :value="item.categoryId"
                >
                </el-option>
              </el-select>
              <!-- <span>&emsp;&emsp;</span> -->
              <el-select
                v-model="selectedUrl"
                placeholder="请选择背景图片"
                style="width: 260px"
              >
                <el-option
                  v-for="item in backgroundImages"
                  :key="item.imageId"
                  :label="item.label"
                  :value="item.url"
                >
                </el-option>
              </el-select>
            </div>
          </el-form-item>
          <el-form-item>
            <el-image
              :src="selectedUrl"
              fit="contain"
              style="width: 100%; height: 300px"
            >
              <div slot="error" class="image-slot">
                <i class="el-icon-picture-outline"></i>
              </div>
            </el-image>
          </el-form-item>
          <el-form-item>
            <div style="text-align:center;">
              <el-image style="width: 35%; margin-top: 10px;" :src="logo" fit="contain"></el-image>
            </div>
          </el-form-item>
        </el-form>
      </el-drawer>
    </div>
    <div>
      <rf-editor ref="editor" @func="getContent" />
    </div>
  </div>
</template>

<script>
import rfEditor from "../components/rf-editor.vue";
export default {
  components: { rfEditor },
  layout: "editor-layouts",
  middleware: 'auth',
  async asyncData(context) {

    try {
      let [categories, articleBGIs] = await Promise.all([
        context.app.$request.getCategories(),
        context.app.$request.getArticleBGI(context.store.state.userInfo.userId),
      ]);

      return {
        categories: categories.data.data,
        backgroundImages: articleBGIs.data.data,
        selectedUrl: articleBGIs.data.data[0].url,
        categoryId: categories.data.data[0].categoryId,
      };
    } catch (err) {
      console.info(err.response);
    }
  },

  data() {
    return {
      drawer: false,
      form: {
        title: this.tools.formatDate(Date.parse(new Date())),

        brief: "这是一篇文章描述",
      },
      categoryId: "",
      content: "",
      rules: {},
      categories: "",
      backgroundImages: "",
      selectedUrl: "",
      logo: "/rooftop.png",
    };
  },
  methods: {
    redict(path) {
      this.$router.push({ path: path });
    },
    submit() {
      this.$confirm("确认发布文章？", "提示", {
        confirmButtonText: "发布",
        cancelButtonText: "取消",
        type: "info",
        callback: (action) => {
          if (action === "confirm") {
            ///发布文章操作
            //上传图片&更改内容
            this.$refs.editor.uploadimg();
          } else {
            console.log("按下 取消");
          }
        },
      });
    },
    //发布文章
    async postArticle(content) {
      try {
        let response = await this.$request.postArticle({
          title: this.form.title,
          content: content,
          releaseTime: Number(new Date().getTime()),
          brief: this.form.brief,
          img: this.selectedUrl,
          userId: this.$store.state.userInfo.userId,
          categoryId: this.categoryId,
        });
        if (response.data.status == 0) {
          this.successPost(response.data.data.articleId);
        } else if (response.data.status == 403) {
          console.log("暂无权限");
        } else {
          console.log("其他异常");
        }
      } catch (error) {
        // this.submitBtnTitle = "认证错误";
      }
    },
    handleClose(done) {
      done();
    },
    getContent(data) {
      this.content = data;
      // console.log("getContent",this.form.content);
    },
    successPost(articleId) {
      this.$confirm("提示", "文章发布成功", {
        confirmButtonText: "查看文章",
        cancelButtonText: "继续发布",
        type: "success",
      })
        .then(() => {
          this.$router.push("/article/" + articleId);
        })
        .catch(() => {
          // this.$message({
          //   type: "info",
          //   message: "已取消删除",
          // });
        });
    },
  },
  watch: {
    //监听内容是否呗更改 然后上传文章
    content(val, oldVal) {
      // console.log(val);
      this.postArticle(val);
    },
  },
};
</script>

<style lang="scss" scoped>
.container {
  min-height: 500px;
  .title-bar {
    height: 40px;
    padding: 10px 10px;
    // padding-left: 10px;
    background-color: rgb(255, 255, 255);
  }
  .drawer-title {
    font: {
      family: $def_font_family;
      // weight:600
      // weight:600
    }
  }
}
</style>