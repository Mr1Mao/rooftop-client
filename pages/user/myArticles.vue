<template>
  <div class="container">
    <div class="my-articles">
      <rf-article-line
        v-for="(item, index) in articlesData.articles"
        :key="index"
        :title="item.title"
        :time="item.time"
        :brief="item.brief"
        :likes="item.likes"
        :views="item.views"
        :comments="item.views"
        :img="item.img"
        :id="item.articleId"
      ></rf-article-line>
    </div>
    <div class="ac" v-if="isLoading" style="font-size: 1.3rem">
      <i class="el-icon-loading"></i>
    </div>
    <div class="ac more" @click="loading()" v-else>
      <i class="el-icon-arrow-down"> {{ msg }}</i>
    </div>
  </div>
</template>

<script>
import rfArticleLine from "../../components/rf-article-line.vue";
export default {
  transition: "labelPage",
  components: { rfArticleLine },
  //ajax获取列表
  async asyncData(context) {
    try {
      let res = await context.app.$request.getArticles({
        onset: 1,
        offset: 6,
        userId: context.store.state.userInfo.userId,
      });
      return { articlesData: res.data.data };
    } catch (err) {
      console.info(err);
    }
  },
  data() {
    return {
      articlesData: "",
      pagination: 1,
      isLoading: false,
      msg: "加载更多",
    };
  },
  methods: {
    loading() {
      this.isLoading = true;
      this.getNewData(++this.pagination);
    },
    async getNewData(pagination) {
      console.info(pagination);
      try {
        let res = await this.$request.getArticles({
          onset: pagination,
          offset: 6,
          userId: this.$store.state.userInfo.userId,
        });
        if (res.data.data.articles.length == 0) {
          this.msg = "没有更多了";
        } else {
          this.articlesData.articles = this.articlesData.articles.concat(
            res.data.data.articles
          );
        }
        this.isLoading = false;
      } catch (err) {
        this.isLoading = false;
        this.msg = "加载失败";
        console.info(err);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.container {
  min-height: 500px;
  .more {
    cursor: pointer;
    &:hover {
      text-decoration: underline;
    }
  }
  // background-color: blueviolet;
}
</style>