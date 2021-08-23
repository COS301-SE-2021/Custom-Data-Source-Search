<template>
  <div class="result-card">
    <div class="title-card">
      <small>{{ backend_name }}</small>
      <div class="card-icon">
        <div v-html="whitelistEscape(datasource_icon)"></div>
      </div>
      <div>
        <div
            v-if="datasource_name !== undefined" class="datasource_name"
            @click=openFile(source)
            @mousedown.right="openFileUsing(source)"
        >
          {{ datasource_name }}
        </div>
        <small
            @click=openFile(source)
            @mousedown.right="openFileUsing(source)"
        >
          {{ source }}
        </small>
      </div>
    </div>
    <div class="snippets">
      <search-result-card-match-snippet
          v-for="(match_snippet, i) in snippetsOnDisplay"
          :key="i"
          :line_number="match_snippet.line_number"
          :snippet="whitelistEscape(match_snippet.snippet)"
          @click="goToLineFetchFileIfRequired(match_snippet.line_number)"
          @mousedown.right="toggleNumSnippetsToShow"
      />
    </div>
    <div v-if="match_snippets.length > 1" class="expand_icon_div">
      <icon-simple-expand-more
          v-if="thereAreMore()"
          height="25"
          width="25"
          @click="showMore"
      />
      <icon-simple-expand-less
          v-else
          height="25"
          width="25"
          @click="showOne"
      />
    </div>
  </div>
</template>

<script>
import {shell} from "electron";
import SearchResultCardMatchSnippet from "@/components/results/SearchResultCardMatchSnippet";
import axios from "axios";
import IconSimpleExpandMore from "@/components/icons/IconSimpleExpandMore";
import IconSimpleExpandLess from "@/components/icons/IconSimpleExpandLess";

