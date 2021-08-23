<template>
  <div class="grid-content">
    <Toast position="bottom-right"/>
    <Splitter style="background:var(--surface-200);">
      <SplitterPanel :minSize="20" :size="40">
        <div class="search-bar">
          <div v-if="firstSearch" class="logo-div">
            <img
                alt=""
                height="150"
                src="../assets/search_logo.png"
            >
          </div>
          <div class="search-div">
            <span class="p-input-icon-right">
                <i aria-hidden="true" class="pi pi-search" @click="queryBackends(this.query)"/>
                <InputText v-model="query" placeholder="Sleuth..." size="70" @keyup.enter="queryBackends"/>
            </span>
          </div>
        </div>
        <div class="search-results container">
          <search-result-card
              v-for="(r,i) in searchResults"
              :key="i"
              :="r"
              @resultClicked="loadFullFile"
          />
        </div>
      </SplitterPanel>
      <SplitterPanel :minSize="30" :size="60" class="container">
        <p v-if='fullFileData === ""' id="divider_usage_message">to adjust size of panel drag divider left or right</p>
        <div v-else class="next-prev">
          <icon-simple-expand-more class="clickable" @click="goToNext"/>
          <icon-simple-expand-less class="clickable" @click="goToPrev"/>
        </div>
        <div class="file-container">
          <div id="full_file" v-html="fullFileData">
          </div>
        </div>
      </SplitterPanel>
    </Splitter>
  </div>
</template>

<script>
import axios from "axios";
import {mapGetters} from 'vuex';
import SearchResultCard from "@/components/results/SearchResultCard";
import IconSimpleExpandMore from "@/components/icons/IconSimpleExpandMore";
import IconSimpleExpandLess from "@/components/icons/IconSimpleExpandLess";

export default {
  name: "SearchBar",

  components: {
    IconSimpleExpandLess,
    IconSimpleExpandMore,
    SearchResultCard,
  },

  data() {
    return {
      fullFileLineNumbers: [],
      currentLineNumber: -1,
      fullFileData: "",
      notDeleted: true,
      query: "",
      searchResults: [],
      name: "Search",
      firstSearch: true,
    }
  },

  computed: {
    ...mapGetters([
      'unconnectedBackendNo',
      'unconnectedBackendBool',
      'unconnectedBackendNames'
    ])
  },

  beforeMount() {
    if (this.$store.getters.getNewAppStatus) {
      this.$router.push('/');
    }
  },

  methods: {
    /**
     * Queries each active backend of the current user, saves search results to the searchResults array in data.
     *
     * If a query to a backend fails due to an expired JWToken the function will refresh the token and retry the query.
     *
     * @param {string} query what the backend should search verbatim
     * @returns {Promise<void>}
     */
    async queryBackends(query) {
      this.firstSearch = false;
      this.searchResults = [];
      for (let backend of this.$store.getters.getUserBackends(this.$store.getters.getSignedInUserId)) {
        if (!backend.local.active) {
          continue;
        }
        const url = `http://${backend.connect.link}/general/?q=${
            encodeURIComponent(this.escapeSpecialCharacters(query))
        }`
        let headers = {"Authorization": "Bearer " + backend.connect.keys.jwtToken};
        await axios
            .get(url, {headers})
            .then((resp) => {
              this.handleSuccess(resp.data.searchResults, backend)
            })
            .catch(async () => {
              await this.$store.dispatch("refreshJWTToken", {id: backend.local.id})
              headers = {"Authorization": "Bearer " + this.$store.getters.getBackendJWTToken(backend.local.id)};
              await axios
                  .get(url, {headers})
                  .then((resp) => {
                    this.handleSuccess(resp.data.searchResults, backend)
                  })
                  .catch((e) => {
                    console.error(e);
                  })
            })
      }
      if (this.searchResults.length === 0) {
        this.$toast.add({severity: 'warn', summary: 'No results', detail: "Try search again", life: 3000})
      }
    },

    /**
     * Escapes characters that Solr will interpret as instructions, allowing the user to search for these characters.
     *
     * @param {string} query string that might contain special control characters
     * @returns {string} string with any special control characters escaped
     */
    escapeSpecialCharacters(query) {
      return query.replace(/[{}\[\]+-^.:()]/gm, (match) => {
        return '\\' + match
      })
    },

    /**
     * Append relevant backend data to each search result before concatenating these with the existing list in data.
     *
     * @param results search results as returned by backend
     * @param backend backend info from store
     */
    handleSuccess(results, backend) {
      for (let r of results) {
        r.link = backend.connect.link;
        r.name = backend.local.name;
        r.backendId = backend.local.id;
      }
      this.searchResults = this.searchResults.concat(results);
    },

    /**
     * Load given file data into the display panel, and go to the given file line.
     *
     * @param {html} fileData
     * @param {number} lineNumber line number or result to go to
     * @param {[number]} lineNumbers line numbers of all results found in file
     */
    loadFullFile(fileData, lineNumber, lineNumbers) {
      this.fullFileData = fileData;
      this.fullFileLineNumbers = lineNumbers;
      this.$nextTick().then(() => {
        this.goToFullFileLine(lineNumber);
      })
    },

    /**
     * Scroll given line (in display panel) into view.
     *
     * @param lineNumber
     */
    goToFullFileLine(lineNumber) {
      this.currentLineNumber = lineNumber;
      this.$el.querySelector(`#line_number_${lineNumber}`).scrollIntoView();
    },

    /**
     * Go to the previous line with a search result of the file in display panel.
     */
    goToPrev() {
      let index = Math.max(
          0,
          this.fullFileLineNumbers.findIndex((item) => {
            return this.currentLineNumber === item
          }) - 1
      );
      this.goToFullFileLine(this.fullFileLineNumbers[index]);
    },

    /**
     * Go to the next line with a search result of the file in display panel.
     */
    goToNext() {
      let index = Math.min(
          this.fullFileLineNumbers.length - 1,
          this.fullFileLineNumbers.findIndex((item) => {
            return this.currentLineNumber === item
          }) + 1
      );
      this.goToFullFileLine(this.fullFileLineNumbers[index]);
    }
  }
}
</script>

<style scoped>
@import "//cdnjs.cloudflare.com/ajax/libs/highlight.js/11.0.1/styles/base16/ia-dark.min.css";

.search-bar {
  min-height: 100px;
  border-bottom: solid;
  border-color: #4d4d4d;
  border-width: 1px;
  padding-top: 10px;
}

.search-results {
  height: 90vh;
  padding-top: 10px;
  padding-bottom: 100px;
}

.container {
  height: available;
  overflow-y: scroll;
  font-size: 0.9em;
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
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 30px;
  max-height: 100px;
}

::placeholder {
  color: dimgrey;
  font-style: italic;
}

.pi {
  cursor: pointer;
}

.pi-search {
  padding: 0;
}


.logo-div {
  text-align: center;
  padding-top: 20px;
  margin-bottom: 10px;
}

.next-prev {
  display: grid;
  grid-template-columns: 1fr 1fr;
  position: fixed;
  top: 10px;
  right: 10px;
  background-color: #1c1c1c;
  border-radius: 4px;
}

.clickable {
  padding: 4px;
}

.clickable:hover {
  background-color: #4d4d4d;
  border-radius: 4px;
}

.file-container {
  height: 100vh;
}

#full_file {
  padding-left: 10px;
  padding-top: 40px;
  padding-bottom: 40px;
}

#divider_usage_message {
  color: #4d4d4d;
  padding-left: 10px;
}
</style>