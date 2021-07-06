<template>
  <div class="grid-content">
    <div class="header" >
      {{ name }}
    </div>
    <div class="logo-div">
      <img src="../assets/12345.png" height="300" alt="">
  </div>
      <div class="search-div">
        <span class="p-input-icon-right">
    <InputText  class="p-input-filled p-inputtext-lg" />
    <i class="pi pi-spin pi-spinner" />
</span>
        <br>
        <input id="delet" v-model="query" v-on:keyup.enter="queryServer" placeholder="Sleuth...">
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
  justify-self: left;
  padding: 30px;
  border: solid;
  border: rgba(37, 37, 37, 0.91);
}

.grid-content {
  display: grid;
  grid-template-rows: 1fr ;
}

.logo-div {
  vertical-align: center;
  margin-bottom: 10px;

}

.search-div {
  padding: 10px;
  max-height: 100px;
}

input {
  width: 600px;
}

#delet {
  visibility: collapse;
}

.p-input-icon-right {
}

.p-input-filled {

  border-radius: 50px;
}

.p-input-filled:focus {
  border-width : 0.5px;

}



</style>