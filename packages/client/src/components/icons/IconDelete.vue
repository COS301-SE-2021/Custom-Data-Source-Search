<template>
  <IconButtonBase
      :title="iconTitle"
      :height="height"
      :width="width"
      :icon-color="iconColor"
      path1="M0 0h24v24H0V0z"
      path2="M16 9v10H8V9h8m-1.5-6h-5l-1 1H5v2h14V4h-3.5l-1-1zM18 7H6v12c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7z"
  />
</template>

<script>
import IconButtonBase from "./IconButtonBase";
export default {
  name: "IconDelete",
  components: {IconButtonBase},
  props: {
    height: [Number, String],
    width: [Number, String],
    iconTitle: {
      type: String,
      default: 'Delete'
    },
    iconColor: {
      type: String
    }
  }
}
</script>

<style scoped>

.icon-button {
  background-color: #242424;
}

.icon-button:hover {
  background-color: #2c2c2c;
}

</style>