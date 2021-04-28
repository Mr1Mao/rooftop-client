<template>
  <client-only>
    <div id="container">
      <!-- 用户评论文章模块 -->
      <el-divider></el-divider>
      <p class="title">评论</p>
      <div id="my-comment-box">
        <!-- 评论文章模块---头像 -->
        <el-avatar
          icon="el-icon-user-solid"
          :src="$store.state.userInfo.avatar"
          :size="40"
          style="margin: 0 20px"
        ></el-avatar>

        <div class="textarea">
          <!-- 评论文章模块---input -->
          <el-input
            type="textarea"
            :rows="4"
            placeholder="有什么想说的和大家分享一下叭..."
            v-model="commentContent"
          >
          </el-input>
          <!-- 评论文章模块---按钮 -->
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
      <!-- 全部评论模块 -->
      <div id="all-comments-box">
        <!-- 无评论时提示 -->
        <p
          v-if="commentList.length == 0"
          class="ac"
          style="padding: 100px 0; color: gray"
        >
          暂时还没人来评论哦
        </p>
        <!-- 评论列表 -->
        <div id="comments-list">
          <div v-for="(item, index) in commentList" :key="item.commentId">
            <rf-comment-item
              :index="index"
              :comment="item"
              :replayBoxAction.sync="replayBoxAction"
            ></rf-comment-item>
            <!-- 子评论 -->
            <div
              v-for="(subItem, subIndex) in item.replies"
              :key="subItem.id"
              style="margin-left: 70px"
            >
              <rf-comment-item
                :index="index"
                :subIndex="subIndex"
                :comment="subItem"
                :replayBoxAction.sync="replayBoxAction"
                commentType="subComment"
              >
              </rf-comment-item>
              <el-divider></el-divider>
            </div>
            <!-- 回复框 -->
            <transition name="el-zoom-in-top">
              <rf-reply-box-2
                v-if="item.commentId == replayBoxAction"
                :actionId.sync="replayBoxAction"
                :commentId="item.commentId"
                :isCancelBtn="true"
                style="margin-left: 80px"
              ></rf-reply-box-2>
            </transition>
            <!-- 加载reply更多 -->
            <div v-if="item.replies.length != 0">
              <div
                class="ac"
                v-if="replyIsLoading && actionCommentIndex == index"
                style="font-size: 1.3rem"
              >
                <i class="el-icon-loading"></i>
              </div>
              <div
                class="ac more"
                @click="getMoreReply(index, item.commentId)"
                v-else
              >
                <i class="el-icon-arrow-down"> {{ replyMsg }}</i>
              </div>
            </div>
            <el-divider></el-divider>
          </div>
          <!-- 加载更多 -->
          <div v-if="commentList.length != 0">
            <div class="ac" v-if="commentIsLoading" style="font-size: 1.3rem">
              <i class="el-icon-loading"></i>
            </div>
            <div class="ac more" @click="getMoreComment()" v-else>
              <i class="el-icon-arrow-down"> {{ commentMsg }}</i>
            </div>
          </div>
        </div>
      </div>
      <!-- 所有评论dailog -->
      <!-- <div></div> -->
    </div>
  </client-only>
</template>

