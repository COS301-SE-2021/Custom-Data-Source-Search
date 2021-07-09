<template>
  <IconButtonBase
      :title="iconTitle"
      :height="height"
      :width="width"
      :icon-color="iconColor"
      path1="M0 0h24v24H0V0z"
      path2="M2 20h20v-4H2v4zm2-3h2v2H4v-2zM2 4v4h20V4H2zm4 3H4V5h2v2zm-4 7h20v-4H2v4zm2-3h2v2H4v-2z"
  />
</template>

<script>
import IconButtonBase from "./IconButtonBase";
export default {
  name: "IconStorage",
  components: {IconButtonBase},
  props: {
    height: [Number, String],
    width: [Number, String],
    iconTitle: {
      type: String,
      default: 'Storage'
    },
    iconColor: {
      type: String,
      default: 'rgba(255, 255, 255, 0.58)'
    }
  }
}


</script>

<style scoped>

  .icon-button {
    background-color: #1e1e1e;
  }

  .icon-button:hover {
    background-color: #1e1e1e;
    color: #26C6DA;
  }

</style>