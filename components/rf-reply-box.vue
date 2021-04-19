<template>
  <div class="reply" v-if="actionId == toId">
    <div :class="{ 'flex': !isCancelBtn }">
      <!-- 模式一 -->
      <div style="display: flex" v-if="isCancelBtn">
        <el-avatar
          icon="el-icon-user-solid"
          :src="$store.state.userInfo.avatar"
          :size="30"
          style="margin: 0 10px 0 0"
        ></el-avatar>
        <el-input
          style="flex: 1"
          type="textarea"
          :autosize="{ minRows: 1, maxRows: 4 }"
          :placeholder="'回复' + replyTo"
          v-model="text"
        >
        </el-input>
      </div>

      <!-- 模式二 -->
      <el-avatar
        v-if="!isCancelBtn"
        icon="el-icon-user-solid"
        :src="$store.state.userInfo.avatar"
        :size="30"
        style="margin: 0 10px 0 0"
      ></el-avatar>
      <el-input
        v-if="!isCancelBtn"
        style="flex: 1"
        type="textarea"
        :autosize="{ minRows: 1, maxRows: 4 }"
        :placeholder="'回复' + replyTo"
        v-model="text"
      >
      </el-input>

      <div :class="[!isCancelBtn ? 'replybtn' : 'replybtn2']">
        <el-button type="primary" :size="btnSize" @click="submit()" round
          >发布</el-button
        >
        <el-button
          type="info"
          :size="btnSize"
          @click="cancel()"
          v-if="isCancelBtn"
          round
          plain
          >取消</el-button
        >
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      text: "",
    };
  },
  methods: {
    submit() {},
    cancel() {
      this.$emit("update:actionId", "-1");
    },
  },
  props: {
    replyTo: String,
    toId: String,
    actionId: String,
    isCancelBtn: {
      type: Boolean,
      default: false,
    },
    btnSize: {
      type: String,
      default: "small",
    },
  },
};
</script>

<style lang="scss" scoped>
.replybtn2 {
  margin: 10px;

  text-align: right;
}
.replybtn {
  margin: 0 10px;
}

.rf-avatar {
  margin: 0 20px;
}

.flex {
  display: flex;
}

 .reply {
    margin: 20px 0 0 0;

      }
</style>