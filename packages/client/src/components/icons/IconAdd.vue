<template>
  <IconButtonBase
      :title="iconTitle"
      :height="height"
      :width="width"
      :icon-color="iconColor"
      path1="M0 0h24v24H0V0z"
      path2="M19,13h-6v6h-2v-6H5v-2h6V5h2v6h6V13z"
  />
</template>

<script>
import IconButtonBase from "./IconButtonBase";
export default {
  name: "IconAdd",
  components: {IconButtonBase},
  props: {
    height: [Number, String],
    width: [Number, String],
    iconTitle: {
      type: String,
      default: 'Add'
    },
    iconColor: {
      type: String
    }
  }
}


</script>

<style scoped>
</style>