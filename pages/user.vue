<template>
  <div class="container">
    <rf-banner :isSlot="true">
      <div class="user-banner w">
        <el-avatar
          icon="el-icon-user-solid"
          :size="100"
          shape="circle"
          :src="$store.state.userInfo.avatar"
          fit="fill"
        ></el-avatar>
        <h1 class="username">{{ $store.state.userInfo.username }}</h1>
      </div>
    </rf-banner>

    <div class="content w">
      <el-tabs style="" @tab-click="handleClick" :value="currentTab">
        <el-tab-pane
          :label="item.label"
          v-for="(item, index) in labelPages"
          :key="index"
          :name="'/user' + item.path"
        >
        </el-tab-pane>
        <div style="height: 40px"></div>
        <nuxt-child keep-alive></nuxt-child>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import rfBanner from "../components/rf-banner.vue";

export default {
  components: { rfBanner },
  middleware: 'auth',
  created: function () {
    if (
      this.$nuxt.$route.path == "/user/" ||
      this.$nuxt.$route.path == "/user"
    ) {
      console.log("created", this.$nuxt.$route.path);
      this.$router.push("/user/myArticles"); // 页面加载时跳转
    }
  },
  data() {
    return {
      labelPages: [
        { label: "文章管理", path: "/myArticles" },
        { label: "个人设置", path: "/settings" },
        { label: "评论管理", path: "/myComments" },
        { label: "我的关注", path: "/myFollows" },
        { label: "我的收藏", path: "/myFavorites" },
      ],
      currentTab: this.$nuxt.$route.path,
    };
  },
  methods: {
    handleClick(tab) {
      let path = "/user" + this.labelPages[tab.index].path;
      this.$router.push({ path: path });
    },
  },
  watch: {
    $route: {
      handler: function (val, oldVal) {
        // console.log('111',val.path)
        if (
          val.path == "/user/" ||
          val.path== "/user"
        ) {
          console.log("watch",val.path);
          this.$router.push("/user/myArticles"); // 页面加载时跳转
        }

        this.currentTab = val.path;
      },
      // 深度观察监听
      // deep: true,
    },
  },
};
</script>

<style lang="scss" scoped>
.container {
  background-color: #fff;
  .user-banner {
    padding-top: 105px;
    .username {
      padding-top: 50px;
    }
  }

  .content {
    padding: 80px 0;
    min-height: 500px;
    .el-tabs {
      font: {
        // font-family: $def_font_family !important;
      }
    }
  }
}
</style>

<style lang="scss">
.el-tabs {
  font: {
    family: $def_font_family !important;
    size: 1rem;
  }
  .el-tabs__item:hover {
    color: #303133;
    cursor: pointer;
  }

  .el-tabs__item.is-active {
    color: #303133;
    font: {
      weight: 600;
    }
  }

  .el-tabs__active-bar {
    background-color: #303133;
  }
}
</style>