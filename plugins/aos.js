import Vue from 'vue'
import AOS from 'aos'
import 'aos/dist/aos.css'
//markDown插件
import mavonEditor from 'mavon-editor'

Vue.use(AOS.init(),mavonEditor)