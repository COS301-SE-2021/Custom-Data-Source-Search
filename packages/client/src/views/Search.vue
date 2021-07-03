<template>
  <div class="grid-content">
    <div class="header" >
      {{ name }}
    </div>
    <div>
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
    </div>

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
      searchResults: [],
      name: "Search"
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

.header{
  padding: 30px;
  border: solid;
  border: #3b3b3b;
}

.grid-content {
  display: grid;
  grid-template-rows: 1fr 9fr;
}

.search-div {
  vertical-align: center;
}

input {
  width: 600px;
}

</style>