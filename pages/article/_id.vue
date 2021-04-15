<template>
  <div class="container">
    <rf-banner
      :title="article.title"
      :subTitle="article.category.category"
      :img="article.img"
      :type="2"
    />
    <div class="content">
      <el-image
        :src="article.img"
        fit="fill"
        :lazy="true"
        style="height: 550px; width: 100%"
      ></el-image>
      <div class="article-box">
        <div class="author-info">
          <el-avatar
            icon="el-icon-user-solid"
            :size="50"
            shape="circle"
            :src="article.user.avatar"
            fit="fill"
            style="cursor: pointer"
          ></el-avatar>
          <div class="author-name-time">
            <p class="name">{{ article.user.username }}</p>
            <p class="time">{{ tools.formatDate(article.releaseTime) }}</p>
          </div>
        </div>
        <article
          class="article-text markdown-body"
          v-html="content(article.content)"
        ></article>
      </div>
    </div>
    <div class="paging">
      <div class="previous" >
        <nuxt-link :to="'/article/' + nearbyArticle[0]" v-if="nearbyArticle[0] != null"
          ><i class="el-icon-arrow-left"></i><span>上一页</span></nuxt-link
        >
      </div>
      <div class="next" >
        <nuxt-link :to="'/article/' + nearbyArticle[1]" v-if="nearbyArticle[1] != null"
          ><span>下一页</span><i class="el-icon-arrow-right"></i
        ></nuxt-link>
      </div>
    </div>
    <div class="share">
      <p>分享文章</p>
      <div class="share-btns">
        <el-button type="primary" class="btn" round
          >&emsp;&ensp;QQ&ensp;&emsp;</el-button
        >
        <el-button type="success" class="btn" round
          >&emsp;&ensp;微信&ensp;&emsp;</el-button
        >
        <!-- <el-button type="info" round>GitHub</el-button> -->
        <!-- <el-button type="warning" round>警告按钮</el-button> -->
        <el-button type="danger" class="btn" round
          >&emsp;&ensp;微博&ensp;&emsp;</el-button
        >
      </div>
    </div>
  </div>
</template>

<script>
import rfMark from "../../components/rf-mark.vue";
import marked from "marked";
import RfBanner from "../../components/rf-banner.vue";
export default {
  components: { rfMark, RfBanner },
  // auth: false, //无需登录
  async asyncData(context) {
    // console.log("啦啦啦",context.route.params.id)
    try {
      let res = await context.app.$request.getArticle({
        articleId: context.route.params.id,
      });
      return {
        article: res.data.data.article,
        nearbyArticle: res.data.data.nearbyArticle,
      };
    } catch (err) {
      console.info(err);
    }
  },
  head() {
    return {
      title: this.article.title,
      meta: [
        {
          hid: "description",
          name: "description",
          content: this.article.content,
        },
      ],
    };
  },
  mounted() {
    const link = document.createElement("link");
    link.type = "text/css";
    link.rel = "stylesheet";
    link.href =
      "https://cdn.bootcss.com/github-markdown-css/2.10.0/github-markdown.min.css";
    document.head.appendChild(link);
  },
  data() {
    return {
      article: "",
      nearbyArticle: "",
    };
  },
  methods: {
    content(text) {
      return marked(text);
    },
  },
};
</script>

<style lang="scss" scoped>
.container {
  .content {
    box-shadow: 0 0 30px 0 rgba(0, 0, 0, 0.05);
    background-color: #fff;
    // height: 1000px;
    width: 1150px;
    margin: 0 auto;
    margin-top: -60px;
    margin-bottom: 30px;
    .article-box {
      padding: 40px 110px;
      .author-info {
        display: flex;
        .author-name-time {
          margin-left: 20px;
          font-family: $def_font_family;
          p {
            cursor: pointer;
            &:hover {
              text-decoration: underline;
            }
          }

          .name {
            color: black;
            line-height: 25px;
            font: {
              size: 1rem;
              weight: 600;
            }
          }
          .time {
            line-height: 25px;
            color: #767676;
            font-size: 0.9rem;
            font-style: italic;
          }
        }
      }
      .article-text {
        padding: 20px 0;
      }
    }
  }
  .paging {
    display: flex;
    width: 1120px;
    margin: 0 auto;
    justify-content: space-between;
    font: {
      size: 1rem;
      family: $def_font_family;
    }
    div {
      cursor: pointer;
    }
  }
  .share {
    // height: 100px;

    width: 1120px;
    margin: 80px auto;
    // margin-top: 100px;
    p {
      // color: black;
      text-align: center;
      font: {
        size: 1rem;
        weight: 600;
        family: $def_font_family;
      }
    }
    .share-btns {
      margin: 20px 0;
      display: flex;
      width: 100%;
      justify-content: center;
      .btn {
        margin: 0 20px;
      }
    }
  }
}
</style>