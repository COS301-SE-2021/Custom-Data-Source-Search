<template>
  <div class="grid-content">
    <Toast position="bottom-right"/>
    <div v-if="fullFileData === '' && iFrameLink === ''">
      <div class="search-bar">
        <div v-if="firstSearch" class="logo-div">
          <img
              alt=""
              height="250"
              src="../assets/search_logo.png"
          >
        </div>
        <div class="search-div-initial">
            <span class="p-input-icon-right">
                <i v-if="!loading" aria-hidden="true" class="pi pi-search" @click="queryBackends(query)"/>
                <i v-else aria-hidden="true" class="pi pi-spin pi-spinner"/>
                <InputText
                    v-model="query"
                    placeholder="Sleuth..."
                    ref="Sleuth"
                    size="100"
                    @keyup.enter="queryBackends(query)"
                />
            </span>
          <span class="advanced-search-toggle">
              <checkbox
                  v-model="advancedSearch"
                  :binary="true"
                  v-tooltip.top="'Allows you to construct advanced queries using logical operators and brackets\n ' +
                   'For Example: \nHello AND (John OR Dave))'"
                  @click="reRunQuery">
              </checkbox>
              Advanced Search
            </span>
        </div>
      </div>
      <div class="search-results container">
        <search-result-card
            v-for="(r,i) in searchResults"
            :key="i"
            :="r"
            :small=false
            @snippetClicked="goToLineFetchFileIfRequired"
        />
      </div>
    </div>
    <Splitter
        v-else
        style="background:var(--surface-200);"
        @mousedown="noPointerTrue"
        @mouseup="noPointerFalse"
    >
      <SplitterPanel :minSize="20" :size="40">
        <div class="search-bar">
          <div class="search-div">
            <span class="p-input-icon-right">
                <i v-if="!loading" aria-hidden="true" class="pi pi-search" @click="queryBackends(query)"/>
                <i v-else aria-hidden="true" class="pi pi-spin pi-spinner"/>
                <InputText v-model="query" placeholder="Sleuth..." size="70" @keyup.enter="queryBackends(query)"/>
            </span>
            <span class="advanced-search-toggle">
              <checkbox
                  v-model="advancedSearch"
                  :binary="true"
                  v-tooltip.top="'Allows you to construct advanced queries using logical operators and brackets: ' +
                   'e.g. (some code AND (john OR Dave)) AND return. If not turned on, brackets will be seen as part ' +
                    'of your search query. I.e. the system will match on brackets.'"
                  @click="reRunQuery">
              </checkbox>
              Advanced Search
            </span>
          </div>
        </div>
        <div class="search-results container">
          <search-result-card
              v-for="(r,i) in searchResults"
              :key="i"
              :="r"
              :small=true
              @snippetClicked="goToLineFetchFileIfRequired"
          />
        </div>
      </SplitterPanel>
      <SplitterPanel :minSize="40" class="container">
        <iframe
            :class="{ iFrameNoPointer: noPointer }"
            v-if="iFrameLink !== ''"
            name="name_of_iframe"
            :src="iFrameLink"
        ></iframe>
        <div v-else>
          <div class="next-prev">
            <icon-simple-expand-more class="clickable" @click="scrollToNextResult"/>
            <icon-simple-expand-less class="clickable" @click="scrollToPrevResult"/>
          </div>
          <div class="file-container">
            <div id="full_file" v-html="fullFileData">
            </div>
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
  import {min} from "lodash/math";

  /**
   * @typedef {Object} MatchSnippet
   * @property {string} snippet
   * @property {number} line_number
   */

  /**
   * @typedef {Object} SearchResult
   * @property {string} id
   * @property {string} type
   * @property {string} source
   * @property {string} datasource_name
   * @property {string} datasource_icon
   * @property {[MatchSnippet]} match_snippets
   * @property {string} link
   * @property {string} name
   * @property {number} backendId
   * @property {[number]} lineNumbers
   */

  /**
   * @typedef {Object} Backend
   * @property {Object} local
   * @property {Object} connect
   * @property {Object}
   */

  export default {
    name: "SearchBar",

    components: {
      IconSimpleExpandLess,
      IconSimpleExpandMore,
      SearchResultCard,
    },

    data() {
      return {
        advancedSearch: false,
        fullFileLineNumbers: [],
        currentLineNumber: -1,
        fullFileData: "",
        fullFileId: "",
        notDeleted: true,
        query: "",
        searchResults: [],
        searchResultsBuffer: [],
        name: "Search",
        firstSearch: true,
        noPointer: false,
        iFrameLink: '',
        loading: false
      }
    },

    computed: {
      ...mapGetters([
        'unconnectedBackendNo',
        'unconnectedBackendBool',
        'unconnectedBackendNames'
      ]),
      state(){
        return this.$store.getters.getRefreshState;
      }
    },

    watch: {
      state(newState){
        this.reRunQuery();
      }
    },

    beforeMount() {
      if (this.$store.getters.getNewAppStatus) {
        this.$router.push('/');
      }
    },

    mounted(){
      this.$refs.Sleuth.$el.focus();
    },

    methods: {
      reRunQuery() {
        if (this.query !== "") {
          this.searchResults = [];
          this.queryBackends(this.query)
        }
      },
      /**
       * Queries each active backend of the user for this.query then saves search results to this.searchResults.
       *
       * If a query to a backend fails due to an expired JWToken the function will refresh the token and retry the query.
       *
       * On no results returned from any backend a warning toast will be raised.
       *
       * @param {string} q the string to query verbatim
       * @returns {Promise<void>}
       */
      async queryBackends(q) {
        this.firstSearch = false;
        this.loading = true;
        this.searchResultsBuffer = [];
        this.searchResults = [];
        for (let backend of this.$store.getters.getUserBackends(this.$store.getters.getSignedInUserId)) {
          if (!backend.local.active) {
            continue;
          }
          const url = `http://${backend.connect.link}/general/?q=${
              encodeURIComponent(
                  this.advancedSearch ? q : this.escapeSolrControlCharacters(q)
              )
          }`;
          let headers = {"Authorization": "Bearer " + backend.connect.keys.jwtToken};
          await axios
              .get(url, {headers})
              .then((resp) => {
                this.augmentAndSaveSearchResults(resp.data.searchResults, backend)
              })
              .catch(async () => {
                await this.$store.dispatch("refreshJWTToken", {id: backend.local.id});
                headers = {"Authorization": "Bearer " + this.$store.getters.getBackendJWTToken(backend.local.id)};
                await axios
                    .get(url, {headers})
                    .then((resp) => {
                      this.augmentAndSaveSearchResults(resp.data.searchResults, backend)
                    })
                    .catch((e) => {
                      console.error(e);
                      if (e.toString().includes("500")) {
                          this.$toast.add({
                            severity: 'error',
                            summary: 'Internal Server Error',
                            detail: "Could not connect to server. Please ensure solr is running",
                            life: 3000
                          })
                      }
                    })
              })
        }
        this.searchResults = this.searchResultsBuffer;
        if (this.searchResults.length === 0) {
          this.$toast.add({severity: 'warn', summary: 'No results', detail: "Try search again", life: 3000})
        }
        this.loading = false;
      },

      /**
       * @param {string} query string that might contain special solr control characters
       * @returns {string} string with any special control characters escaped
       */
      escapeSolrControlCharacters(query) {
        return query.replace(/[{}\[\]+\-^.:()]/gm, (match) => {
          return '\\' + match
        })
      },

      /**
       * For each search result object do: whitelistEscape any html; add backend data; then concat these to searchResults.
       *
       * @param {[SearchResult]} results search results as returned by backend
       * @param backend backend info from store
       */
      augmentAndSaveSearchResults(results, backend) {
        for (let r of results) {
          for (let match_snippet of r.match_snippets) {
            match_snippet.snippet = this.whitelistEscape(match_snippet.snippet);
          }
          r.datasource_icon = this.whitelistEscape(r.datasource_icon);
          r.lineNumbers = this.extractLineNumbers(r.match_snippets);
          r.link = backend.connect.link;
          r.backend_name = backend.local.name;
          r.backendId = backend.local.id;
        }
        this.searchResultsBuffer = this.mergeLists(this.searchResultsBuffer, results);
      },

      /**
       * @param {[]} a
       * @param {[]} b
       *
       * @return {[]}
       */
      mergeLists(a, b) {
        let newList = [];
        for (let i = 0; i < min([a.length, b.length]); i++) {
          newList.push(a.pop())
          newList.push(b.pop())
        }
        newList = newList.concat(a);
        newList = newList.concat(b);
        return newList;
      },

      /**
       * @param {[MatchSnippet]} match_snippets
       * @return {[number]} line numbers of match_snippets
       */
      extractLineNumbers(match_snippets) {
        let lineNumbers = [];
        for (let i = 0; i < match_snippets.length; i++) {
          lineNumbers.push(match_snippets[i].line_number);
        }
        return lineNumbers;
      },

      /**
       * Go to target line in full file, load full file from backend if not already loaded.
       *
       * If first attempt to load file from backend fails due to an expired JWToken, the token will be refreshed and
       * the call to the backend will be repeated.
       *
       * @param {string} link uri of source server
       * @param {string} type service to use at server
       * @param {string} id uuid of result document
       * @param {number} backendId id of backend in user store
       * @param {number} lineNumber line number of the result snippet the user has clicked on
       * @param {[number]} lineNumbers line numbers of all the match snippets in the result source
       * @param {string} source the location of the original datasource
       * @param {string} searchTerm the search term that is highlighted inside the search snippet
       */
      goToLineFetchFileIfRequired(link, type, id, backendId, lineNumber, lineNumbers, source, searchTerm) {
        if (type === "webpage"){
          this.openIframe(source);
          return;
        }
        if (this.fullFileId === id) {
          this.scrollFullFileLineIntoView(lineNumber);
          return;
        }
        const url = `http://${link}/general/fullfile?type=${type}&id=${id}&search_term=${searchTerm}`;
        const headers = {
          "Authorization": "Bearer " + this.$store.getters.getBackendJWTToken(backendId)
        };
        axios
            .get(url, {headers})
            .then((resp) => {
              this.displayFullFileAtLineNumber(resp.data.data, lineNumber, lineNumbers)
            })
            .catch(async () => {
              await this.$store.dispatch("refreshJWTToken", {id: backendId});
              const headers = {
                "Authorization": "Bearer " + this.$store.getters.getBackendJWTToken(backendId)
              };
              await axios
                  .get(url, {headers})
                  .then((resp) => {
                    this.displayFullFileAtLineNumber(resp.data.data, lineNumber, lineNumbers);
                  })
                  .catch()
            });
        this.fullFileId = id;
        this.iFrameLink = '';
      },

      openIframe(link) {
        this.iFrameLink = link;
      },

      /**
       * Escape all tokens not in the whitelist defined by our whitelistRegex.
       * Check resulting html tags to ensure all of them are correctly closed. If not, return warning html.
       *
       * Security Note: NEVER allow any type of closing tags in the validWord regex snippet.
       * This would render the function unsafe.
       *
       * @param {string} content suspect html
       * @returns {string} sanitised html
       */
      whitelistEscape(content) {
        if (content === undefined) {
          return ""
        }
        // Parts Of Regex
        const validWord = "[\\w\\s\\-_/:;,#.]+"; // WARNING: NO closing tags allowed in here! {', ", >} are ILLEGAL here.
        const validAttributeTypes = ["class", "title", "d", "fill", "height", "style", "viewBox", "width", "id"];
        const validHtmlTags = ["code", "div", "em", "h1", "h2", "pre", "path", "span", "svg", "br"];
        // Full Regex
        const validAttribute = `(?:\\s(?:${validAttributeTypes.join("|")})=(?:"(?:${validWord})"|'(?:${validWord})'))*`;
        //
        let whitelist_production_line = [];
        for (let i = 0; i < validHtmlTags.length; i++) {
          whitelist_production_line.push(`<${validHtmlTags[i]}${validAttribute}>|<\/${validHtmlTags[i]}>`)
        }
        let whitelistRegex = new RegExp(whitelist_production_line.join("|"), "g");
        let matches = content.match(whitelistRegex);
        if (matches === null) {
          return this.escapeLessThanChar(content)
        } else if (this.confirmThatAllOpenedTagsAreClosed(matches)) {
          return this.escapeAllExceptMatches(content, matches);
        } else {
          console.log(content)
          return "<div><h2>Data from server seems malformed. For your security it will not be displayed.</h2></div>"
        }
      },

      /**
       * Escape all content except the ordered list of legal tokens.
       *
       * @param {string} content html that might be unsafe
       * @param {[string]} legalTokens exhaustive ordered list of legal tokens that actually exist in the content
       * @returns {string} content with only legal tokens not escaped
       */
      escapeAllExceptMatches(content, legalTokens) {
        let processedString = "";
        for (let i = 0; i < legalTokens.length; i++) {
          let start_index_of_whitelisted_section = content.search(legalTokens[i]);
          processedString += this.escapeLessThanChar(
              content.substr(0, start_index_of_whitelisted_section)
          ) + legalTokens[i];
          content = content.substr(start_index_of_whitelisted_section + legalTokens[i].length);
        }
        return processedString;
      },

      /**
       * Html escape function only to be used where we are guaranteed to have no preceding half-created html tags.
       *
       * @param string html string that can be rendered by a browser
       * @returns {string} "html" string that is "dead" to a browser
       */
      escapeLessThanChar(string) {
        return string.replace(/</g, "&lt;")
      },

      /**
       * @param {[string]} tags ordered list of tags from some html string
       * @returns {boolean} true if all tags were closed, false otherwise
       */
      confirmThatAllOpenedTagsAreClosed(tags) {
        let stack = [];
        for (let i = 0; i < tags.length; i++) {
          let tag = tags[i];
          if (tag.substr(0, 2) === "</") {
            if (stack.length === 0 || stack.pop() !== this.extractHtmlTagName(tag)) {
              return false;
            }
          } else {
            let tagName = this.extractHtmlTagName(tag);
            if (tagName !== "br") {
              stack.push(tagName);
            }
          }
        }
        return stack.length === 0;
      },

      /**
       * @param {string} tag html tag
       * @returns {string}
       */
      extractHtmlTagName(tag) {
        return tag.match(/[A-Za-z0-9]+/)[0];
      },

      /**
       * @param {html} fileData the html file to display
       * @param {number} lineNumber line number of result to go to
       * @param {[number]} lineNumbers line numbers of all results found in file
       */
      displayFullFileAtLineNumber(fileData, lineNumber, lineNumbers) {
        this.fullFileData = this.whitelistEscape(fileData);
        this.fullFileLineNumbers = lineNumbers;
        this.$nextTick().then(() => {
          this.scrollFullFileLineIntoView(lineNumber);
        })
      },

      /**
       * @param lineNumber
       */
      scrollFullFileLineIntoView(lineNumber) {
        this.currentLineNumber = lineNumber;
        this.$el.querySelector(`#line_number_${lineNumber}`).scrollIntoView();
      },

      scrollToPrevResult() {
        let index = Math.max(
            0,
            this.fullFileLineNumbers.findIndex((item) => {
              return this.currentLineNumber === item
            }) - 1
        );
        this.scrollFullFileLineIntoView(this.fullFileLineNumbers[index]);
      },

      scrollToNextResult() {
        let index = Math.min(
            this.fullFileLineNumbers.length - 1,
            this.fullFileLineNumbers.findIndex((item) => {
              return this.currentLineNumber === item
            }) + 1
        );
        this.scrollFullFileLineIntoView(this.fullFileLineNumbers[index]);
      },

      noPointerTrue() {
        this.noPointer = true;
      },

      noPointerFalse() {
        this.noPointer = false;
      }
    }
  };
</script>

<style scoped>
  @import "ia-dark.min.css";

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
    max-width: 100%;
  }

  .container {
    height: available;
    overflow-y: scroll;
    overflow-x: scroll;
    font-size: 0.9em;
  }

  input {
    width: 100%;
    min-width: 0;
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
    max-width: 1000px;
  }

  .search-div-initial{
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 30px;
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
    font-size: 1rem !important;
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

  .p-splitter {
    border: none;
  }

  .p-splitter-panel {
    max-width: 60vw;
  }

  #full_file {
    padding-left: 10px;
    padding-top: 40px;
    padding-bottom: 40px;
  }

  .advanced-search-toggle {
    padding-left: 15px;
    min-width: 170px;
  }

  #divider_usage_message {
    color: #4d4d4d;
    padding-left: 10px;
  }

  .iFrameNoPointer {
    pointer-events: none;
  }

  iframe {
    width: 100%;
    height: 100vh;
  }

  .search-results{
    color: rgba(255, 255, 255, 0.87);
  }
</style>