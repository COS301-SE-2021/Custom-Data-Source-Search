<template>
  <IconBase
      :title="iconTitle"
      :height="height"
      :width="width"
      :icon-color="iconColor"
      path1="M0 0h24v24H0V0z"
      path2="M9.17 6l2 2H20v10H4V6h5.17M10 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z"
  />
</template>

<script>
import IconBase from "./IconBase";
export default {
  name: "IconFolder",
  components: {IconBase},
  props: {
    height: [Number, String],
    width: [Number, String],
    iconTitle: {
      type: String,
      default: 'Folder'
    },
    iconColor: {
      type: String,
      default: '#f1c40f'
    }
  }
}


</script>

<style scoped>
</style>