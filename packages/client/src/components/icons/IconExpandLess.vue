<template>
  <IconButtonBase
      :title="iconTitle"
      :height="height"
      :width="width"
      :icon-color="iconColor"
      path1="M0 0h24v24H0V0z"
      path2="M12 8l-6 6 1.41 1.41L12 10.83l4.59 4.58L18 14l-6-6z"
  />
</template>

<script>
import IconButtonBase from "./IconButtonBase";
export default {
  name: "IconExpandLess",
  components: {IconButtonBase},
  props: {
    height: [Number, String],
    width: [Number, String],
    iconTitle: {
      type: String,
      default: 'ExpandLess'
    },
    iconColor: {
      type: String
    }
  }
}


</script>

<style scoped>


</style>