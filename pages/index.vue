<template>
  <div class="container">
    <el-carousel trigger="click" height="580px">
      <el-carousel-item v-for="(item,index) in banner" :key="index" fit="contain">
        <el-image :src="item.img"></el-image>
        <!-- <h3 class="small"></h3> -->
      </el-carousel-item>
    </el-carousel>
    <div class="page-title">
      <div class="title">rooftop</div>
      <div class="access-btn">进入博客</div>
    </div>
    <div class="content w">
      <div class="content-title ac">
        <h1>最新文章</h1>
        <h2>此处为最新发布的文章</h2>
      </div>
      <div class="article-list">
        <rf-article-box
          class="article-item"
          v-for="(item, index) in articlesData.articles"
          :key="index"
          :brief="item.brief"
          :title="item.title"
          :time="item.releaseTime"
          :author="item.user.username"
          :category="item.category.category"
          :img="item.img"
          data-aos="fade-up"
          :data-aos-duration="duration"
          @click.native="redirect(item.articleId)"
        ></rf-article-box>
      </div>
      <div class="more">
        <el-button
          type="primary"
          size="medium"
          data-aos="fade-up"
          :data-aos-duration="duration"
          round
          @click="getMore()"
        >
          &emsp;&ensp;更多&emsp;&ensp;
        </el-button>
      </div>
    </div>
  </div>
</template>

<script>
import rfArticleBox from "../components/rf-article-box.vue";
export default {
  components: { rfArticleBox },
  // middleware: ['auth'],
  //ajax获取列表
  async asyncData(context) {
    // console.info("index", context);
    try {
      let res = await context.app.$request.getArticles({
        onset: 1,
        offset: 9,
      });
      return { articlesData: res.data.data };
    } catch (err) {
      console.info(err);
    }
  },
  data() {
    return {
      duration: 1000,
      articlesData: "",
      banner:[
        {img:"https://rooftop-1258887757.cos.ap-shanghai.myqcloud.com/system/pexels-pixabay-270488.jpg"},
         {img:"https://rooftop-1258887757.cos.ap-shanghai.myqcloud.com/system/pexels-olia-danilevich-4974912.jpg"},
          {img:"https://rooftop-1258887757.cos.ap-shanghai.myqcloud.com/system/pexels-markus-spiske-2061168.jpg"},
           {img:"https://rooftop-1258887757.cos.ap-shanghai.myqcloud.com/system/pexels-nick-wehrli-3762284.jpg"}
      ]
    };
  },
  methods: {
    redirect(articleId) {
      console.log(articleId);
      let path = "/article/" + articleId;
      this.$router.push({ path: path });
    },
    getMore() {
      this.$router.push({ path:"/blog/" });
    },
  },
};
</script>

<style lang="scss" scoped>
.container {
  background-color: $def_bgc;

  .el-carousel__item h3 {
    color: #475669;
    font-size: 14px;
    opacity: 0.75;
    line-height: 580px;
    margin: 0;
  }

  .el-carousel__item:nth-child(2n) {
    background-color: #99a9bf;
  }

  .el-carousel__item:nth-child(2n + 1) {
    background-color: #d3dce6;
  }

  .page-title {
    padding: 80px 0;
    background: $basic_color;
    display: flex;
    // justify-content: space-around;
    justify-content: center;
    color: white;
    //字体不可选取
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;

    .title {
      text-align: center;
      margin-right: 50px;
      margin-top: 10px;
      font: {
        size: 2.5rem;
        weight: 600;
      }
    }

    .access-btn {
      border: 2px solid rgba(#fff, 0.2);
      border-radius: 20px;
      padding: 10px 30px;
      cursor: pointer;
      font: {
        size: 1.1rem;
        family: $def_font_family;
      }

      &:hover {
        border: 2px solid white;
      }
    }
  }
  .content {
    // height: 1000px;
    padding: 90px 0;
    .content-title {
      font-family: $def_font_family;

      h1 {
        font: {
          weight: 600;
          size: 1.8rem;
        }
      }

      h2 {
        margin: 50px 0;
        color: rgba($color: #232323, $alpha: 0.6);
        font: {
          size: 1rem;
        }
      }
    }
    .article-list {
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
    }
    .more {
      width: 100px;
      margin: 0 auto;
      margin-top: 80px;
    }
  }
}
</style>