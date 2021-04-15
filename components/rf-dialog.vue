<template>
  <div class="contain-verify">
    <el-dialog
      :title="title[0]"
      :visible="isVisible"
      width="25%"
      label-position="top"
      :before-close="onBeforeClose"
      @close="closeDialog(0)"
    >
      <el-form :model="dialogForm" :rules="dialogRules" ref="dialogForm">
        <el-form-item prop="EMail">
          <el-input
            v-model="dialogForm.EMail"
            autocomplete="off"
            placeholder="邮箱地址"
            suffix-icon="el-icon-message"
          ></el-input>
        </el-form-item>
        <el-from-item prop="code">
          <p style="display: flex">
            <el-input
              v-model="dialogForm.code"
              placeholder="验证码"
              suffix-icon="el-icon-check"
              style="margin-right: 10px"
            ></el-input>
            <el-button
              type="primary"
              style="width: 30%"
              @click="sendEMail('dialogForm')"
              :disabled="!sendBtnEnable"
              >{{ sendBtnTitle }}</el-button
            >
          </p>
        </el-from-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="closeDialog(1)" style="width: 100%">{{
          submitBtnTitle
        }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      title: ["邮箱验证", "手机验证"],
      dialogForm: {
        EMail: "",
        code: "",
      },
      sendBtnTitle: "发 送",
      sendBtnEnable: true,
      submitBtnTitle: "确 定",
      seconds: 59,
      dialogRules: {
        EMail: [
          { required: true, message: "请输入邮箱地址", trigger: "blur" },
          {
            type: "email",
            message: "请输入正确的邮箱地址",
            trigger: ["blur", "change"],
          },
        ],
        code: [
          // { required: true, message: "请输入验证码", trigger: "blur" }
        ],
      },
    };
  },
  methods: {
    closeDialog(numType) {
      if (this.dialogForm.EMail != "" && numType == 1) {
        this.bindEMail(this.dialogForm.code);
      } else {
        this.$emit("update:isVisible");
      }
    },
    sendEMail(form) {
      this.$refs[form].validate((valid) => {
        if (valid) {
          this.send();
          this.sendBtnTitle = "重 发(" + this.seconds + ")s";
          this.sendBtnEnable = false;
          this.timer();
        }
      });
    },
    async send() {
      try {
        let response = await this.$request.sendEMail({
          EMail: this.dialogForm.EMail,
        });
        if (response.data.status == 0) {
        } else {
          this.sendBtnTitle = response.data.message;
        }
      } catch (error) {
        this.sendBtnTitle = "发送失败";
      }
    },
    //绑定邮箱
    async bindEMail(code) {
      try {
        let response = await this.$request.bindEmail({
          code: code,
        });
        if (response.data.status == 0) {
          this.$store.commit("updateEmail", this.dialogForm.EMail);
          this.$message({
            message: "绑定成功",
            type: "success",
          });
          this.$emit("update:isVisible");
        } else {
          this.submitBtnTitle = response.data.message;
        }
      } catch (error) {
        this.submitBtnTitle = "认证错误";
      }
    },
    num(n) {
      // 倒计时结束重新刷新页面
      if (this.seconds === 0) {
        this.sendBtnTitle = "发 送";
        this.sendBtnEnable = true;
      }
      return n < 10 ? "0" + n : "" + n;
    },
    // 倒数计
    timer() {
      this.seconds = 59;
      var _this = this;
      var time = window.setInterval(function () {
        if (_this.seconds === 0) {
          _this.seconds = 0;
          window.clearInterval(time);
        } else {
          _this.seconds -= 1;
          _this.sendBtnTitle = "重 发(" + _this.seconds + ")s";
        }
      }, 1000);
    },
    onBeforeClose(done) {
      this.dialogForm.EMail = "";
      this.dialogForm.code = "";
      done();
    },
  },
  watch: {
    second: {
      handler(newVal) {
        this.num(newVal);
      },
    },
  },
  computed: {
    second: function () {
      return this.num(this.seconds);
    },
  },
  props: {
    isVisible: {
      type: Boolean,
      default: false,
    },
  },
};
</script>

<style lang="scss" scoped>
</style>