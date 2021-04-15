<template>
  <div class="container">
    <el-form
      ref="form"
      :model="form"
      label-width="130px"
      label-position="left"
      style="width: 650px; margin: 0 auto"
      :rules="rules"
    >
      <el-form-item label="头像">
        <!-- 头像上传 -->
        <rf-avatar-upload />
      </el-form-item>
      <el-form-item label="帐号">
        <el-input v-model="form.accounts" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="昵称" prop="username">
        <el-input v-model="form.username"></el-input>
      </el-form-item>
      <el-form-item label="修改密码">
        <el-input
          type="password"
          v-model="password"
          :disabled="true"
        ></el-input>
        <span>&emsp;&emsp;</span>
        <el-button
          type="text"
          size="default"
          @click="updatePassword()"
          class="text-btn"
          >修改密码</el-button
        >
      </el-form-item>
      <el-form-item label="电子邮件">
        <div v-if="EMail != ''">
          <el-input v-model="EMail" :disabled="true"></el-input>
          <span>&ensp;</span>
          <i class="el-icon-circle-check"></i>
          <span>&ensp;</span>
          <el-button
            type="text"
            size="default"
            @click="unbind(0)"
            class="text-btn"
            >解除绑定</el-button
          >
        </div>
        <el-button type="info" size="small" @click="bind(0)" plain round v-else
          >绑定邮箱</el-button
        >
      </el-form-item>
      <el-form-item label="手机">
        <div v-if="phone != ''">
          <el-input v-model="phone" :disabled="true"></el-input>
          <span>&ensp;</span>
          <i class="el-icon-circle-check"></i>
          <span>&ensp;</span>
          <el-button
            type="text"
            size="default"
            @click="bind(1)"
            class="text-btn"
            >更换绑定</el-button
          >
        </div>
        <el-button type="info" size="small" @click="bind(1)" plain round v-else
          >绑定手机</el-button
        >
      </el-form-item>

      <el-form-item label="性别">
        <el-radio-group v-model="form.gender">
          <el-radio
            :label="index"
            v-for="(item, index) in genderType"
            :key="index"
            >{{ item }}</el-radio
          >
        </el-radio-group>
      </el-form-item>
      <el-form-item label="个人简介">
        <el-input
          type="textarea"
          v-model="form.resume"
          :autosize="{ minRows: 5, maxRows: 5 }"
          placeholder="填写您的个人简介"
        ></el-input>
      </el-form-item>
      <!-- 第三方帐号绑定 -->
      <el-form-item label="第三方帐号">
        <div class="social-accounts">
          <div
            class="bind-box ac"
            v-for="(item, index) in bindAccounts"
            :key="index"
          >
            <el-image
              :src="item.img"
              fit="fill"
              style="width: 30px; height: 30px"
            ></el-image>

            <div class="fr bind-info" v-if="socialAccountState[index].state">
              <p>{{ socialAccountState[index].socialAccount.username }}</p>
              <p @click="unbind(1, index)">(解绑)</p>
            </div>
            <el-button
              type="text"
              size="default"
              class="fr"
              style="padding: 9px"
              v-else
              @click="bind(2, index)"
              >{{ item.text }}</el-button
            >
          </div>
        </div>
      </el-form-item>
      <!-- 提交按钮 -->
      <el-form-item style="margin: 0 auto" label-width="200px">
        <el-button
          type="primary"
          @click="onSubmit('form')"
          style="padding-left: 40px; padding-right: 40px"
          round
          >保存</el-button
        >
      </el-form-item>
    </el-form>
    <rf-dialog :isVisible.sync="dialogVisible"> </rf-dialog>
  </div>
</template>

<script>
import rfAvatarUpload from "../../components/rf-avatar-upload.vue";
import RfDialog from "../../components/rf-dialog.vue";

