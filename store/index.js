const state = () => ({
    userInfo: {
        accounts:"",
        avatar:"",
        email:"",
        enabled:"",
        gender:"",
        likesList:[],
        phone:"",
        registrationTime:"",
        resume:"",
        roles:"",
        userId:"",
        username:""
    },
    isLogin: false,
    isShowLoginBox: false,
    auth: {
        accessToken: "",
        refreshToken: "",
        tokenType: "Bearer",
        scope: "",
        grant_type: "password",
        client_secret: "112233",
        client_id: "client",
    },
    //当前选中所要回复的评论
    replyBody:{
        replyType: 0,
        replyId: "",
        toUserId: "",
        toUsername: "",
        toUserAvatar:"",
        commentId:"",
        actionCommentIndex:0
    }

})

const mutations = {
    updateLoginstatus(state, status) {
        state.isLogin = status;
    },
    getUserInfo(state, data) {
        state.userInfo = data;
    },
    updateShowLoginBox(state, data) {
        state.isShowLoginBox = data;
    },
    updateAuth(state, data){
        state.auth.accessToken = data.accessToken;
        state.auth.refreshToken = data.refreshToken;
        state.auth.scope = data.scope;
        state.auth.tokenType = data.tokenType;
    },
    updateAvatar(state, data){
        state.userInfo.avatar = data;
    },

    updateEmail(state, data){
        state.userInfo.email = data;
    },

    updateReplyBody(state, data){
        state.replyBody.replyType = data.replyType;
        state.replyBody.replyId = data.replyId;
        state.replyBody.toUserId = data.toUserId;
        state.replyBody.toUsername = data.toUsername;
        state.replyBody.toUserAvatar = data.toUserAvatar;
        state.replyBody.commentId = data.commentId;
        state.replyBody.actionCommentIndex = data.actionCommentIndex;
        
    },
    updateLikesList(state, data){
        state.userInfo.likesList = data;
    }
}

// const getters = {
//     getEMail: function (state) {
//         return state.userInfo.email
//     }
// }

export default {
    state,
    // getters,
    // actions,
    mutations
  }