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
  border-radius: 10px;
  margin-top: 10px;
  background-color: #1e1e1e;
}

.match_snippet:hover {
  background-color: #1b1b1b;
}
</style>