<template>
  <div class="container">
    <div
      :class="{ banner: true, type1: type == 1, type2: type == 2 }"
      :style="{ backgroundImage: 'url(' + img + ')' }"
    >
      <div class="mark ac">
        <div v-if="!isSlot">
          <h1>{{ title }}</h1>
          <p>{{ subTitle }}</p>
        </div>
        <div v-else><slot></slot></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: "标题",
    },
    img: {
      type: String,
      default:
        "https://www.dukeyin.com/wp-content/uploads/2021/01/the_last_of_us_part_2.jpg",
    },
    subTitle: {
      type: String,
      default: "子标题",
    },
    type: {
      type: Number,
      default: 1,
    },
    isSlot: {
      type: Boolean,
      default: false,
    },
  },
};
</script>

<style lang="scss" scoped>
.type1 {
  height: 370px;
  .mark {
    h1 {
      padding-top: 150px;
    }
  }
}
.type2 {
  height: 450px;
  .mark {
    h1 {
      padding-top: 200px;
    }
  }
}
.banner {
  background: {
    // image: url(https://www.dukeyin.com/wp-content/uploads/2021/01/the_last_of_us_part_2.jpg);
    repeat: no-repeat;
    size: cover;
  }
  .mark {
    background-color: rgba($color: #303030, $alpha: 0.8);
    color: #f6f6f6;
    width: 100%;
    height: 100%;
    h1 {
      // line-height: 430px;
      //   padding-top: 200px;
      font: {
        size: 2.7rem;
        family: $def_font_family;
        weight: 600;
      }
    }
    p {
      margin-top: 80px;
      font: {
        size: 1.4rem;
        family: $def_font_family;
        // weight: 600;
      }
    }
  }
}
</style>