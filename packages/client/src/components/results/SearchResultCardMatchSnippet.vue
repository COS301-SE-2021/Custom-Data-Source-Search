<template>
  <div class="match_snippet" v-html="snippet"></div>
</template>

<script>
export default {
  name: "SearchResultCardMatchSnippet",
  props: {
    line_number: Number,
    snippet: String
  }
}
</script>

<style scoped>
.match_snippet {
  background-color: #4d4d4d;
  cursor: pointer
}
</style>