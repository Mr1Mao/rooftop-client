<template>
  <div class="sub-comments">
    <el-avatar
      icon="el-icon-user-solid"
      :src="$store.state.userInfo.avatar"
      :size="40"
      class="rf-avatar"
    ></el-avatar>
    <div class="comment">
      <div class="comment-info">
        <div class="from">
          {{ reply.fromUser.username + " 回复 " + reply.toUser.username }}
        </div>
        <div class="time">{{ tools.formatDate(reply.replyTime) }}</div>
      </div>
      <div class="content">
        {{ reply.content }}
      </div>
      <div class="interaction">
        <div class="item">
          <i class="el-icon-star-off"> 66 </i>
        </div>
        <div class="item">
          <i
            class="el-icon-s-flag"
            v-if="reply.fromUser.userId == $store.state.userInfo.userId"
          >
            删除
          </i>
        </div>
        <div class="item sub-hover">
          <i class="el-icon-s-promotion" @click="showReplyBox()">
            <!-- {{ replayBoxAction == item ? "取消回复" : "回复" }} -->
            回复
          </i>
        </div>
        <div class="item sub-hover">
          <i class="el-icon-s-flag"> 举报 </i>
        </div>
      </div>

      <el-divider></el-divider>
    </div>
  </div>
</template>

<script>
import rfReplyBox from "./rf-reply-box.vue";
export default {
  components: { rfReplyBox },
  data() {
    return {
      // from:"Mao"
    };
  },
  methods: {
    showReplyBox() {
      this.replyBody.replyType = 1;
      this.replyBody.replyId = this.reply.id;
      this.replyBody.toUserId = this.reply.fromUser.userId;
      this.replyBody.toUserName = this.reply.fromUser.username;
      this.replyBody.toUserAvatar = this.reply.fromUser.avatar;

      this.$emit("update:replyBody", this.replyBody);
      // this.$emit("update:replyType", 1);
      // this.$emit("update:toUserId", this.reply.fromUser.userId);
      // this.$emit("update:toUserName", this.reply.fromUser.username);
    },
  },
  props: {
    // text: String,
    // replyTo: String,
    // from:String,
    reply: Object,
    replyId: {
      type: String,
    },
    replyType: {
      type: Number,
      default: 0,
    },
    toUserId: String,
    toUserName: String,
    replyBody: Object,
  },
};
</script>

<style lang="scss" scoped>
.sub-comments {
  padding: 10px 0 0 0;
  display: flex;
  .el-divider {
    margin: 15px 0;
  }
  .rf-avatar {
    margin: 0 20px;
  }

  &:hover .sub-hover {
    display: block !important;
  }
  .item {
    cursor: pointer;
    padding: 0 10px;
    color: gray;
    font: {
      size: 0.9rem;
      weight: 800;
    }
    &:hover {
      color: #232323;
    }
  }
  .comment {
    flex: 1;
    .comment-info {
      height: 40px;
      font: {
        size: 0.9rem;
      }
    }
    .content {
      padding: 10px 0 10px 0;
      font: {
        weight: 400;
      }
    }
    .interaction {
      display: flex;
      flex-direction: row-reverse;

      .sub-hover {
        display: none;
      }
    }
  }
}
</style>