export default {
  name: "SearchResultCard",

  components: {
    IconSimpleExpandLess,
    IconSimpleExpandMore,
    SearchResultCardMatchSnippet
  },

  props: {
    id: String,
    type: String,
    source: String,
    datasource_name: String,
    datasource_icon: String,
    match_snippets: Array,
    link: String,
    backendId: Number,
    backend_name: String,
  },

  data() {
    return {
      unexpanded: true,
      snippetsOnDisplay: [],
      numberOfResultsToDisplay: 1
    }
  },

  methods: {

    /**
     * Open file at given path using default software set by OS.
     *
     * @param {string }source
     */
    openFile(source) {
      shell.openPath(source)
    },

    /**
     * Let OS show file at given path in folder.
     *
     * @param {string} source
     */
    openFileUsing(source) {
      shell.showItemInFolder(source)
    },

    /**
     * Escape all tokens not in whitelist defined by validAttribute regex.
     * Check resulting html tags to ensure all are closed.
     *
     * NEVER ALLOW any type of closing tags in the valid_word regex snippet! This would render the function unsafe!
     *
     * @param {string} content suspect html
     * @returns {string} sanitised html
     */
    whitelistEscape(content) {
      if (content === undefined) {
        return ""
      }
      // Parts Of Regex
      const validWord = "[\\w\\s\\-:;,#.]+"; // WARNING: NO closing tags allowed in here! {', ", >} are ILLEGAL here.
      const validAttributeTypes = ["class", "title", "d", "fill", "height", "style", "viewBox", "width"];
      const validHtmlTags = ["code", "div", "em", "h1", "h2", "pre", "path", "span", "svg"];
      // Full Regex
      const validAttribute = `(?:\\s(?:${validAttributeTypes.join("|")})=(?:"(?:${validWord})"|'(?:${validWord})'))*`;
      //
      let whitelist_production_line = []
      for (let i = 0; i < validHtmlTags.length; i++) {
        whitelist_production_line.push(`<${validHtmlTags[i]}${validAttribute}>|<\/${validHtmlTags[i]}>`)
      }
      let whitelistRegex = new RegExp(whitelist_production_line.join("|"), "g")
      let matches = content.match(whitelistRegex)
      if (matches === null) {
        return this.escapeHtml(content)
      } else if (this.confirmThatAllOpenedTagsAreClosed(matches)) {
        return this.escapeAllExceptMatches(content, matches);
      } else {
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
        processedString += this.escapeHtml(content.substr(0, start_index_of_whitelisted_section)) + legalTokens[i];
        content = content.substr(start_index_of_whitelisted_section + legalTokens[i].length);
      }
      return processedString;
    },

    /**
     * Html escape function only to be used where we are guaranteed to have no preceding half-created html tags.
     *
     * @param string
     * @returns {*}
     */
    escapeHtml(string) {
      return string.replace(/</g, "&lt;")
    },

    /**
     * Stack based check to confirm that all html tags that are opened are closed.
     *
     * @param {[string]} tags ordered list of tags from some html string
     * @returns {boolean} true if all tags were closed, false otherwise
     */
    confirmThatAllOpenedTagsAreClosed(tags) {
      let stack = []
      for (let i = 0; i < tags.length; i++) {
        let tag = tags[i]
        if (tag.substr(0, 2) === "</") {
          if (stack.length === 0 || stack.pop() !== this.extractTagName(tag)) {
            return false;
          }
        } else {
          stack.push(this.extractTagName(tag))
        }
      }
      return stack.length === 0;
    },

    /**
     * Extracts the tag name from some closing or opening html tag.
     *
     * @param {string} tag html tag
     * @returns {string}
     */
    extractTagName(tag) {
      return tag.match(/[A-Za-z0-9]+/)[0];
    },


    goToLineFetchFileIfRequired(lineNumber) {
      const url = `http://${this.link}/general/fullfile?type=${this.type}&id=${this.id}`;
      const headers = {
        "Authorization": "Bearer " + this.$store.getters.getBackendJWTToken(this.backendId)
      };
      axios
          .get(url, {headers})
          .then((resp) => {
            this.$emit("resultClicked", resp.data.data, lineNumber, this.extractLineNumbers(this.match_snippets))
          })
          .catch(async () => {
            await this.$store.dispatch("refreshJWTToken", {id: this.backendId})
            const headers = {
              "Authorization": "Bearer " + this.$store.getters.getBackendJWTToken(this.backendId)
            };
            await axios
                .get(url, {headers})
                .then((resp) => {
                  this.$emit("resultClicked", resp.data.data, lineNumber, this.extractLineNumbers(this.match_snippets))
                })
                .catch()
          })
    },
    toggleNumSnippetsToShow() {
      if (this.numberOfResultsToDisplay === 1) {
        this.showMore()
      } else {
        this.showOne()
      }
    },
    thereAreMore() {
      return this.numberOfResultsToDisplay < this.match_snippets.length;
    },
    showMore() {
      this.numberOfResultsToDisplay += 3;
    },
    showOne() {
      this.numberOfResultsToDisplay = 1;
    },
    updateDisplaySnippets(newNumber) {
      this.snippetsOnDisplay = []
      for (let i = 0; i < Math.min(newNumber, this.match_snippets.length); i++) {
        this.snippetsOnDisplay.push(this.match_snippets[i])
      }
    },
    extractLineNumbers(match_snippets) {
      let lineNumbers = [];
      for (let i = 0; i < match_snippets.length; i++) {
        lineNumbers.push(match_snippets[i].line_number);
      }
      return lineNumbers;
    }
  },
  watch: {
    numberOfResultsToDisplay(newNumber, oldNumber) {
      this.updateDisplaySnippets(newNumber, oldNumber)
    }
  },
  mounted() {
    this.snippetsOnDisplay.push(this.match_snippets[0])
  }
}
</script>

<style scoped>
.result-card {
  text-align: left;
  max-width: 1000px;
  border-radius: 10px;
  padding: 5px 20px;
  margin: 5px auto;
  overflow: hidden;
  position: relative;
}

.title-card {
  background-color: #1f1f1f;
  padding: 10px;
}

h1 {
  font-size: 2em;
}

h2 {
  font-size: 1.5em;
}

.card-icon {
  text-align: right;
  float: right;
  padding-top: 10px;
  width: 100px;
}

.expand_icon_div {
  width: max-content;
  margin: auto;
  cursor: pointer;
}

.datasource_name {
  word-wrap: break-word;
  padding-top: 10px;
  padding-bottom: 5px;
  font-size: 1.1em;
  font-weight: bold;
  cursor: pointer;
}

small {
  word-wrap: break-word;
  cursor: pointer;
  color: #7e96a1;
  padding-bottom: 5px;
}

.datasource_name:hover {
  text-decoration: underline;
}

small:hover {
  text-decoration: underline;
}
</style>