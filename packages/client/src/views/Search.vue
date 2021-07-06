<template>
  <div class="search-div">
    <input v-model="query" v-on:keyup.enter="queryServer" placeholder="Sleuth...">
  </div>
  <div>
    <SearchResultCard
      v-for="(r, i) in generalResults"
      :key="i"
      :icon="r.icon"
      :name="r.name"
      :content="r.content"
      :source="r.source"
    />
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
import SearchResultCard from "@/components/results/SearchResultCard";
import TextResultCard from "../components/results/TextResultCard";
import axios from "axios";
export default {
  name: "SearchBar",
  data() {
    return {
      notDeleted: true,
      query: "",
      searchResults: [],
      generalResults: []
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
    },
    getGeneralSearchResults() {
      this.generalResults = []
      axios
          .get("http://localhost:3001/search")
          .then((resp) => {
            console.log(resp)
            this.generalResults = resp.data
          }).catch(() => {
        alert("Something went wrong!")
      })
    }
  },
  beforeMount() {
    this.getGeneralSearchResults()
  },
  components: {
    TextResultCard,
    SearchResultCard
  }
}
</script>

<style scoped>
@import "//cdnjs.cloudflare.com/ajax/libs/highlight.js/11.0.1/styles/base16/ia-dark.min.css";

.search-div {
  vertical-align: center;
}

input {
  width: 600px;
}

</style>