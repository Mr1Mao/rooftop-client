<template>
  <div class="container">
    <client-only>
      <el-divider></el-divider>
      <p class="title">评论</p>
      <div class="my-comments">
        <el-avatar
          icon="el-icon-user-solid"
          :src="$store.state.userInfo.avatar"
          :size="40"
          class="rf-avatar"
        ></el-avatar>
        <div class="textarea">
          <el-input
            type="textarea"
            :rows="4"
            placeholder="有什么想说的和大家分享一下叭..."
            v-model="commentContent"
          >
          </el-input>
          <div class="btns">
            <el-button
              type="primary"
              size="default"
              @click="sendComment(commentContent)"
              round
              >发布</el-button
            >
            <el-button
              type="info"
              size="default"
              @click="commentContent = ''"
              round
              plain
              >取消</el-button
            >
          </div>
        </div>
      </div>
      <p class="title">全部评论</p>
      <p
        v-if="commentList.length == 0"
        class="ac"
        style="padding: 100px 0; color: gray"
      >
        暂时还没人来评论哦
      </p>
      <div
        class="comments-box"
        v-for="(item, index) in commentList"
        :key="item.commentId"
      >
        <el-avatar
          icon="el-icon-user-solid"
          :src="item.user.avatar"
          :size="40"
          class="rf-avatar"
        ></el-avatar>
        <div class="comment">
          <div class="comment-info">
            <div class="from">{{ item.user.username }}</div>
            <div class="time">{{ tools.formatDate(item.commentTime) }}</div>
          </div>
          <div class="content">
            {{ item.content }}
          </div>
          <div class="interaction">
            <div class="item">
              <i class="el-icon-star-off"> 66 </i>
              <!-- el-icon-star-on -->
            </div>
            <div class="item" v-if="item.replies.length != 0">
              <i
                class="el-icon-s-comment"
                @click="checkAllReplies(index, item.commentId)"
              >
                查看回复
              </i>
            </div>
            <div
              class="item"
              v-if="item.user.userId == $store.state.userInfo.userId"
            >
              <i class="el-icon-s-flag"> 删除 </i>
            </div>
            <div class="item hover">
              <i
                class="el-icon-s-promotion"
                @click="
                  showReplyBox(item.commentId, 'comment', item.user,index)
                "
              >
                {{
                  replayBoxAction == item.commentId && replyBody.replyType == 0
                    ? "取消回复"
                    : "回复"
                }}
              </i>
            </div>
            <div class="item hover">
              <i class="el-icon-s-flag"> 举报 </i>
            </div>
          </div>

          <!-- 子评论 -->
          <div v-for="subItem in item.replies" :key="subItem.id">
            <rf-sub-comments
              :reply="subItem"
              :replyBody.sync="replyBody"
            ></rf-sub-comments>
          </div>
          <!-- 回复框 -->
          <transition name="el-zoom-in-top">
            <rf-reply-box
              :replyBody="replyBody"
              :commentId="item.commentId"
              :actionId.sync="replayBoxAction"
              :isCancelBtn="true"
              :resBody.sync="resBody"
            ></rf-reply-box>
          </transition>
          <div
            class="ac more"
            @click="checkAllReplies(index, item.commentId)"
            v-if="item.replies.length != 0"
          >
            <i class="el-icon-arrow-down">查看所有</i>
          </div>
          <el-divider></el-divider>
        </div>
      </div>
      <!-- 加载更多 -->
      <div v-if="commentList.length != 0">
        <div class="ac" v-if="isLoading" style="font-size: 1.3rem">
          <i class="el-icon-loading"></i>
        </div>
        <div class="ac more" @click="getMore()" v-else>
          <i class="el-icon-arrow-down"> {{ msg }}</i>
        </div>
      </div>
      <!-- 查看回复对话框 -->
      <el-dialog
        :title="'查看回复(' + actionReplyList.length + ')'"
        :visible.sync="dialogVisible"
        top="3vh"
        custom-class="reply-dialog-box"
      >
        <!-- 内容 -->
        <div
          class="content-dialog"
          :style="{ height: clientHeight * 0.83 + 7 + 'px' }"
        >
          <div style="display: flex">
            <!-- 头像 -->
            <el-avatar
              icon="el-icon-user-solid"
              :src="
                commentList[actionReplyIndex] != null
                  ? commentList[actionReplyIndex].user.avatar
                  : ''
              "
              :size="30"
            ></el-avatar>
            <!-- 评论 & 信息 -->
            <div style="flex: 1; margin: 0 10px">
              <div style="line-height: 30px">
                <p class="name-dialog fr">
                  {{
                    tools.formatDate(
                      commentList[actionReplyIndex] != null
                        ? commentList[actionReplyIndex].commentTime
                        : ""
                    )
                  }}
                </p>
                <p>
                  {{
                    commentList[actionReplyIndex] != null
                      ? commentList[actionReplyIndex].user.username
                      : ""
                  }}
                </p>
              </div>
              <div class="comment-content-dialog">
                {{
                  commentList[actionReplyIndex] != null
                    ? commentList[actionReplyIndex].content
                    : ""
                }}
              </div>
            </div>
          </div>

          <!-- 互动操作按钮 -->
          <div class="dialog-interaction">
            <div class="item">
              <i class="el-icon-star-off"> 66 </i>
              <!-- el-icon-star-on -->
            </div>
            <div class="item">
              <i class="el-icon-s-promotion" @click="showReplyBox('111')">
                {{ replayBoxAction == "111" ? "取消回复" : "回复" }}
              </i>
            </div>
            <div class="item">
              <i class="el-icon-s-flag"> 举报 </i>
            </div>
          </div>

          <!-- 回复框 -->
          <transition name="el-zoom-in-top">
            <rf-reply-box
              style="margin-left: 40px"
              replyTo="Mao"
              toId="111"
              :actionId.sync="replayBoxAction"
            ></rf-reply-box>
          </transition>

          <el-divider></el-divider>

          <div
            class="reply-list"
            v-infinite-scroll="load"
            infinite-scroll-disabled="disabled"
            infinite-scroll-distance="5"
            style="overflow: auto; margin-right: -3px"
          >
            <!-- <p style="color: #232323">108 条回复</p> -->
            <div
              v-for="item in actionReplyList"
              :key="item.id"
              class="list-item"
            >
              <div style="display: flex">
                <!-- 头像 -->
                <el-avatar
                  icon="el-icon-user-solid"
                  :src="item.fromUser.avatar"
                  :size="30"
                ></el-avatar>
                <!-- 评论 & 信息 -->
                <div style="flex: 1; margin: 0 10px">
                  <div style="line-height: 30px">
                    <p class="name-dialog fr">
                      {{ tools.formatDate(item.replyTime) }}
                    </p>
                    <p>
                      {{
                        item.fromUser.username + " 回复 " + item.toUser.username
                      }}
                    </p>
                  </div>
                  <div class="comment-content-dialog">
                    {{ item.content }}
                  </div>
                  <!-- 互动操作按钮 -->
                  <div class="dialog-interaction">
                    <div class="item">
                      <i class="el-icon-star-off"> 66 </i>
                      <!-- el-icon-star-on -->
                    </div>
                    <div class="item">
                      <i
                        class="el-icon-s-promotion"
                        @click="showReplyBox(item.commentId, 'reply')"
                      >
                        {{
                          replayDailogAction == item.commentId
                            ? "取消回复"
                            : "回复"
                        }}
                      </i>
                    </div>
                    <div class="item">
                      <i class="el-icon-s-flag"> 举报 </i>
                    </div>
                  </div>
                  <!-- "对评论的回复"回复框 -->
                  <transition name="el-zoom-in-top">
                    <rf-reply-box
                      :replyTo="item.fromUser.username"
                      :toId="item.commentId"
                      :actionId.sync="replayDailogAction"
                    ></rf-reply-box>
                  </transition>
                  <el-divider></el-divider>
                </div>
              </div>
            </div>
            <div style="margin: 0 0 10px 0">
              <p class="ac">{{ replyListMsg }}</p>
            </div>
          </div>
        </div>
      </el-dialog>
    </client-only>
  </div>
