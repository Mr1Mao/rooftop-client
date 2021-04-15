<template>
  <el-card shadow="hover" class="ar-container" :body-style="{ padding: '0px' }">
    <div class="img-box">
      <el-image :src="img" fit="scale-down" class="img" ></el-image>
      
    </div>
    <div class="content">
      <div class="brief">
        <span>{{ brief }}</span>
      </div>
      <div class="article-title">
        <h1>{{ title }}</h1>
      </div>
      <el-divider></el-divider>
      <div class="time-author">
        <span>{{ tools.formatDate(time) }}</span>
        <span>By</span>
        <span class="author">
            <nuxt-link to="/">{{ author }}</nuxt-link>
        </span>
        <p class="category fr">
            <nuxt-link to="/">{{ category }}</nuxt-link>
        </p>
      </div>
    </div>
  </el-card>
</template>

<script>
export default {
  data() {
    return {};
  },
  methods: {
  },
  props: {
    title: {
      type: String,
      default: "标题",
    },
    img: {
      type: String,
      default:
        "https://s.dukeyin.com/wp-content/uploads/2021/02/universe-760x400.jpg",
    },
    brief: {
      type: String,
      default: "内容",
    },
    time: {
      type: Number,
      default: 1613730612,
    },
    author: {
      type: String,
      default: "author",
    },
    category: {
      type: String,
      default: "none",
    },
  },
};
</script>

<style lang="scss" scoped>
.ar-container {
  background-color: white;
  margin-bottom: 40px;
  width: 370px;
  cursor: pointer;

  .img-box {
    width: 100%;
    height: 190px;
    overflow: hidden;
    .img {
      transition: all 0.3s;
      -moz-transition: all 0.3s;
      -webkit-transition: all 0.3s;
      -o-transition: all 0.3s;

      &:hover {
        transform: scale(1.1);
      }
    }
  }
  .content {
    padding: 20px;
    font: {
      family: $def_font_family;
    }
    .brief {
      margin-bottom: 24px;
      text-overflow: -o-ellipsis-lastline;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }
    //   .article-title{
    h1 {
      font: {
        weight: 600;
        size: 1.1rem;
      }
    }
    .time-author {
      font-style: italic;
      padding: 5px 0;
      color: rgba($color: #000000, $alpha: 0.6);
      .author:hover,
      .category:hover {
        text-decoration: underline;
      }
    }
    //   }
  }
}
</style>