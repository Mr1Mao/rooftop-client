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
            v-model="textarea"
          >
          </el-input>
          <div class="btns">
            <el-button type="primary" size="default" @click="submit()" round
              >发布</el-button
            >
            <el-button type="info" size="default" @click="cancel()" round plain
              >取消</el-button
            >
          </div>
        </div>
      </div>
      <p class="title">全部评论</p>
      <div class="comments-box" v-for="item in 5" :key="item">
        <el-avatar
          icon="el-icon-user-solid"
          :src="$store.state.userInfo.avatar"
          :size="40"
          class="rf-avatar"
        ></el-avatar>
        <div class="comment">
          <div class="comment-info">
            <div class="from">Mao</div>
            <div class="time">2021-03-15 17:29:08</div>
          </div>
          <div class="content">
            “去年一滴相思泪，今年尤挂两腮边”——原来脸还可以长到这种程度😂,“去年一滴相思泪，今年尤挂两腮边”——原来脸还可以长到这种程度😂,
            “去年一滴相思泪，今年尤挂两腮边”——原来脸还可以长到这种程度😂
          </div>
          <div class="interaction">
            <div class="item">
              <i class="el-icon-star-off"> 66 </i>
              <!-- el-icon-star-on -->
            </div>
            <div class="item">
              <i class="el-icon-s-comment" @click="dialogVisible = true">
                查看回复
              </i>
            </div>
            <div class="item hover">
              <i class="el-icon-s-promotion" @click="showReplyBox(String(item))">
                {{ replayBoxAction == item ? "取消回复" : "回复" }}
              </i>
            </div>
            <div class="item hover">
              <i class="el-icon-s-flag"> 举报 </i>
            </div>
          </div>

          <!-- 回复框 -->
         <transition name="el-zoom-in-top">
            <rf-reply-box replyTo="Mao" :toId="String(item)" :actionId.sync = "replayBoxAction" :isCancelBtn="true"></rf-reply-box>
          </transition>

          <el-divider></el-divider>
        </div>
      </div>
      <!-- 查看回复对话框 -->
      <el-dialog
        title="查看回复(108)"
        :visible.sync="dialogVisible"
        top="3vh"
        custom-class="reply-dialog-box"
      >
        <!-- 内容 -->
        <div class="content-dialog" :style="{'height':clientHeight * 0.83 + 7 + 'px'}">
          <!-- 回复中的评论头像 -->
          <div style="display: flex">
            <!-- 头像 -->
            <el-avatar
              icon="el-icon-user-solid"
              :src="$store.state.userInfo.avatar"
              :size="30"
            ></el-avatar>
            <!-- 评论 & 信息 -->
            <div style="flex: 1; margin: 0 10px">
              <div style="line-height: 30px">
                <p class="name-dialog fr">2021-03-15 17:29:08</p>
                <p>Mao</p>
              </div>
              <div class="comment-content-dialog">
                “去年一滴相思泪，今年尤挂两腮边”——原来脸还可以长到这种程度😂,
                “去年一滴相思泪，今年尤挂两腮边”——原来脸还可以长到这种程度😂,
                “去年一滴相思泪，今年尤挂两腮边”——原来脸还可以长到这种程度😂
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
                {{ replayBoxAction == '111' ? "取消回复" : "回复" }}
              </i>
            </div>
            <div class="item">
              <i class="el-icon-s-flag"> 举报 </i>
            </div>
          </div>

          <!-- 回复框 -->
          <transition name="el-zoom-in-top">
            <rf-reply-box style="margin-left: 40px" replyTo="Mao" toId="111" :actionId.sync = "replayBoxAction"></rf-reply-box>
          </transition>

          <el-divider></el-divider>
          
          <div
            class="reply-list"
            v-infinite-scroll="load"
            infinite-scroll-disabled="disabled"
            infinite-scroll-distance="5"
            style="overflow: auto; margin-right: -3px;"
          >
            <!-- <p style="color: #232323">108 条回复</p> -->
            <div v-for="i in count" :key="i" class="list-item">
              <div style="display: flex">
                <!-- 头像 -->
                <el-avatar
                  icon="el-icon-user-solid"
                  :src="$store.state.userInfo.avatar"
                  :size="30"
                ></el-avatar>
                <!-- 评论 & 信息 -->
                <div style="flex: 1; margin: 0 10px">
                  <div style="line-height: 30px">
                    <p class="name-dialog fr">2021-03-15 17:29:08</p>
                    <p>Mao</p>
                  </div>
                  <div class="comment-content-dialog">
                    “去年一滴相思泪，今年尤挂两腮边”——原来脸还可以长到这种程度😂,
                    {{ i }}
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
                        @click="showReplyBox(String(i), 'reply')"
                      >
                        {{ replayDailogAction == String(i) ? "取消回复" : "回复" }}
                      </i>
                    </div>
                    <div class="item">
                      <i class="el-icon-s-flag"> 举报 </i>
                    </div>
                  </div>
                  <!-- "对评论的回复"回复框 -->
                  <transition name="el-zoom-in-top">
                    <rf-reply-box :replyTo="String(i)" :toId="String(i)" :actionId.sync="replayDailogAction" ></rf-reply-box>
                  </transition>
                  <el-divider></el-divider>
                </div>
              </div>
            </div>
            <div style="">
              <p v-if="loading" class="ac">加载中...</p>
              <p v-if="noMore" class="ac">没有更多了</p>
            </div>
          </div>
        </div>
      </el-dialog>
    </client-only>
  </div>
</template>

<script>
import rfReplyBox from './rf-reply-box.vue';
export default {
  components: { rfReplyBox },
  //获取屏幕高度
  mounted(height) {
    if (process.client) {
      this.clientHeight = `${document.documentElement.clientHeight}`; //document.body.clientWidth;
      //console.log(self.clientHeight);
      let _this = this
      window.onresize = function temp() {
        _this.clientHeight = `${document.documentElement.clientHeight}`;
      };
    }
  },
  data() {
    return {
      textarea: "",
      replayBoxAction: '-1',
      dialogVisible: false,
      count: 10,
      loading: false,
      replayDailogAction: '-1',
      replyTextarea: "",
      clientHeight: '',
      // replyTitle:"回复"
    };
  },
  methods: {
    /**
     * 打开回复框
     * type 回复对象
     */
    showReplyBox(index, type) {
      if (type == "reply") {
        if (this.replayDailogAction != '-1' && this.replayDailogAction == index) {
          this.replayDailogAction = '-1';
        } else {
          this.replayDailogAction = index;
        }
        return;
      }

      if (this.replayBoxAction != '-1' && this.replayBoxAction == index) {
        this.replayBoxAction = '-1';
      } else {
        this.replayBoxAction = index;
      }
    },
    cancelReply(type) {
      // if (type == "reply") {
      //   this.replayDailogAction = -1;
      // } else {
      //   this.replayBoxAction = -1;
      // }
    },
    load() {
      this.loading = true;
      setTimeout(() => {
        console.log("执行了一次", this.count);
        this.count += 5;
        this.loading = false;
      }, 1000);
    },
  },
  computed: {
    noMore() {
      return this.count >= 40;
    },
    disabled() {
      return this.loading || this.noMore;
    },
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

  .title {
    font-size: 1.3rem;
  }

  .rf-avatar {
    margin: 0 20px;
  }
  .my-comments {
    // width: 800px;
    // margin: 0 auto;
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