</template>

<script>
import rfReplyBox from "./rf-reply-box.vue";
import RfSubComments from "./rf-sub-comments.vue";
export default {
  components: { rfReplyBox, RfSubComments },
  //获取屏幕高度
  mounted() {
    if (process.client) {
      //获取评论列表
      this.getComments(this.comentsPages++);

      //获取屏幕高度
      this.clientHeight = `${document.documentElement.clientHeight}`;
      let _this = this;
      window.onresize = function temp() {
        _this.clientHeight = `${document.documentElement.clientHeight}`;
      };
    }
  },
  data() {
    return {
      replayBoxAction: "-1",
      dialogVisible: false,
      commentList: [],
      loading: false,
      replayDailogAction: "-1",
      replyTextarea: "",
      clientHeight: "",
      msg: "加载更多",
      isLoading: false,
      actionReplyList: [],
      // 当前打开所有回复框的下标
      actionReplyIndex: 0,
      //当前打开回复框的评论的下表
      actionCommentIndex:0,
      comentsPages: 1,
      // 加载更多的评论信息
      nextReplies: {
        replyPages: 1,
        commentId: "",
      },
      replyListMsg: "加载更多..",
      noMore: false,
      commentContent: "",
      // 回复请求体
      replyBody: {
        replyType: 0,
        replyId: "",
        toUserId: "",
        toUserName: "",
        toUserAvatar:""
      },
      resBody:{}
    };
  },
  methods: {
    /**
     * 打开回复框
     * type 回复对象
     */
    showReplyBox(id, type,user,index) {
      if (type == "reply") {
        this.replyType = 1;
        if (
          this.replayDailogAction != "-1" &&
          this.replayDailogAction == id
        ) {
          this.replayDailogAction = "-1";
        } else {
          this.replayDailogAction = id;
        }
        return;
      }

      if (
        this.replayBoxAction != "-1" &&
        this.replayBoxAction == id &&
        this.replyBody.replyType == 0
      ) {
        this.replayBoxAction = "-1";
      } else {
        this.replayBoxAction = id;
        this.replyBody.replyType = 0;
        this.replyBody.replyId = id;
        this.replyBody.toUserName = user.username;
        this.replyBody.toUserId = user.userId;
        this.actionCommentIndex = index;
        this.replyBody.toUserAvatar = user.avatar;
      }
      // console.log(this.replayBoxAction)
    },
    /**
     * 打开 所有评论列表
     */
    checkAllReplies(index, commentId) {
      this.dialogVisible = true;
      this.actionReplyIndex = index;
      this.nextReplies.commentId = commentId;
      this.getReplies(this.nextReplies);
    },
    /**
     * 请求回复列表
     */
    async getReplies(nextReplies) {
      try {
        let res = await this.$request.getReplies({
          pagination: nextReplies.replyPages,
          offset: 5,
          commentId: nextReplies.commentId,
        });
        if (res.data.status == 0) {
          if (res.data.data.length == 0) {
            this.noMore = true;
            this.replyListMsg = "没有更多了";
          }
          this.actionReplyList = this.actionReplyList.concat(res.data.data);
        }
        // console.log("replies", res.data);
      } catch (err) {
        console.info(err);
      }
    },
    /**
     * 获取评论列表
     */
    async getComments(comentsPages) {
      try {
        let res = await this.$request.getComments({
          pagination: comentsPages,
          isDESC: false,
          offset: 5,
          replyNum: 2,
          articleId: this.articleId,
        });
        if (res.data.status == 0) {
          if (res.data.data.length == 0) {
            this.msg = "没有更多了";
          }
          this.commentList = this.commentList.concat(res.data.data);
        }
        // console.log("res", res.data);
      } catch (err) {
        console.info(err);
      }
    },
    /**
     * 发送评论
     */
    async sendComment(content) {
      content = this.tools.trimStr(content);
      // console.log("commentContent",content)
      if (content == "" || content == null) {
        return;
      }
      try {
        let res = await this.$request.sendComment({
          article: {
            articleId: this.articleId,
          },
          content: content,
          user: {
            userId: this.$store.state.userInfo.userId,
          },
        });
        if (res.data.status == 0) {
          res.data.data.replies = [];
          res.data.data.user = this.$store.state.userInfo;
          this.commentList.unshift(res.data.data);

          this.commentContent = "";
        } else if (res.data.status == 403) {
          this.$message.error("用户认证失败，请重新登录");
        }
      } catch (err) {
        if (
          err.response.data.status == 403 ||
          err.response.data.data.status == 403
        ) {
          this.$message.error("登录认证已失效，请重新登录");
        }
        console.info(err.response.data.data.status);
      }
    },
    load() {
      this.loading = true;
      setTimeout(() => {
        this.nextReplies.replyPages++;
        this.getReplies(this.nextReplies);
        this.loading = false;
      }, 1000);
    },
    getMore() {
      this.isLoading = true;
      setTimeout(() => {
        this.getComments(this.comentsPages++);
        this.isLoading = false;
      }, 500);
    },
  },
  watch: {
    "nextReplies.commentId"(val, oldVal) {
      this.actionReplyList = [];
    },
    resBody(val, oldVal){
      this.commentList[this.actionCommentIndex].replies.unshift(val);
    }
  },
  computed: {
    disabled() {
      return this.loading || this.noMore;
    },
  },
  props: {
    articleId: String,
  },
};
</script>

