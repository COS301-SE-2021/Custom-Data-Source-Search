<template>
  <IconBase
      :title="iconTitle"
      :height="height"
      :width="width"
      :icon-color="iconColor"
      path1="M0 0h24v24H0V0z"
      path2="M19 13H5v-2h14v2z"
  />
</template>

<script>
import IconBase from "./IconBase";
export default {
  name: "IconMin",
  components: {IconBase},
  props: {
    height: [Number, String],
    width: [Number, String],
    iconTitle: {
      type: String,
      default: 'Min'
    },
    iconColor: {
      type: String
    }
  }
}


</script>

<style scoped>
</style>