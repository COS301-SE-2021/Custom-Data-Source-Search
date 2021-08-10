<template>
  <div class="grid-content">
    <Toast position="bottom-right"/>
    <Splitter style="height: 100vh; background:var(--surface-200);">
      <SplitterPanel class="container" :size="60" :minSize="20" style="padding-top: 50px">
        <div v-if="firstSearch" class="logo-div">
          <img  src="../assets/search_logo.png" height="300" alt="">
        </div>
        <div class="search-div">
          <span class="p-input-icon-right">
              <i v-on:click="queryServer" class="pi pi-search" aria-hidden="true"/>
              <InputText size="90" v-model="query" v-on:keyup.enter="queryServer" placeholder="Sleuth..."/>
          </span>
          <em id="expiration-indicator" class="pi pi-info-circle p-text-secondary" v-on:click="showPopup" v-badge.custom-warning="'5'"></em>
        </div>
        <SignIn :show="displaySignIn" @display-popup="showPopup"></SignIn>
        <div>
          <search-result-card
              v-for="(r,i) in searchResults"
              :key="i"
              :id="r.id"
              :datasource_icon="r.datasource_icon"
              :datasource_name="r.datasource_name"
              :type="r.type"
              :match_snippets="r.match_snippets"
              :source="r.source"
              @resultClicked="loadFullFile"
          />
        </div>
      </SplitterPanel>
      <SplitterPanel class="container" :size="40" :minSize="20">
        <p id="divider_usage_message" v-if="fullFileID === -1">to adjust size of panel drag divider left or right</p>
        <div class="full_file" v-html="fullFileData">
        </div>
      </SplitterPanel>
    </Splitter>
  </div>
</template>

  <script>
    import axios from "axios";
    import SignIn from "@/components/popups/SignIn";
    import SearchResultCard from "@/components/results/SearchResultCard";
    export default {
      name: "SearchBar",
      data() {
        return {
          fullFileID: -1,
          fullFileData: "",
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
          return query.replace(/[{}\[\]+-^.:()]/gm, (match) => {
            return '\\' + match
          })
        },
        queryServer() {
          this.firstSearch = false
          this.searchResults = []
          axios
                  .get("http://localhost:3001/general/?q=" + encodeURIComponent(this.escapeSpecialCharacters(this.query)))
                  .then((resp) => {
                    this.searchResults = resp.data.searchResults
                    if (this.searchResults.length === 0) {
                      this.$toast.add({severity: 'warn', summary: 'No results', detail: "Try search again", life: 3000})
                    }
                  }).catch(() => {
            this.$toast.add({severity: 'warn', summary: 'No results', detail: "Try search again", life: 3000})
          })
        },
        showPopup(){
          this.displaySignIn = !this.displaySignIn
        },
        getIdOfCurrentFullFile() {
          return this.fullFileID;
        },
        loadFullFile(fileData, id) {
          this.fullFileData = fileData;
          this.fullFileID = id;
        },
        goToFullFileLine(lineNumber) {
          console.log(lineNumber);
        }
      },
      components: {
        SearchResultCard,
        SignIn
      }
    }
  </script>

<style scoped>
@import "//cdnjs.cloudflare.com/ajax/libs/highlight.js/11.0.1/styles/base16/ia-dark.min.css";

.header{
  padding: 30px;
  border: solid;
  border: rgba(37, 37, 37, 0.91);
  text-align: center;
}

.container {
  height: available;
  overflow-y: scroll;
}

input {
  width: 100%;
  min-width: 0
}

.container::-webkit-scrollbar {
  width: 0;
  height: 0;
}

.grid-content {
  display: grid;
  grid-template-rows: 1fr;
}

.search-div {
  display:flex;
  justify-content:center;
  align-items:center;
  padding: 30px;
  max-height: 100px;
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

#expiration-indicator {
  font-size: 2rem;
  color: #d69b2c;
  position: relative;
  display: inline-block;
  margin-left: 0.4rem;
  margin-top : auto;
  margin-bottom : 0.3rem;
}

.full_file {
  padding: 10px;
}

#divider_usage_message {
  color: #4d4d4d;
  padding-left: 10px;
}
</style>