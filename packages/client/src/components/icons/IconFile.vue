<template>
  <IconBase
      :title="iconTitle"
      :height="height"
      :width="width"
      :icon-color="iconColor"
      path1="M0 0h24v24H0V0z"
      path2="M8 16h8v2H8zm0-4h8v2H8zm6-10H6c-1.1 0-2 .9-2 2v16c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm4 18H6V4h7v5h5v11z"
  />
</template>

<script>
import IconBase from "./IconBase";
export default {
  name: "IconFile",
  components: {IconBase},
  props: {
    height: [Number, String],
    width: [Number, String],
    iconTitle: {
      type: String,
      default: 'File'
    },
    iconColor: {
      type: String,
      default: '#2ecc71'
    }
  }
}


</script>

<style scoped>
</style>