<template>
  <div>
    <!-- <el-card> -->
    <!-- <p>头像添加</p> -->
    <el-upload
      class="avatar-uploader"
      :action="uploadUrl"
      :show-file-list="false"
      :on-success="handleAvatarSuccess"
      :on-remove="handleRemove"
      :on-error="onError"
      :before-upload="beforeAvatarUpload"
      :headers="headers"
      ref="upload"
    >
      <img v-if="imageUrl" :src="imageUrl" class="avatar" />
      <span
        v-if="imageUrl"
        class="el-upload-action"
        @click.stop="handleRemove()"
      >
        <i class="el-icon-delete"></i>
      </span>
      <i v-else class="el-icon-upload2 avatar-uploader-icon" stop></i>
    </el-upload>
    <!-- </el-card> -->
  </div>
</template>

<script>
export default {
  data() {
    return {
      imageUrl: this.$store.state.userInfo.avatar,
      uploadUrl: "http://localhost:8081/user/avatar",
      headers: {
        Authorization:
          this.$store.state.auth.tokenType +
          " " +
          this.$store.state.auth.accessToken,
      },
    };
  },
  methods: {
    // 移除图片
    handleRemove() {
      this.imageUrl = "";
    },
    // 上传成功回调
    handleAvatarSuccess(res, file) {
      // console.log(file)
      if (res.status == 0) {
        this.$store.commit("updateAvatar", res.data.imgUrl);
        this.imageUrl = URL.createObjectURL(file.raw);
      } else {
        this.$message({
          message: "头像修改失败",
          type: "error",
        });
      }
    },
    // 上传前格式和图片大小限制
    beforeAvatarUpload(file) {
      const typeList = ["image/jpeg","image/jpg","image/webp","image/png"]
      const type = typeList.indexOf(file.type)
      console.log(type);
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (type == -1) {
        this.$message({
          message: "图片格式不正确!(只能包含jpg，png，webp，JPEG)",
          type: "error",
        });
        //取消上传
      }
      if (!isLt2M) {
        this.$message({
          message: "上传图片大小不能超过 2MB!",
          type: "error",
        });
         //取消上传
      }
      return type != -1 && isLt2M;
    },
    // 头像上传失败回调
    onError(res) {
      this.$message({
        message: "头像修改失败",
        type: "error",
      });
    },
  },
  props: {
    // imageUrl: {
    //   type: String,
    //   default: "",
    // },
    // headers: {
    //   type: Object,
    //   default: {},
    // },
    size: {
      type: String,
      default: "90px",
    },
  },
};
</script>

<style lang="scss" scoped>
.avatar-uploader {
  width: 90px;
  height: 90px;
  // border: 3px solid gray;
  border-radius: 50%;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  background: url("../static/accounts-login.png") no-repeat;
  background-size: 100% 100%;
}
.avatar-uploader-icon {
  font-size: 0;
  color: #fff;
  width: 90px;
  height: 90px;
  line-height: 90px;
  text-align: center;
}
.avatar-uploader-icon:hover {
  font-size: 28px;
  background-color: rgba(0, 0, 0, 0.3);
}
.avatar {
  position: relative;
  width: 90px;
  height: 90px;
  display: block;
}
.el-upload-action {
  position: absolute;
  top: 0;
  left: 0;
  display: block;
  width: 100%;
  height: 100%;
  font-size: 0;
  color: #fff;
  text-align: center;
  line-height: 90px;
}
.el-upload-action:hover {
  font-size: 20px;
  background-color: #000;
  background-color: rgba(0, 0, 0, 0.3);
}
</style>