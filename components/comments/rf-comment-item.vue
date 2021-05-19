<template>
  <div id="comment-item">
    <el-avatar
      icon="el-icon-user-solid"
      :src="fromUser.avatar"
      :size="40"
      style="margin: 0 20px"
    ></el-avatar>
    <div id="comment">
      <div class="comment-info">
        <div class="from">{{ title }}</div>
        <div class="time">{{ tools.formatDate(createTime) }}</div>
      </div>
      <div class="content">
        {{ comment.content }}
      </div>
      <div class="interaction">
        <div class="interaction-item">
          <i
            class="el-icon-star-on"
            @click="undoLike()"
            v-if="$store.state.userInfo.likesList.indexOf(id) != -1"
          >
            {{ comment.likes }}
          </i>
          <i class="el-icon-star-off" @click="doLike()" v-else> {{ comment.likes }} </i>
        </div>
        <div
          class="interaction-item"
          v-if="
            this.commentType != 'subComment' &&
            (comment.replies != null || comment.replies != '')
          "
        >
          <!-- <i
            class="el-icon-s-comment"
            @click="checkAllReplies(index, comment.commentId)"
          >
            查看回复
          </i> -->
        </div>
        <div
          class="interaction-item"
          v-if="fromUser.userId == $store.state.userInfo.userId"
        >
          <i class="el-icon-s-flag" @click="sbumitRemove()"> 删除 </i>
        </div>
        <div class="interaction-item hover">
          <i class="el-icon-s-promotion" @click="showReplyBox(id)">
            {{
              replayBoxAction == comment.commentId &&
              $store.state.replyBody.replyType == 0 &&
              this.commentType == "comment"
                ? "取消回复"
                : "回复"
            }}
          </i>
        </div>
        <div class="interaction-item hover">
          <i class="el-icon-s-flag"> 举报 </i>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      replyType: 0,
      // toUsername:this.comment.toUser.username
    };
  },
  computed: {
    fromUser: function () {
      return this.commentType == "subComment"
        ? this.comment.fromUser
        : this.comment.user;
    },
    createTime: function () {
      return this.commentType == "subComment"
        ? this.comment.replyTime
        : this.comment.commentTime;
    },
    title: function () {
      return this.commentType == "subComment"
        ? this.fromUser.username + " 回复 " + this.comment.toUser.username
        : this.fromUser.username;
    },
    id: function () {
      return this.commentType == "subComment"
        ? this.comment.id
        : this.comment.commentId;
    },
  },
  props: {
    comment: Object,
    replayBoxAction: String,
    replyActionIndex: Number,
    index: Number,
    subIndex: Number,
    //类型
    commentType: {
      type: String,
      default: "comment",
    },
  },
  methods: {
    showReplyBox(id) {
      //如果非子评论
      if (this.commentType == "comment") {
        // 当前选中ID == 当前活动回复框 && 当前回复的对象
        if (
          id == this.replayBoxAction &&
          this.$store.state.replyBody.replyType == 0
        ) {
          this.$emit("update:replayBoxAction", "-1");
        } else {
          this.$emit("update:replayBoxAction", id);

          this.$store.commit("updateReplyBody", {
            replyType: 0,
            replyId: id,
            toUserId: this.fromUser.userId,
            toUsername: this.fromUser.username,
            toUserAvatar: this.fromUser.avatar,
            commentId: this.comment.commentId,
            actionCommentIndex: this.index,
          });
        }
      } else {
        this.$emit("update:replayBoxAction", this.comment.commentId);

        this.$store.commit("updateReplyBody", {
          replyType: 1,
          replyId: id,
          toUserId: this.fromUser.userId,
          toUsername: this.fromUser.username,
          toUserAvatar: this.fromUser.avatar,
          commentId: this.comment.commentId,
          actionCommentIndex: this.index,
        });
      }
    },
    /**
     * 向父组件提交删除
     */
    sbumitRemove() {
      this.$confirm("确认删除该评论？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        closeOnClickModal: false,
        type: "warning",
        // center: true
      })
        .then((_) => {
          if (this.commentType == "comment") {
            this.$parent.removeComment(this.id, this.index);
          } else {
            // console.log("sbumitRemove",this.subIndex)
            this.$parent.removeReply(this.id, this.index, this.subIndex);
          }
        })
        .catch((_) => {});
    },
    async doLike() {
      try {
        let type = this.commentType == "comment" ? 1 : 2;
        let res = await this.$request.dolikes({
          typeId: this.id,
          type: type,
        });
        if (res.data.status == 0) {
          let likesList = this.$store.state.userInfo.likesList
          likesList.push(this.id)
           this.comment.likes++;
          this.$store.commit("updateLikesList", likesList);
        } else if (res.data.status == 403) {
          this.$message.error("用户认证失败，请重新登录");
        }
      } catch (err) {
        console.log(err)
        if (
          err.response.data.status == 403 ||
          err.response.data.data.status == 403
        ) {
          this.$message.error("登录认证已失效，请重新登录");
        }
      }
    },
    async undoLike() {
      try {
        let type = this.commentType == "comment" ? 1 : 2;
        let res = await this.$request.undolikes({
          typeId: this.id,
          type: type,
        });
        if (res.data.status == 0) {
          let likesList = this.$store.state.userInfo.likesList
          //移除元素
          let index = likesList.indexOf(this.id)
          likesList.splice(index,1);
          this.comment.likes--;
          this.$store.commit("updateLikesList", likesList);
        } else if (res.data.status == 403) {
          this.$message.error("用户认证失败，请重新登录");
        }
      } catch (err) {
         console.log(err)
        if (
          err.response.data.status == 403 ||
          err.response.data.data.status == 403
        ) {
          this.$message.error("登录认证已失效，请重新登录");
        }
      }
    },
  },
};
</script>

<style lang="scss" scoped>
#comment-item {
  padding: 30px 0 0 0;
  display: flex;

  &:hover .hover {
    display: block !important;
  }

  #comment {
    flex: 1;
    .comment-info {
      height: 40px;
    }
    .content {
      padding: 20px 0 20px 0;
      font: {
        weight: 400;
      }
    }
    .interaction {
      display: flex;
      flex-direction: row-reverse;

      .hover {
        display: none;
      }
    }

    .interaction-item {
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
  }
}
</style>