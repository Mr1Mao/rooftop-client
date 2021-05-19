 //1) 自定义函数
const request = {
  //请求文章列表
  getArticles: (params) => {
    // return axios.get('/articles', params)
    return axios({
      method: "get",
      url: "/articles",
      params: params
    })
  },
  //请求文章
  getArticle: (params) => {
    return axios({
      method: "get",
      url: "/article",
      params: params
    })
  },
  //上传图片
  uploadImg: (params, headers) => {
    return axios.post('/picture', params, headers)
  },
  //登录
  login: (params) => {
    return axios({
      method: "post",
      url: "/oauth/token",
      params,
      transformRequest: [
        (data, headers) => {
          delete headers.common.Authorization;
          return data;
        }
      ]
    })
  },
  //获取用户数据
  getUser: (params) => {
    return axios({
      method: "get",
      url: "/user",
      params: params
    })
  },
  logout: (params) => {
    return axios({
      method: "delete",
      url: "/oauth/revoke-token",
    })
  },
  //更新用户信息
  updateUserInfo: (params) => {
    return axios({
      method: "post",
      url: "/user",
      params
    })
  },
  //发送邮件
  sendEMail: (params) => {
    return axios({
      method: "post",
      url: "/oauth/email",
      params
    })
  },
  //绑定邮箱认证
  bindEmail: (params) => {
    return axios({
      method: "post",
      url: "/user/code_verification",
      params
    })
  },
  //解绑邮箱
  unbindEMail: (params) => {
    return axios({
      method: "delete",
      url: "/user/email",
      params
    })
  },
  //发布文章
  postArticle: (params) => {
    return axios({
      method: "post",
      url: "/article",
      data: params
    })
    // return axios.post('/article', params)
  },
  //上传正文图片
  uploadFileList: (params, headers) => {
    return axios.post('/content_img', params, headers)
  },
  //获取文章分类
  getCategories: (params) => {
    return axios.get('/categories', params)
  },
  //获取文章背景图片
  getArticleBGI: (userId) => {
    // return axios.get('/bg_image', params)
    return axios({
      method: "get",
      url: "/bg_image/?userId=" + userId,
      
    })
  },
  //获取评论列表
  getComments: (params) => {
    // return axios.get('/bg_image', params)
    return axios({
      method: "get",
      url: "/comments",
      params
    })
  },
  //获取回复列表
  getReplies: (params) => {
    // return axios.get('/bg_image', params)
    return axios({
      method: "get",
      url: "/replies",
      params
    })
  },
  sendComment: (params) => {
    return axios.post('/comment', params)

  },
  sendReply: (params) => {
    return axios.post('/reply', params)
  },
  //删除评论
  deleteComment:(params) => {
    return axios({
      method: "delete",
      url: "/comment",
      params
    })
  },
  //删除回复
  deleteReply:(params) => {
    return axios({
      method: "delete",
      url: "/reply",
      params
    })
  },
  //取消点赞
  undolikes:(params) => {
    return axios({
      method: "delete",
      url: "/likes",
      params
    })
  },
  dolikes:(params) =>{
    return axios({
      method: "post",
      url: "/likes",
      params
    })
  }

}

//配置axios
var axios = null;
export default ({ $axios, store }, inject) => {

  axios = $axios;

  $axios.onRequest((res) => {
    $axios.setHeader('Content-Type', 'application/json;charset=UTF-8');
    $axios.setHeader("Access-Control-Allow-Origin", "*");
    $axios.setHeader("Access-Control-Allow-Headers", "X-Requested-With");
    $axios.setHeader("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    $axios.setHeader("X-Powered-By", "3.2.1");
    // console.log($axios)
    if (store.state.auth.accessToken != "" && store.state.isLogin) {
      $axios.setToken(store.state.auth.accessToken, store.state.auth.tokenType)
    } else {
      $axios.setToken(false)
    }
    return Promise.resolve(res);
  })

  // $axios.onError(error => {
  //   const code = parseInt(error.response && error.response.status)
  //   if (code === 400) {
  //     redirect('/400')
  //   }
  // })

  //4) 将自定义函数交于nuxt
  inject('request', request)
}