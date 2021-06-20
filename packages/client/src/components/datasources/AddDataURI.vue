<template>
  <div>
    <input :placeholder="placeholderPath" v-model="dataSourceName">
  </div>
</template>

<script>
export default {
  name: "AddDataURI",
  props: {
    placeholderPath: String
  },
  data() {
    return {
      dataSourceName: ""
    }
  }
}
</script>

<style scoped>


</style>