<template>
  <div class="result-card">
    <h1> {{ SourceName }}</h1>
    <span> {{ Content }}</span>
  </div>
</template>

<script>
export default {
  name: "TextResultCard",
  data() {
    return {
      SourceName: String,
      SourceType: String,
      Content: String
    }
  }
}
</script>

<style scoped>

</style>