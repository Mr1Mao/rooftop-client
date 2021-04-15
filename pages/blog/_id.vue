<template>
  <div class="container">
    <rf-banner :title="title" :subTitle="subTitle" />
    <div class="content w">
      <!-- {{ initialIndex }} {{ endIndex }} -->
      <div class="article-list">
        <rf-article-box
          class="article-item"
          v-for="(item, index) in articleList.articles"
          :key="index"
          :brief="item.brief"
          :title="item.title"
          :time="item.releaseTime"
          :author="item.user.username"
          :category="item.category.category"
          :img="item.img"
          data-aos="fade-up"
          data-aos-duration="1000"
          @click.native="redirect(item.articleId)"
        ></rf-article-box>
      </div>
    </div>
    <div class="pagination w ac">
      <el-pagination
        layout="prev, pager, next"
        :background="true"
        :total="articleList.total"
        :page-size="pageSize"
        :current-page.sync="currentPage"
        @current-change="updateCurrentPage"
      >
      </el-pagination>
      <div class="vacancy"></div>
    </div>
  </div>
</template>

<script>
import RfArticleBox from "../../components/rf-article-box.vue";
import rfBanner from "../../components/rf-banner.vue";
export default {
  components: { rfBanner, RfArticleBox },
  // auth: false, //无需登录

  //ajax获取列表
  async asyncData(context) {
    // console.info("页数", Number(context.route.params.id) || 1)
    // let pages = Number(context.route.params.id)-1 * 9 || 1
      try {
        let res = await context.app.$request.getArticles({
          onset: Number(context.route.params.id) || 1,
          // articleId:"2852b866873211ebace900e04c818fd2",
          offset: 9,
        });
        
        // console.info("asyncData", res.data);
        return { articleList: res.data.data };
      } catch (err) {
        console.info(err);
      }

  },

  created() {
    this.currentPage = Number(this.$route.params.id) || 1;
  },
  data() {
    return {
      title: "文章",
      subTitle: "对原创的最求",
      currentPage: 1,
      articleList: "",
      pageSize: 9,
      // reqPage:1
    };
  },
  methods: {
    redirect(articleId) {
      console.log(articleId);
      let path = "/article/" + articleId
      this.$router.push({ path: path });
    },
    updateCurrentPage(currentPage) {
      // console.log("updateCurrentPage:" + currentPage);
      this.$router.push({ name: "blog-id", params: { id: this.currentPage } });
    },
  },
};
</script>

<style lang="scss" scoped>
.container {
  .content {
    padding: 90px 0;
    padding-bottom: 50px;
    .article-list {
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
    }
  }
  .pagination {
    border-top: 1.5px solid gainsboro;
    padding: 25px 0;
  }
  .vacancy {
    height: 140px;
  }
}
</style>