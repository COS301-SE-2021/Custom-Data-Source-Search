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
  cursor: pointer;
  padding: 10px;
  margin-bottom: 10px;
  background-color: #1f1f1f;
}

.match_snippet:hover {
  background-color: #1b1b1b;
}
</style>