<template>
  <Dialog header="Header" v-model:visible="display" >
    Content
  </Dialog>
</template>

<script>
export default {
  name: "SignIn",
  data() {
    return {
      display: true
    }
  }
}
</script>

<style scoped>

</style>