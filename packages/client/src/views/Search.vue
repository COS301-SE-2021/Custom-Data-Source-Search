<template>
  <div class="grid-content">
    <div class="header" >
      {{ name }}
    </div>
      <div class="search-div">
        <span class="p-input-icon-right">
            <i v-on:click="queryServer" class="pi pi-search" />
            <InputText v-model="query" v-on:keyup.enter="queryServer" placeholder="Sleuth..."/>
        </span>
      </div>
      <div>
        <div
                v-for="(r,i) in searchResults"
                :key="i"
        >
          <result-card-text v-if="r.type === 'text'" :result="r"/>
          <result-card-folder v-if="r.type === 'folder'" :result="r"/>
          <result-card-webpage v-if="r.type === 'webpage'" :result="r"/>
        </div>
      </div>
  </div>
</template>

  <script>
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
        ResultCardWebpage,
        ResultCardFolder,
        ResultCardText
      }
    }
  </script>

<style scoped>

.header{
  padding: 30px;
  border: solid;
  border: rgba(37, 37, 37, 0.91);
}

.grid-content {
  display: grid;
  grid-template-rows: 1fr ;
}

.search-div {
  vertical-align: center;
  padding: 30px;
  max-height: 100px;
}

input {
  width: 600px;
}

::placeholder {
  color: dimgrey;
  font-style: italic;
}

.pi{
  cursor: pointer;
}

.pi-search{
  padding: 0;
}
</style>