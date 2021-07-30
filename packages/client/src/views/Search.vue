<template>
  <div class="grid-content">
    <Toast position="bottom-right"/>
    <div class="header" >

    </div>
    <div v-if="firstSearch" class="logo-div">
      <img  src="../assets/search_logo.png" height="300" alt="">
    </div>
      <div class="search-div">
        <span class="p-input-icon-right">
            <i v-on:click="queryServer" class="pi pi-search" aria-hidden="true"/>
            <InputText v-model="query" v-on:keyup.enter="queryServer" placeholder="Sleuth..."/>

        </span>
        <Button icon="pi pi-info-circle" class="p-button-rounded p-button-danger" style="margin-left: 5px" v-on:click="showPopup"></Button>
      </div>
    <SignIn :show="displaySignIn" @display-popup="showPopup"></SignIn>


    <div>
        <div
                v-for="(r,i) in searchResults"
                :key="i"
        >
          <result-card-file v-if="r.type === 'file'" :result="r"/>
          <result-card-folder v-if="r.type === 'folder'" :result="r"/>
          <result-card-webpage v-if="r.type === 'webpage'" :result="r"/>
        </div>
      </div>
  </div>
</template>

  <script>
    import axios from "axios";
    import ResultCardFile from "../components/results/ResultCardFile";
    import ResultCardFolder from "../components/results/ResultCardFolder";
    import ResultCardWebpage from "../components/results/ResultCardWebpage";
    import SignIn from "@/components/popups/SignIn";
    export default {
      name: "SearchBar",
      data() {
        return {
          displaySignIn: false,
          notDeleted: true,
          query: "",
          searchResults: [],
          name: "Search",
          firstSearch: true,
        }
      },
      methods: {
        escapeSpecialCharacters(query) {
          return query.replace(/[{}/\[\]+-^.:()]/gm, function (match) {
            return '\\' + match
          })
        },
        queryServer() {
          this.firstSearch = false
          this.searchResults = []
          axios
                  .get("http://localhost:3001/general/" + encodeURI(this.escapeSpecialCharacters(this.query)))
                  .then((resp) => {
                    console.log(resp.data)
                    this.searchResults = resp.data.searchResults
                  }).catch(() => {
            this.$toast.add({severity: 'warn', summary: 'No results', detail: "Try search again", life: 3000})
          })
        },
        showPopup(){
          this.displaySignIn = !this.displaySignIn
        }
      },
      components: {
        SignIn,
        ResultCardWebpage,
        ResultCardFolder,
        ResultCardFile
      }
    }
  </script>

<style scoped>

.header{
  padding: 30px;
  border: solid;
  border: rgba(37, 37, 37, 0.91);
  text-align: center;
}

.grid-content {
  display: grid;
  grid-template-rows: 1fr ;
}

.search-div {
  vertical-align: center;
  text-align: center;
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


.logo-div {
  text-align: center;
  margin-bottom: 10px;
}
</style>