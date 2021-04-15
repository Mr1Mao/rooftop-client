<template>
  <div class="mark"></div>
</template>

<script>
export default {

}
</script>
<style lang="scss" scoped>

.mark{
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  z-index: 100;
  transition: all 0.3s ease-in-out;
  opacity: 1;
  visibility: visible;
}
</style>