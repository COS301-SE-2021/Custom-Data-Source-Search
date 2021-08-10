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
}

.match_snippet:hover {
  background-color: #2a2a2a;
}
</style>