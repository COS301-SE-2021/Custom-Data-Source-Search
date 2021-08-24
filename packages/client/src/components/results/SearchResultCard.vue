<template>
  <div class="result-card">
    <div class="title-card">
      <small>{{ backend_name }}</small>
      <div class="card-icon">
        <div v-html="datasource_icon"></div>
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
          :snippet="match_snippet.snippet"
          @click="emitSnippetClicked(match_snippet.line_number)"
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
    lineNumbers: Array
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
     * Emit the snippetClicked event for the parent view to handle
     *
     * @param {number} lineNumber
     */
    emitSnippetClicked(lineNumber) {
      this.$emit('snippetClicked', this.link, this.type, this.id, this.backendId, lineNumber, this.lineNumbers)
    },

    /**
     * If only one snippet is being shown, show three more, else show only one.
     */
    toggleNumSnippetsToShow() {
      if (this.numberOfResultsToDisplay === 1) {
        this.numberOfResultsToDisplay += 3;
      } else {
        this.numberOfResultsToDisplay = 1;
      }
    },

    /**
     * Returns true if the view is currently displaying less match snippets than actually exist.
     *
     * @return {boolean}
     */
    thereAreMore() {
      return this.numberOfResultsToDisplay < this.match_snippets.length;
    },

    updateDisplaySnippets(newNumber) {
      this.snippetsOnDisplay = []
      for (let i = 0; i < Math.min(newNumber, this.match_snippets.length); i++) {
        this.snippetsOnDisplay.push(this.match_snippets[i])
      }
    },

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