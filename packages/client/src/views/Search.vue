<template>
  <div class="search-div">
    <input v-model="query" v-on:keyup.enter="queryServer" placeholder="Sleuth...">
  </div>
  <div>
    <div
        v-for="(r,i) in searchResults"
        :key="i"
    >
      <result-card-text v-if="r.type === 'text'"/>
      <result-card-folder v-if="r.type === 'folder'"/>
      <result-card-webpage v-if="r.type === 'webpage'"/>
    </div>
  </div>
</template>

<script>
import TextResultCard from "../components/results/ResultCardText";
import axios from "axios";
import ResultCardText from "../components/results/ResultCardText";
import ResultCardFolder from "../components/results/ResultCardFolder";
import ResultCardWebpage from "../components/results/ResultCardWebpage";
export default {
  name: "SearchBar",
  data() {
    return {
      notDeleted: true,
      query: "",
      searchResults: []
    }
  },
  methods: {
    queryServer() {
      this.searchResults = []
      axios
        .get("http://localhost:3001/general/" + this.query)
        .then((resp) => {
          this.searchResults = resp.data.searchResults
        }).catch(() => {
          alert("Something went wrong!")
        })
    }
  },
  components: {
    ResultCardWebpage,
    ResultCardFolder,
    ResultCardText,
    TextResultCard
  }
}
</script>

<style scoped>

.search-div {
  vertical-align: center;
}

input {
  width: 600px;
}

</style>