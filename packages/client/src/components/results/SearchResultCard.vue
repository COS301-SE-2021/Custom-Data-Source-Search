<template>
  <div class="result-card">
    <div class="card-icon" v-html="whitelistEscape(datasource_icon)">
    </div>
    <div>
      <h3 class="datasource_name" v-if="datasource_name !== undefined">{{ datasource_name }}</h3>
      <h3 class="datasource_name" v-else>DataSource Not Named</h3>
      <small @click=openFile(source) @mousedown.right="openFileUsing(source)" >{{source}}</small>
    </div>
    <div class="snippets">
      <search-result-card-match-snippet
        v-for="(match_snippet, i) in match_snippets"
        :key="i"
        :line_number="match_snippet.line_number"
        :snippet="whitelistEscape(match_snippet.snippet)"
        @click="goToLineFetchFileIfRequired(match_snippet.line_number)"
      />
    </div>
  </div>
</template>

<script>
import {shell} from "electron";
import SearchResultCardMatchSnippet from "@/components/results/SearchResultCardMatchSnippet";
import axios from "axios";

export default {
  name: "SearchResultCard",
  components: {SearchResultCardMatchSnippet},
  props: {
    id: String,
    type: String,
    source: String,
    datasource_name: String,
    datasource_icon: String,
    match_snippets: Array
  },
  methods: {
    openFile(source) {
      const {shell} = require('electron')
      shell.openPath(source)
    },
    openFileUsing(source) {
      const {shell} = require('electron')
      shell.showItemInFolder(source)
    },
    whitelistEscape(content) {
      if (content === undefined) {
        return ""
      }
      let valid_word = "[A-Za-z_][\\w\\s\\-:;,#.]+";
      let valid_attribute_types = ["class", "title", "d", "fill", "height", "style", "viewBox", "width"];
      let valid_html_tags = ["code", "div", "em", "h1", "h2", "pre", "path", "span", "svg"];

      let valid_attribute = `(?:\\s(?:${valid_attribute_types.join("|")})=(?:"(?:${valid_word})"|'(?:${valid_word})'))*`;
      let whitelist_production_line = []
      for (let i = 0; i < valid_html_tags.length; i++) {
        whitelist_production_line.push(`<${valid_html_tags[i]}${valid_attribute}>|<\/${valid_html_tags[i]}>`)
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
    escapeAllExceptMatches(content, matches) {
      let processedString = "";
      for (let i = 0; i < matches.length; i++) {
        let start_index_of_whitelisted_section = content.search(matches[i]);
        processedString += this.escapeHtml(content.substr(0, start_index_of_whitelisted_section)) + matches[i];
        content = content.substr(start_index_of_whitelisted_section + matches[i].length);
      }
      return processedString;
    },
    escapeHtml(string) {
      return string.replace(/</g, "&lt;")
    },
    confirmThatAllOpenedTagsAreClosed(matches) {
      let stack = []
      for (let i = 0; i < matches.length; i++) {
        let tag = matches[i]
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
    extractTagName(tag) {
      return tag.match(/[A-Za-z0-9]+/)[0];
    },
    goToLineFetchFileIfRequired(lineNumber) {
      if (this.$parent.getIdOfCurrentFullFile() !== this.id) {
        axios.get(`http://localhost:3001/general/fullfile/?type=${type}&id=${this.id}`).then((resp) => {
          this.$parent.loadFullFile(this.whitelistEscape(resp.data))
        })
      }
      this.$parent.goToFullFileLine(lineNumber)
    }
  }
}
</script>

<style scoped>
.result-card {
  background-color: rgba(0, 0, 0, 0.2);
  text-align: left;
  max-width: 1000px;
  border-radius: 10px;
  padding: 10px 20px;
  margin: 10px auto;
}

h1 {
  font-size: 2em;
}

h2 {
  font-size: 1.5em;
}

h3 {

}

.card-icon {
  text-align: right;
  float: right;
  padding-top: 10px;
}
small {
  cursor: pointer;
  color: #7e96a1;
}
</style>