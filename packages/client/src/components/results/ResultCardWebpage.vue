<template>
  <div class="result-card">
    <div class="card-icon">
      <span id="webpage" title="Webpage datasource"><icon-folder/></span>
    </div>
    <p
        v-for="(line, index) in result.occurrences"
        :key="index"
    >
      {{ line.occurrenceString }} <br>
    </p>
    <small> {{ result.source }} </small>
  </div>
</template>

<script>
import IconFolder from "../icons/IconFolder";
export default {
  name: "ResultCardWebpage",
  components: {IconFolder},
  props: {
    result: Object
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