<template>
  <icon-base
      :title="iconTitle"
      :height="height"
      :width="width"
      :icon-color="iconColor"
      path1="M24 24H0V0h24v24z"
      path2="M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6-1.41-1.41z"
  />
</template>

<script>
import IconBase from "@/components/icons/IconBase";
export default {
  name: "IconSimpleExpandMore",
  components: {IconBase},
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