<template>
  <div>
      <el-dialog
        :title="'查看回复(' + actionReplyList.length + ')'"
        :visible.sync="dialogVisible"
        top="3vh"
        custom-class="reply-dialog-box"
      >
      
      </el-dialog>
  </div>
</template>

<script>
export default {
//获取屏幕高度
  mounted() {
    if (process.client) {
      //获取屏幕高度
      this.clientHeight = `${document.documentElement.clientHeight}`;
      let _this = this;
      window.onresize = function temp() {
        _this.clientHeight = `${document.documentElement.clientHeight}`;
      };
    }
  },
}
</script>

<style lang="scss" scoped>

</style>