export default function ({store,redirect}) {
    // console.log("middleware")
    if(!store.state.isLogin){
        store.commit('updateShowLoginBox',true)
        console.log("ShowLoginBox",store.state.isShowLoginBox)
        return redirect('/')
        // console.log('isShowLoginBox', store.state.isShowLoginBox)
    }else{
       
    }
  }