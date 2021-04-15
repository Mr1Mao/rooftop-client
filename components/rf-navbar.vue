<template>
  <div class="container">
    <div class="header-box">
      <div class="logo" @click="redirect('/')">
        <el-image :src="url" fit="contain"></el-image>
      </div>
      <div class="nav">
        <!-- 一级菜单 -->
        <div
          class="nav-item"
          v-for="(item, index) in menuList"
          :key="index"
          @mouseover="isSelected = index"
          @mouseout="isSelected = -1"
        >
          <nuxt-link :to="item.url">{{ item.title }}</nuxt-link>
          <!-- 二级菜单 -->
          <transition name="el-fade-in-linear">
            <div v-show="isSelected == index" class="sub-menu">
              <div
                v-for="(subItem, subIndex) in item.subMenu"
                :key="subIndex"
                @mouseover="isSelectedSub = subIndex"
                @mouseout="isSelectedSub = -1"
              >
                <nuxt-link :to="subItem.url">{{ subItem.title }}</nuxt-link>
                <!-- 三级菜单 -->
                <transition name="el-fade-in-linear">
                  <div v-show="isSelectedSub == subIndex" class="mini-menu">
                    <div
                      v-for="(miniItem, miniIndex) in subItem.subMenu"
                      :key="miniIndex"
                    >
                      <nuxt-link :to="subItem.url">{{
                        miniItem.title
                      }}</nuxt-link>
                    </div>
                  </div>
                </transition>
              </div>
            </div>
          </transition>
        </div>
      </div>
      <div class="right">
        <div
          class="header-btn"
          style="padding-top: 6px"
          v-if="$store.state.isLogin"
        >
          <el-dropdown trigger="click">
            <el-avatar
              icon="el-icon-user-solid"
              :src="$store.state.userInfo.avatar"
              :size="28"
              class="el-dropdown-link"
            ></el-avatar>
            <!-- 用户下拉 -->
            <el-dropdown-menu slot="dropdown" style="margin-top: -15px">
              <el-dropdown-item
                icon="el-icon-user-solid"
                @click.native="redirect('/user/')"
              >
                个人中心
              </el-dropdown-item>
              <el-dropdown-item
                icon="el-icon-s-tools"
                @click.native="redirect('/user/settings')"
                >个人设置</el-dropdown-item
              >
              <el-dropdown-item
                icon="el-icon-edit-outline"
                @click.native="redirect('/publishing')"
                >发布文章</el-dropdown-item
              >
              <el-dropdown-item
                icon="el-icon-s-unfold"
                @click.native="handleClose()"
                divided
                >退出登录</el-dropdown-item
              >
            </el-dropdown-menu>
          </el-dropdown>
        </div>

        <div class="header-btn" @click="getLoginBox()" v-else>
          <i class="el-icon-user"></i>
        </div>
        <div class="header-btn" @click="isSearching = true">
          <i class="el-icon-search"></i>
        </div>
      </div>
    </div>
    <client-only>
      <rf-mark
        v-if="$store.state.isShowLoginBox"
        @click.native="loginClose()"
      ></rf-mark>
      <transition name="el-zoom-in-center">
        <el-card
          shadow="always"
          v-if="$store.state.isShowLoginBox"
          class="login-card"
        >
          <!-- 关闭按钮 -->
          <div class="close ar" @click="loginClose()">
            <i class="el-icon-close"></i>
          </div>
          <!-- 登录方式选择 -->
          <div class="login-choose login-box" v-if="loginType == -1">
            <div class="login-logo bc">
              <el-image :src="url" fit="contain"></el-image>
            </div>
            <el-divider>请选择登录方式</el-divider>
            <div class="login-btn">
              <div
                class="btn-item ac"
                v-for="(item, index) in loginIconLists"
                :key="index"
                @click="getLoginType(index)"
              >
                <el-image :src="item.img" fit="fill" :lazy="true"></el-image>
                <p>{{ item.text }}</p>
              </div>
            </div>
          </div>

          <!-- QQ登录 -->
          <div class="QQ-login login-box" v-else-if="loginType == 0"></div>
          <!-- 微博登录 -->
          <div
            class="microblog-login login-box"
            v-else-if="loginType == 2"
          ></div>
          <!-- 帐号登录 -->
          <div class="accounts-login login-box" v-else-if="loginType == 1">
            <p class="login-title ac">帐号登录</p>
            <!-- 表单 -->
            <el-form
              label-width="0"
              :model="loginForm"
              :rules="rules"
              ref="loginForm"
              style="padding: 0 20px"
              @submit.native.prevent
            >
              <el-form-item prop="username">
                <el-input
                  v-model="loginForm.username"
                  placeholder="请输入手机号或帐号"
                  autocomplete="on"
                  @keyup.native.enter="submitForm('loginForm')"
                ></el-input>
              </el-form-item>
              <el-form-item prop="password">
                <el-input
                  v-model="loginForm.password"
                  type="password"
                  placeholder="请输入您的密码"
                  @keyup.native.enter="submitForm('loginForm')"
                ></el-input>
              </el-form-item>
              <el-form-item>
                <p>
                  <el-button
                    :type="loginBtnType"
                    @click="submitForm('loginForm')"
                    @keyup.enter="submitForm('loginForm')"
                    style="padding: 12px; width: 100%"
                    >{{ loginBtnInfo }}</el-button
                  >
                </p>
                <p class="ac other-login" @click="getLoginType(-1)">
                  其他方式登录
                </p>
              </el-form-item>
            </el-form>
          </div>
          <!-- 微信登陆 -->
          <div class="wx-login login-box" v-else-if="loginType == 3">
            <p class="login-title ac">微信登录</p>
            <div class="ER-code bc">
              <el-image :src="ERCode" fit="contain" :lazy="true"></el-image>
            </div>
            <div class="wx-default-tip ac">
              <p>请使用微信扫描二维码登录</p>
              <p>"rooftop"</p>
            </div>
          </div>
          <div class="explain ac">
            <p>
              登录即代表你同意
              <nuxt-link to="/"><span>用户协议</span></nuxt-link>
              和
              <nuxt-link to="/"><span>隐私政策</span></nuxt-link>
            </p>
          </div>
        </el-card>
      </transition>
      <!-- 搜索框 -->
      <div class="search-box" v-if="isSearching">
        <rf-mark @click.native="isSearching = false"></rf-mark>
        <div class="search-input">
          <i class="el-icon-search icon-input"></i>
          <input
            placeholder="请输入搜索内容，敲击回车"
            v-model="searchValue"
            @keyup.enter="search()"
            type="search"
          />
        </div>
      </div>
    </client-only>
  </div>
