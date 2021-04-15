<template>
  <div class="mavonEditor">
    <client-only>
      <slot @click="uploadimg"></slot>
      <mavon-editor
        :toolbars="toolbars"
        v-model="content"
        :ishljs="true"
        ref="md"
        @imgAdd="$imgAdd"
        @imgDel="$imgDel"
      />
    </client-only>
  </div>
</template>
<script>
export default {
  data() {
    return {
      toolbars: {
        bold: true, // 粗体
        italic: true, // 斜体
        header: true, // 标题
        underline: true, // 下划线
        strikethrough: true, // 中划线
        mark: true, // 标记
        superscript: true, // 上角标
        subscript: true, // 下角标
        quote: true, // 引用
        ol: true, // 有序列表
        ul: true, // 无序列表
        link: true, // 链接
        imagelink: true, // 图片链接
        code: true, // code
        table: true, // 表格
        fullscreen: true, // 全屏编辑
        readmodel: true, // 沉浸式阅读
        htmlcode: true, // 展示html源码
        help: true, // 帮助
        /* 1.3.5 */
        undo: true, // 上一步
        redo: true, // 下一步
        trash: true, // 清空
        save: true, // 保存（触发events中的save事件）
        /* 1.4.2 */
        navigation: true, // 导航目录
        /* 2.1.8 */
        alignleft: true, // 左对齐
        aligncenter: true, // 居中
        alignright: true, // 右对齐
        /* 2.2.1 */
        subfield: true, // 单双栏模式
        preview: true, // 预览
      },
      content: "#### how to use mavonEditor in nuxt.js",
      img_file: {},
    };
  },
  methods: {
    // 绑定@imgAdd event
    $imgAdd(pos, $file) {
      // 第一步.将图片上传到服务器.
      this.img_file[pos] = $file;

      // var formdata = new FormData();
      // formdata.append("file", $file);
      // await this.$request.uploadFileList(formdata, { "Content-Type": "multipart/form-data" })
      //   .then((res) => {
      //     // 第二步.将返回的url替换到文本原位置![...](./0) -> ![...](url)
      //     // $vm.$img2Url 详情见本页末尾
      //     const resData = res.data.data;
      //     console.log(resData,this.$refs.md)
      //     this.$refs.md.$img2Url(pos, resData.imgUrl);
      //   });
    },
    $imgDel(pos) {
      delete this.img_file[pos];
    },
    async uploadimg($e) {
      // 第一步.将图片上传到服务器.
      var formdata = new FormData();
      for (var _img in this.img_file) {
        formdata.append("file", this.img_file[_img]);
      }
      try {
        await this.$request
          .uploadFileList(formdata, { "Content-Type": "multipart/form-data" })
          .then((res) => {
            /**
             * 例如：返回数据为 res = [[pos, url], [pos, url]...]
             * pos 为原图片标志（0）
             * url 为上传后图片的url地址
             */
            // 第二步.将返回的url替换到文本原位置![...](0) -> ![...](url)
            if (res.data.status == 0) {
              const resData = res.data.data;
              for (var i = 0; i < resData.length; i++) {
                console.log(resData[i]);
                this.$refs.md.$img2Url(i + 1, resData[i]);
              }
              //将content传递给父组件
              this.$emit("func", this.content);
            } else {
              console.log(res.data);
            }
          });
      } catch (error) {
        console.log("error:", error.response.data.status);
        if (error.response.data.status == 403) {
          this.$message({
            message: "登录超时，请重新登录",
            type: "error",
          });
        }else{
           this.$message({
            message: "文章发布失败，请重新尝试",
            type: "error",
          });
        }
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.mavonEditor {
  width: 100%;
  height: 100%;
  .v-note-wrapper {
    min-height: 660px;
  }
}
</style>