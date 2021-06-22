<template>
  <div class="search-div">
    <input v-model="query" v-on:keyup.enter="queryServer" placeholder="Sleuth...">
  </div>
  <div>
    <TextResultCard
        v-for="(r,i) in searchResults"
        :key="i"
        :source="r.source"
        :type="r.type"
        :occurrences="r.occurrences"
    />
  </div>
</template>

<script>
import TextResultCard from "../components/results/TextResultCard";
import axios from "axios";
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
    TextResultCard
  }
}
</script>

<style scoped>

.search-div {
  vertical-align: center;
}

input {
  height: 28px;
  font-size: 1em;
  padding-left: 7px;
  padding-right: 7px;
  margin-bottom: 8px;
  width: 600px;
  background-color: rgba(211, 211, 211, 0.87);
  margin-top: -3px;
  border-radius: 10px;
  border: none;
}

input::placeholder {
  color: black;
}

</style>