</template>

<script>
import rfMark from "./rf-mark.vue";
export default {
  components: { rfMark },
  data() {
    //帐号格式验证
    var validateAccounts = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("帐号不能为空"));
      }
      callback();
    };
    return {
      loginBtnType: "primary",
      loginBtnInfo: "登录",
      loginForm: {
        username: "",
        password: "",
      },
      rules: {
        password: [
          { required: true, message: "密码不能为空", trigger: "blur" },
          {
            min: 6,
            max: 18,
            message: "请输入6到-18位密码",
            trigger: "blur",
          },
        ],
        username: [{ validator: validateAccounts, trigger: "blur" }],
      },
      menuList: [
        {
          title: "首页",
          url: "/",
          subMenu: [],
        },
        {
          title: "主题",
          url: "#",
          subMenu: [
            {
              title: "子菜单一",
              url: "#",
              subMenu: [
                { title: "最小菜单1", url: "#" },
                { title: "最小菜单2", url: "#" },
              ],
            },
            {
              title: "子菜单二",
              url: "#",
              subMenu: [{ title: "最小菜单3", url: "#" }],
            },
          ],
        },
        {
          title: "博客",
          url: "/blog",
          subMenu: [
            { title: "子菜单一", url: "#", subMenu: "" },
            { title: "子菜单二", url: "#", subMenu: "" },
            { title: "子菜单三", url: "#", subMenu: "" },
          ],
        },
        {
          title: "关于",
          url: "#",
          subMenu: [
            { title: "子菜单一", url: "#", subMenu: "" },
            { title: "子菜单二", url: "#", subMenu: "" },
            { title: "子菜单三", url: "#", subMenu: "" },
          ],
        },
        {
          title: "留言",
          url: "#",
          subMenu: [
            { title: "子菜单一", url: "#", subMenu: "" },
            { title: "子菜单二", url: "#", subMenu: "" },
            { title: "子菜单三", url: "#", subMenu: "" },
          ],
        },
        {
          title: "其他",
          url: "#",
          subMenu: [
            { title: "子菜单一", url: "#", subMenu: "" },
            { title: "子菜单二", url: "#", subMenu: "" },
            { title: "子菜单三", url: "#", subMenu: "" },
          ],
        },
      ],
      isSelected: -1,
      isSelectedSub: -1,
      url: "/rooftop.png",
      ERCode:
        "https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=4259430548,1517019785&fm=11&gp=0.jpg",
      // showLoginBox: false,
      isSearching: false,
      searchValue: "",
      loginType: -1,
      loginIconLists: [
        { img: "/QQ-login.png", text: "QQ登录/注册" },
        { img: "/accounts-login.png", text: "帐号登录" },
        { img: "/microblog-login.png", text: "微博登录/注册" },
      ],
      dialogVisible: false,
    };
  },
  methods: {
    //提交表单
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          //登录操作
          // console.log("submitForm",this.loginForm)
          this.login(this.loginForm);
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    redirect(path) {
      this.$router.push({ path: path });
    },
    getLoginBox() {
      this.loginType = -1;
      this.initFromView();
      this.$store.commit("updateShowLoginBox", true);
    },
    loginClose() {
      this.$store.commit("updateShowLoginBox", false);
    },
    search() {
      console.log(this.searchValue);
    },
    getLoginType(index) {
      this.initFromView();
      this.loginType = index;
    },
    // 表单界面初始化
    initFromView() {
      (this.loginBtnType = "primary"),
        (this.loginBtnInfo = "登录"),
        (this.loginForm.username = "");
      this.loginForm.password = "";
    },
    //关闭退出登录弹窗
    handleClose() {
      this.$confirm("确认退出登录？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "info",
        callback: (action) => {
          if (action === "confirm") {
            // console.log("按下 确定");
            if (this.$store.state.isLogin) {
              this.logout();
            }
          } else {
            console.log("按下 取消");
          }
        },
      });
    },
    //获取用户信息
    async getUser() {
      let response = await this.$request.getUser();
      if (response.status == 200 && response.data.status == 0) {
        this.$store.commit("getUserInfo", response.data.data);
      } else {
        console.log(response.message);
      }
    },
    //注销操作
    async logout() {
      // console.log("退出");
      try {
        let response = await this.$request.logout();
        if (response.status == 200) {
          this.$message({
            message: "注销成功",
          });
        } else if (response.status == 10001) {
          this.$message({
            message: "注销失败，身份认证失败",
            type: "error",
          });
        }
      } catch (err) {
        // console.log("注销异常", err);
        if (err.response.data.status == 403) {
          this.$message({
            message: "请勿重复注销",
            type: "error",
          });
        } else {
          this.$message({
            message: "注销失败，请重试",
            type: "error",
          });
        }
      }
      //删除本地初始化缓存
      let auth = {
        accessToken: "",
        refreshToken: "",
        tokenType: "bearer",
        scope: "all",
      };
      this.$router.push({ path: "/" });
      this.$store.commit("updateAuth", auth);
      this.$store.commit("getUserInfo", "");
      this.$store.commit("updateLoginstatus", false);
    },
    //登录
    async login(data) {
      try {
        data["grant_type"] = this.$store.state.auth.grant_type;
        data["client_secret"] = this.$store.state.auth.client_secret;
        data["client_id"] = this.$store.state.auth.client_id;
        data["scope"] = this.$store.state.auth.scope;
        let response = await this.$request.login(data);

        if (response.status == 200 && response.data.status == 0) {
          this.loginClose();
          this.$store.commit("updateLoginstatus", true);
          let auth = {
            accessToken: response.data.data.access_token,
            refreshToken: response.data.data.refresh_token,
            tokenType: "Bearer",
            scope: "all",
          };
          this.$store.commit("updateAuth", auth);
          this.getUser();
        } else {
          this.loginBtnInfo = "登陆失败";
          this.loginBtnType = "danger";
        }
      } catch (err) {
        let res = err.response.data;
        console.log("登录失败", res);

        if (res.status == 401 && res.error_description == "Bad credentials") {
          this.loginBtnInfo = "用户名 或 密码错误，请重新登录";
          this.loginBtnType = "danger";
        } else {
          this.loginBtnInfo = "登陆失败，未知错误";
          this.loginBtnType = "danger";
        }
      }
    },
  },
  watch: {
    // $route: "loginClose",
  },
};
</script>

