<template>
  <div>
    <rf-navbar/>
    <transition name="el-zoom-in-top">
      <rf-navbar class="fixed" v-if="isFixed"/>
    </transition>
    <Nuxt  />
    <rf-footer />
    <el-backtop
      ><i class="el-icon-caret-top" style="color: #1e1e1e"></i
    ></el-backtop>
  </div>
</template>

<script>
import RfFooter from "../components/rf-footer.vue";
import RfNavbar from '../components/rf-navbar.vue';

export default {
  components: { RfFooter, RfNavbar },
  data() {
    return {
      isFixed: false,
    };
  },
  beforeMount() {
    this.listenerFunction();
  },
  beforeDestroy() {
    document.removeEventListener("scroll", this.listenerFunction);
  },
  methods: {
    listenerFunction(e) {
      document.addEventListener("scroll", this.handleScroll, true);
    },
    handleScroll() {
      if (window.pageYOffset >= 700) {
        this.isFixed = true;
      } else {
        this.isFixed = false;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.fixed {
  position: fixed;
  z-index: 99;
  top: 0;
}
</style>
