<template>
  <div class="line-box">
    <div style="display: flex">
      <div style="height: 132px; width: 250px; margin-right: 20px">
        <el-image :src="img" fit="contain" :lazy="true"></el-image>
      </div>
      <div style="flex: 1">
        <h1>
          <nuxt-link :to="{ path: path }">{{ title }}</nuxt-link>
        </h1>
        <div class="brief">
          {{ brief }}
        </div>
        <div class="article-info">
          <i class="el-icon-view">{{ views }}</i>
          <span>&emsp;</span>
          <i class="el-icon-chat-line-square">{{ comments }}</i>
          <span>&emsp;</span>
          <i class="el-icon-thumb">{{ likes }}</i>
          <div class="time fr">{{ tools.formatDate(time) }}</div>
        </div>
      </div>
    </div>
    <el-divider></el-divider>
  </div>
</template>

<script>
export default {
  data() {
    return {
      pagination: 1,
      path:'/article/'+ this.id
    };
  },
  methods: {},
  props: {
    id: {
      type: String,
      default: "123125125",
    },
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
    views: {
      type: Number,
      default: 0,
    },
    likes: {
      type: Number,
      default: 0,
    },
    comments: {
      type: Number,
      default: 0,
    },
  },
};
</script>

<style lang="scss" scoped>
.line-box {
  h1 {
    padding: 20px 0;
    font: {
      size: 1.5rem;
      weight: 600;
    }
    &:hover {
      text-decoration: underline;
      cursor: pointer;
      
    }
  }
  .article-info {
    color: rgba(0, 0, 0, 0.6);
    font: {
      size: 0.9rem;
    }
    .time {
      cursor: pointer;
      &:hover {
        text-decoration: underline;
      }
    }
  }
  .brief {
    padding-bottom: 20px;
    font: {
      size: 0.8rem;
    }
  }
}
</style>