<style lang="scss" scoped>
.search-input {
  height: 50px;
  width: 650px;
  margin: auto;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 999;
  .icon-input {
    color: rgba($color: #fff, $alpha: 0.7);
    position: absolute;
    font-size: 1.5rem;
    line-height: 50px;
    left: 15px;
  }
  input {
    width: 100%;
    height: 100%;
    border-radius: 30px;
    padding-left: 50px;
    padding-right: 10px;
    background-color: rgba($color: #7f7f7f, $alpha: 0.7);
    color: white;
    font: {
      size: 1.2rem;
    }
    &::-webkit-input-placeholder {
      color: rgba($color: #fff, $alpha: 0.5);
      font-style: italic;
    }
  }
}
.login-logo {
  // margin-top: 10px;
  width: 250px;
}
.login-card {
  height: 450px;
  width: 450px;
  margin: auto;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 999;
  .login-box {
    height: 380px;
  }
  .other-login {
    margin-top: 20px;
    color: rgba(0, 0, 0, 0.7);
    cursor: pointer;
    &:hover {
      color: #409eff;
      text-decoration: underline;
    }
  }

  .login-btn {
    display: flex;
    justify-content: space-between;
    padding: 0 50px;
    padding-top: 35px;
    .btn-item {
      opacity: 0.3;
      cursor: pointer;
      font-size: 0.7rem;
      p {
        margin: 10px 0;
      }
      &:hover {
        opacity: 1;
      }
      .el-image {
        width: 60px;
        height: 60px;
      }
    }
  }
  .close {
    font-size: 1.3rem;
    cursor: pointer;
  }
  .login-title {
    padding: 20px 0;
    margin-bottom: 40px;
    font: {
      size: 1.4rem;
      weight: 600;
    }
  }
  .ER-code {
    width: 160px;
    height: 160px;
    border: 1px solid rgba($color: #000000, $alpha: 0.3);
    padding: 3px;
  }
  .wx-default-tip {
    margin: 20px 0;
    font-size: 0.9rem;
  }
  .explain {
    font-size: 0.7rem;
    color: rgba($color: #000000, $alpha: 0.7);
    // margin-top: 70px;
    margin-bottom: 20px;
    a {
      color: black;
      text-decoration: underline;
      &:hover {
        font-weight: 600;
      }
    }
  }
}

.container {
  width: 100%;
  background-color: $header_bgc;
  height: 65px;
  // box-shadow: 0 0 30px 0 rgba(0,0,0,.05);
  //字体设置
  font: {
    family: $def_font_family, PingFang SC, sans-serif;
    size: 1rem;
    color: #232323;
    weight: 400;
  }

  .header-box {
    height: 100%;
    width: 1200px;
    display: flex;
    margin: 0 auto;

    .logo {
      width: 150px;
      cursor: pointer;
    }

    .nav {
      height: 100%;
      text-align: center;
      display: flex;
      flex: 1;
      .nav-item {
        line-height: 60px;
        height: 100%;
        padding: 0 30px;
        cursor: pointer;
        //子菜单
        .sub-menu {
          position: absolute;
          z-index: 99;
          background-color: #333;
          width: 210px;
          text-align: left;
          padding: 0 20px;
          a {
            color: white;
            opacity: 0.8;
            &:hover {
              opacity: 1;
            }
          }
        }
        .mini-menu {
          @extend .sub-menu;
          margin-left: 230px;
          margin-top: -30px;
        }
      }
    }

    .right {
      width: 220px;
      height: 100%;
      text-align: center;
      display: flex;
      .header-btn {
        // width: 100px;
        padding: 0 20px;
        height: 100%;
        cursor: pointer;
        font-size: 1.5rem;
        line-height: 60px;

        &:hover {
          color: #767676;
        }
      }
    }
  }
}
</style>