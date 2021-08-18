<template>
  <div class="grid-content">
    <Toast position="bottom-right"/>
    <Splitter style="background:var(--surface-200);">
      <SplitterPanel :size="40" :minSize="20">
        <div class="search-bar">
          <div v-if="firstSearch" class="logo-div">
            <img  src="../assets/search_logo.png" height="150" alt="">
          </div>
          <div class="search-div">
            <span class="p-input-icon-right">
                <i @click="queryServer" class="pi pi-search" aria-hidden="true"/>
                <InputText size="70" v-model="query" v-on:keyup.enter="queryServer" placeholder="Sleuth..."/>
            </span>
            <CustomTooltip :text="unconnectedBackendNames">
              <em
                  v-if="unconnectedBackendBool"
                  id="expiration-indicator"
                  class="pi pi-info-circle p-text-secondary"
                  @click="showAskMasterPw"
                  v-badge.custom-warning="unconnectedBackendNo"
              ></em>
            </CustomTooltip>
          </div>
          <ReEnterMasterPassword
                  :show="displayMasterPwInput"
                  @action-to-Occur="showAskMasterPw"
          />
        </div>
        <div class="search-results container">
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
      <SplitterPanel class="container" :size="60" :minSize="30">
        <p id="divider_usage_message" v-if='fullFileData === ""'>to adjust size of panel drag divider left or right</p>
        <div v-else class="next-prev">
          <icon-simple-expand-more @click="goToNext" class="clickable"/>
          <icon-simple-expand-less @click="goToPrev" class="clickable"/>
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
    import CustomTooltip from "../components/primeComponents/CustomTooltip";
    import IconSimpleExpandMore from "@/components/icons/IconSimpleExpandMore";
    import IconSimpleExpandLess from "@/components/icons/IconSimpleExpandLess";
    import ReEnterMasterPassword from "../components/popups/ReEnterMasterPassword";
    export default {
      name: "SearchBar",
      data() {
        return {
          displayMasterPwInput: false,
          fullFileLineNumbers: [],
          currentLineNumber: -1,
          fullFileData: "",
          displaySignIn: false,
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
        showAskMasterPw() {
          if(this.$store.getters.getMasterKey != null) {
            if (this.$store.getters.unconnectedBackendBool) {
              this.$toast.add({severity: 'info', summary: 'Server-side Error', detail: "Please contact your server owner to resolve the issue."});
            }
            return;
          } else {
            this.displayMasterPwInput = true;
          }
        },
        escapeSpecialCharacters(query) {
          return query.replace(/[{}\[\]+-^.:()]/gm, (match) => {
            return '\\' + match
          })
        },
        queryServer() {
          this.firstSearch = false;
          this.searchResults = [];
          axios
                  .get("http://localhost:3001/general/?q=" + encodeURIComponent(this.escapeSpecialCharacters(this.query)))
                  .then((resp) => {
                    this.searchResults = resp.data.searchResults;
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
        loadFullFile(fileData, lineNumber, lineNumbers) {
          this.fullFileData = fileData;
          this.fullFileLineNumbers = lineNumbers;
          this.$nextTick().then(() => {
            this.goToFullFileLine(lineNumber);
          })
        },
        goToFullFileLine(lineNumber) {
          this.currentLineNumber = lineNumber;
          this.$el.querySelector(`#line_number_${lineNumber}`).scrollIntoView({behavior: "smooth"});
        },
        goToPrev() {
          let index = Math.max(
              0,
              this.fullFileLineNumbers.findIndex((item) => {return this.currentLineNumber === item}) - 1
          );
          this.goToFullFileLine(this.fullFileLineNumbers[index]);
        },
        goToNext() {
          let index = Math.min(
              this.fullFileLineNumbers.length - 1,
              this.fullFileLineNumbers.findIndex((item) => {return this.currentLineNumber === item}) + 1
          );
          this.goToFullFileLine(this.fullFileLineNumbers[index]);
        }
      },
      components: {
        ReEnterMasterPassword,
        IconSimpleExpandLess,
        IconSimpleExpandMore,
        CustomTooltip,
        SearchResultCard,
      }
    }
  </script>

<style scoped>
@import "//cdnjs.cloudflare.com/ajax/libs/highlight.js/11.0.1/styles/base16/ia-dark.min.css";

.header {
  padding: 30px;
  border: solid;
  border: rgba(37, 37, 37, 0.91);
  text-align: center;
}

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

#expiration-indicator {
  font-size: 2rem;
  color: #d69b2c;
  position: relative;
  display: inline-block;
  margin-left: 0.4rem;
  margin-top : auto;
  margin-bottom : 0.3rem;
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

.p-splitter{
  border: none;
}
</style>