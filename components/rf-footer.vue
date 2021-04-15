<template>
  <div class="footer">
    <div class="footer-content w">
      <div class="footer-left">
        <div class="logo" style="width: 150px" @click="redirect()">
          <el-image :src="url" fit="contain"></el-image>
        </div>
        <div class="introduce">一个简洁的，技术交流，学习的交流平台。</div>
      </div>
      <div class="footer-center">
        <div class="footer-title">目录</div>
        <ul class="footer-nav">
          <li
            class="footer-nav-item"
            v-for="(item, index) in menuList"
            :key="index"
          >
            <nuxt-link to="/">{{ item }}</nuxt-link>
          </li>
        </ul>
      </div>
      <div class="footer-right">
        <div class="footer-title">搜索</div>
        <div style="margin: 20px 0; width: 300px">
          <el-input placeholder="请输入内容" v-model="input">
            <template slot="append"><i class="el-icon-search"></i></template>
          </el-input>
        </div>
        <div class="footer-title">联系我</div>

        <div class="contact">
          <el-image
            class="contact-item"
            :src="item"
            fit="contain"
            v-for="(item, index) in contact"
            :key="index"
          ></el-image>
        </div>
      </div>
    </div>
    <div class="footer-bottom">
      <p class="w">
        &copy Copyright 2021 rooftop Mao-BY-NC-SA 4.0 .Theme DukeYin by Duke Yin
        All ights reserved.-滇ICP备14003777号-6
      </p>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      url: "/rooftop2.png",
      menuList: ["首页", "主题", "博客", "关于", "留言", "其他"],
      input: "",
      contact: ["/GitHub.png", "/qq.png", "/weChat.png", "/microblog.png"],
    };
  },
  methods: {
    redirect() {
      this.$router.push({ path: "/" });
    },
  },
};
</script>

<style lang="scss" scoped>
.footer {
  background-color: $basic_color;
  color: #f5f5f5;

  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;

  font: {
    size: 1rem;
    family: $def_font_family;
  }
  .footer-content {
    // height: 300px;
    padding: 70px 0;
    display: flex;
    justify-content: center;
    .logo {
      cursor: pointer;
    }
    .footer-left,
    .footer-center,
    .footer-right {
      flex: 1;
      margin: 0 20px;
      // background-color: red;
    }
    .footer-title {
      margin-top: 20px;
      color: white;
      font: {
        size: 1.1rem;
        weight: 600;
      }
    }
    .footer-nav {
      margin-top: 20px;
      margin-left: 40px;
      a {
        font-size: 1rem;
        color: rgba($color: #fff, $alpha: 0.5);
        &:hover {
          color: white;
        }
      }

      .footer-nav-item {
        padding: 4px 0;
        //   list-style:disc
      }
    }

    .contact {
      display: flex;
      margin-top: 20px;
      .contact-item {
        width: 20px;
        height: 20px;
        cursor: pointer;
        margin: 10px;
        // flex: 1;
        opacity: 0.5;

        &:hover {
          opacity: 1;
        }
      }
    }
  }
  .footer-bottom {
    height: 100px;
    background-color: #1e1e1e;
    color: #767676;

    p {
      padding-top: 30px;
      font: {
        size: 0.8rem;
        weight: 600;
        family: $def_font_family;
      }
    }
  }
}
</style>