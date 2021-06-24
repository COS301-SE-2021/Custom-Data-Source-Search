<template>
  <IconBase
      :title="iconTitle"
      :height="height"
      :width="width"
      :icon-color="iconColor"
      path1="M0 0h24v24H0V0z"
      path2="M19,13h-6v6h-2v-6H5v-2h6V5h2v6h6V13z"
  />
</template>

<script>
import IconBase from "./IconBase";
export default {
  name: "IconAdd",
  components: {IconBase},
  props: {
    height: [Number, String],
    width: [Number, String],
    iconTitle: {
      type: String,
      default: 'Add'
    },
    iconColor: {
      type: String,
      default: '#ffffff'
    }
  }
}


</script>

<style scoped>
</style>