<style lang="scss" scoped>
.container {
  font: {
    size: 1rem;
    weight: 600;
    family: $def_font_family;
  }

  .more {
    cursor: pointer;
    &:hover {
      text-decoration: underline;
    }
  }

  .title {
    font-size: 1.3rem;
  }

  .rf-avatar {
    margin: 0 20px;
  }
  .my-comments {
    padding: 30px 0;
    display: flex;
    .textarea {
      flex: 1;
      .btns {
        margin: 10px 0;
        float: right;
      }
    }
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
  .comments-box {
    padding: 30px 0 0 0;
    display: flex;

    &:hover .hover {
      display: block !important;
    }

    .comment {
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
        // float: right;
        display: flex;
        flex-direction: row-reverse;

        .hover {
          display: none;
          // color: aqua;
        }
      }
    }
  }
  .content-dialog {
    display: flex;
    flex-direction: column;
    .reply-list {
      .comment-content-dialog {
        font: {
          weight: 400;
        }
        margin: 10px 0 0 0;
      }
    }

    .dialog-interaction {
      display: flex;
      flex-direction: row-reverse;
      margin-top: 10px;
    }
    .reply {
      margin-top: 5px;
    }
    .el-divider {
      margin: 15px 0;
    }

    .list-item {
      margin: 10px 10px 10px 0;
    }
  }
}
</style>
<style >
.el-dialog__body {
  padding: 10px 20px;
}
</style>

