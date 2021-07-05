<template>
  <div class="result-card">
    <div class="card-icon">
      <span v-html="icon"></span>
    </div>
    <div>
      {{name}}
    </div>
    <div>
      <highlightjs autodetect :code="content" />
    </div>
    <div>
      {{source}}
    </div>
  </div>
</template>

<script>
export default {
  name: "SearchResultCard",
  props: {
    icon: String,
    name: String,
    content: String,
    source: String
  }
}
</script>

<style scoped>
  .result-card {
    background-color: rgba(0, 0, 0, 0.2);
    text-align: left;
    max-width: 1000px;
    margin: 10px auto auto;
    border-radius: 10px;
    padding: 10px 20px;
  }
  h1 {
  font-size: 2em;
  }

  h2 {
  font-size: 1.5em;
  }

  p {
  font-size: 1em;
  }

  .card-icon {
  text-align: right;
  float: right;
  padding-top: 10px;
  }
</style>