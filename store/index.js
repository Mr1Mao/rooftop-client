const state = () => ({
    userInfo: "",
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
    // dialogVisible:false

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
    // updateDialogVisible(state, data){
    //     state.updateDialogVisible = data;
    // }
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