export default {
  components: { rfAvatarUpload, RfDialog },
  transition: "labelPage",
  //   async asyncData(context) {
  //   // console.info("index", context);
  //   try {
  //     let response = await this.$request.getUser();
  //     if (response.status == 200 && response.data.status == 0) {
  //       this.$store.commit("getUserInfo", response.data.data);
  //     }
  //     // return { articlesData: res.data.data };
  //   } catch (err) {
  //     console.info(err);
  //   }
  // },
  data() {
    return {
      form: {
        accounts: this.$store.state.userInfo.accounts,
        username: this.$store.state.userInfo.username,
        gender: this.$store.state.userInfo.gender,
        resume: this.$store.state.userInfo.resume,
        avatar: this.$store.state.userInfo.avatar,
      },
      password: "00000000",
      // EMail: this.$store.state.userInfo.email,
      phone: this.$store.state.userInfo.phone,
      acceptTypes: ["image/jpeg", "image/jpg", "image/png"],
      genderType: ["女", "男", "保密"],
      fileList: [],
      bindAccounts: [
        { img: "/QQ-login.png", text: "绑定QQ" },
        { img: "/accounts-login.png", text: "绑定微信" },
        { img: "/microblog-login.png", text: "绑定微博" },
      ],
      socialAccountState: [
        {
          index: 0,
          state: true,
          socialAccount: {
            username: "魏洋",
          },
        },
        {
          index: 1,
          state: false,
          socialAccount: {
            username: "Brian Martin",
          },
        },
        {
          index: 2,
          state: true,
          socialAccount: {
            username: "Barbara Taylor",
          },
        },
      ],
      rules: {
        username: [
          { required: true, message: "用户名不能为空", trigger: "blur" },
        ],
      },
      rusultMsg: {
        type: "success",
        message: "保存成功",
      },
      dialogVisible: false,
    };
  },
  methods: {
    //点级保存按钮
    onSubmit(form) {
      this.$refs[form].validate((valid) => {
        if (valid) {
          this.$confirm("确定保存已修改选项？", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "info",
            callback: (action) => {
              if (action === "confirm") {
                //提交表单
                let params = {
                  username: this.form.username,
                  userId: this.$store.state.userInfo.userId,
                  gender: this.form.gender,
                  resume: this.form.resume,
                };

                //参数合法性判断
                if (
                  params.username == "" ||
                  params.username == "" ||
                  params.gender == "" ||
                  params.resume == ""
                ) {
                  this.rusultMsg.type = "error";
                  this.rusultMsg.message = "必填选项不能为空！";
                  return false;
                }
                this.putUser(params);
                this.$message({
                  message: this.rusultMsg.message,
                  type: this.rusultMsg.type,
                });

                // console.log("submit!", form);
              } else {
                console.log("按下 取消");
              }
            },
          });
        } else {
          // console.log("not1111", this.form);
          return false;
        }
      });
    },
    // handlePictureCardPreview(file) {
    //     this.form.avatar = file.url;
    //     console.log(this.form.avatar)
    //     // this.dialogVisible = true;
    //   },
    //获取用户信息
    async getUser() {
      let response = await this.$request.getUser();
      if (response.status == 200 && response.data.status == 0) {
        this.$store.commit("getUserInfo", response.data.data);
      } else {
        console.log(response.message);
      }
    },
    //提交表单信息
    async putUser(data) {
      // 发送请求
      try {
        let response = await this.$request.updateUserInfo(data);
        if (!response.data.status == 0) {
          console.log(response.message);
          this.rusultMsg.type = "error";
          this.rusultMsg.message = response.message;
        } else {
          this.getUser();
        }
      } catch (error) {
        this.rusultMsg.type = "error";
        this.rusultMsg.message = error;
      }
    },
    //type： 0解绑邮箱   1解绑社交帐号
    unbind(type, index) {
      this.$confirm("是否确定解除绑定？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "info",
        callback: (action) => {
          if (action === "confirm") {
            if (type == 0) {
              if (this.EMail != "") {
                this.EMail = "";
                this.unbindEMail();
                //解除邮箱绑定操作
              }
            } else if (type == 1) {
              this.unbindAccounts(index);
            }
          } else {
            console.log("按下 取消");
          }
        },
      });
    },
    //绑定方法，type:0为邮箱  1为手机  2为社交帐号
    bind(type, index) {
      if (type == 0) {
        this.dialogVisible = true;
        this.EMail = this.$store.state.userInfo.email;
      } else if (type == 1) {
        //绑定操作
        //暂时先这么写

        this.phone = this.$store.state.userInfo.phone;
        this.$message({
          message: "绑定成功",
          type: "success",
        });
      } else if (type == 2) {
        this.socialAccountState[index].state = true;
        this.$message({
          message: "绑定成功",
          type: "success",
        });
      }
    },
    //解绑邮箱
    async unbindEMail() {
      try {
        let response = await this.$request.unbindEMail({});
        if (response.data.status == 0) {
          this.$store.commit("updateEmail", "");
        } else {
          console.log(response.data.message);
        }
      } catch (error) {
        // this.submitBtnTitle = "认证错误";
        console.log(error);
      }
    },
    // 解绑第三方帐号  type: 0==QQ ,1==微信, 2==微博
    unbindAccounts(type) {
      this.socialAccountState[type].state = false;
      if (this.socialAccountState[type].state == false) {
        this.$message({
          message: "解除绑定成功",
          type: "success",
        });
      }
    },
    //修改密码
    updatePassword() {},
    // closeDialog(val){
    //   this.dialogVisible = val;
    // }
  },
  computed: {
    //  ...mapState({
    EMail: {
      set(){},
      get(){
        return this.$store.state.userInfo.email;
      }
    },
    // }),
  },
  // watch:{
  //   EMail(val,oldVal){

  //   }
  // }
};
</script>

<style lang="scss" scoped>
.container {
  min-height: 500px;
  .el-input,
  .el-textarea {
    width: 380px;
  }
  .el-form-item {
    .text-btn {
      display: none;
    }
    &:hover {
      .text-btn {
        display: inline;
      }
    }
    .social-accounts {
      display: flex;
      justify-content: space-between;
      padding-top: 20px;
      .bind-box {
        // display: flex;
        // p {
        //   // line-height: 30px;
        //   font: {
        //     size: 0.9rem;
        //   }
        // }
        .bind-info {
          height: 40px;
          margin-top: -5px;
          margin-left: 7px;
          p {
            line-height: 20px;
          }
          p:nth-child(2) {
            color: #76839b;
            cursor: pointer;
          }
        }
      }
    }
  }
}
</style>