<script>
import rfCommentItem from "./rf-comment-item.vue";
import RfReplyBox2 from "./rf-reply-box-2.vue";
export default {
  components: { rfCommentItem, RfReplyBox2 },
  mounted() {
    //客户端执行
    if (process.client) {
      //获取评论列表
      this.getComments(this.comentsPages++);
    }
  },
  data() {
    return {
      // 评论的内容
      commentContent: "",
      // comment数据列表
      commentList: [],
      //reply数据列表
      // replyList: [],
      //当前comment的页数
      comentsPages: 1,
      //当前活动的回复框
      replayBoxAction: "",
      // 当前活动的comment下标
      actionCommentIndex: 0,
      //comment更多提示消息
      commentMsg: "加载跟多",
      //reply更多提示消息
      replyMsg: "加载更多回复",
      //comment是否在加载中
      commentIsLoading: false,
      //reply更多消息提示
      replyIsLoading: false,
      // 加载更多的评论信息
      nextReplies: [{ replyPages: 1, commentId: "" }],
      //放回的数据
      // resBody:""
    };
  },
  props: {
    articleId: String,
  },
  methods: {
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
          //如果放回的列表为空 则显示没有数据
          if (res.data.data.length == 0) {
            this.commentMsg = "没有更多了";
          }
          this.commentList = this.commentList.concat(res.data.data);
        }
        // console.log("res", this.commentList);
      } catch (err) {
        console.info(err);
      }
    },
    /**
     * 请求回复列表
     */
    async getReplies(index, replyReq) {
      try {
        let res = await this.$request.getReplies({
          pagination: replyReq.replyPages,
          offset: 5,
          commentId: replyReq.commentId,
        });
        if (res.data.status == 0) {
          if (res.data.data.length == 0) {
            // this.noMore = true;
            this.replyMsg = "没有更多回复了";
          }
          this.commentList[index].replies = this.commentList[
            index
          ].replies.concat(res.data.data);
        }
        // console.log("replies", res.data);
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
        // console.info(err.response.data.data.status);
      }
    },
    /**
     * 发送回复
     */
    async sendReply(text) {
      let resBody;
      try {
        let res = await this.$request.sendReply({
          commentId: this.$store.state.replyBody.commentId,
          replyType: this.$store.state.replyBody.replyType,
          replyId: this.$store.state.replyBody.replyId,
          toUser: {
            userId: this.$store.state.replyBody.toUserId,
          },
          fromUser: {
            userId: this.$store.state.userInfo.userId,
          },
          content: text,
        });
        if (res.data.status == 0) {
          resBody = res.data.data;
          //补全一些后端未放回的信息信息
          resBody.fromUser = this.$store.state.userInfo;
          resBody.toUser.userId = this.$store.state.replyBody.toUserId;
          resBody.toUser.username = this.$store.state.replyBody.toUsername;
          resBody.toUser.avater = this.$store.state.replyBody.toUserAvatar;
          //将发布的评论 or 回复 添加至原来的数组中
          this.commentList[
            this.$store.state.replyBody.actionCommentIndex
          ].replies.push(resBody);
          console.log(resBody);
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
      }
    },
    /**
     * 删除评论
     */
    async removeComment(commentId, index) {
      try {
        let res = await this.$request.deleteComment({
          commentId: commentId,
          userId: this.$store.state.userInfo.userId,
        });
        if (res.data.status == 0) {
          console.log(res.data.data);
          //移除原来数组中的这个元素
          this.commentList.splice(index, 1);
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
      }
    },
    /**
     * 删除回复
     */
    async removeReply(id, index, subIndex) {
      try {
        let res = await this.$request.deleteReply({
          id: id,
          userId: this.$store.state.userInfo.userId,
        });
        if (res.data.status == 0) {
          console.log(res.data.data);
          //移除原来数组中的这个元素
          this.commentList[index].replies.splice(subIndex, 1);
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
      }
    },
    getMoreComment() {
      this.commentIsLoading = true;
      setTimeout(() => {
        this.getComments(this.comentsPages++);
        this.commentIsLoading = false;
      }, 500);
    },
    getMoreReply(index, commentId) {
      // this.nextReplies.commentId = commentId;
      let replyReq = null;
      for (let i = 0; i < this.nextReplies.length; i++) {
        if (this.nextReplies[i].commentId == commentId) {
          this.nextReplies[i].replyPages++;
          replyReq = this.nextReplies[i];
        }
      }
      if (replyReq == null) {
        replyReq = {
          replyPages: 1,
          commentId: commentId,
        };
        this.nextReplies.unshift(replyReq);
      }
      // console.log(replyReq);
      this.actionCommentIndex = index;
      this.replyIsLoading = true;
      setTimeout(() => {
        this.getReplies(index, replyReq);
        this.replyIsLoading = false;
      }, 500);
    },
  },
};
</script>

<style lang="scss" scoped>
#container {
  font: {
    size: 1rem;
    weight: 600;
    family: $def_font_family;
  }

  .title {
    font-size: 1.3rem;
  }

  .more {
    cursor: pointer;
    &:hover {
      text-decoration: underline;
    }
  }

  #my-comment-box {
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
  #all-comments-box {
    #commemts-list {
      //   padding: 30px 0 0 0;
      //   display: flex;
    }
  }
}
</style>