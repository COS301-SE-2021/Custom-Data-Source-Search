<template>
  <div class="result-card" v-bind:class="{ 'result-card-small': small }">
    <div class="title-card">
      <small>{{ backend_name }}</small>
      <div class="card-icon">
        <div v-html="datasource_icon"></div>
      </div>
      <div>
        <div
            v-if="datasource_name !== undefined" class="datasource-name"
            @click=open(source)
            @mousedown.right="openFileUsing(source)"
        >
          {{ datasource_name }}
        </div>
        <small
            @click=open(source)
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
    <div v-if="match_snippets.length > 1" class="expand-icon-div">
      <icon-simple-expand-more
          v-if="numberOfResultsToDisplay < match_snippets.length"
          height="25"
          width="25"
          @click="showThreeMoreSnippets"
      />
      <icon-simple-expand-less
          v-else
          height="25"
          width="25"
          @click="showOneSnippet"
      />
    </div>
  </div>
</template>

<script>
import {shell} from "electron";
import SearchResultCardMatchSnippet from "@/components/results/SearchResultCardMatchSnippet";
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
    lineNumbers: Array,
    small: Boolean
  },

  watch: {
    numberOfResultsToDisplay(newNumber, oldNumber) {
      this.updateDisplaySnippets(newNumber, oldNumber)
    }
  },

  mounted() {
    this.snippetsOnDisplay.push(this.match_snippets[0])
  },

  data() {
    return {
      unexpanded: true,
      snippetsOnDisplay: [],
      numberOfResultsToDisplay: 1,
    }
  },

  methods: {
    /**
     * @param {string} source
     */
    open(source) {
      if (source.match(/http\w*/gm)) {
        open(source);
      } else {
        shell.openPath(source);
      }
    },

    /**
     * @param {string} source
     */
    openFileUsing(source) {
      if (source.match(/http\w*/gm)) {
        open(source);
      } else {
        shell.showItemInFolder(source)
      }
    },

    /**
     * @param {number} lineNumber
     */
    emitSnippetClicked(lineNumber) {
      this.$emit(
          'snippetClicked',
          this.link,
          this.type,
          this.id,
          this.backendId,
          lineNumber,
          this.lineNumbers,
          this.source
      )
    },

    toggleNumSnippetsToShow() {
      if (this.numberOfResultsToDisplay === 1) {
        this.showThreeMoreSnippets();
      } else {
        this.showOneSnippet();
      }
    },

    showOneSnippet() {
      this.numberOfResultsToDisplay = 1;
    },

    /**
     * Show (up to) three more result snippets.
     */
    showThreeMoreSnippets() {
      this.numberOfResultsToDisplay += 3;
    },

    /**
     * @param newNumber upper bound of result snippets to display
     */
    updateDisplaySnippets(newNumber) {
      this.snippetsOnDisplay = [];
      for (let i = 0; i < Math.min(newNumber, this.match_snippets.length); i++) {
        this.snippetsOnDisplay.push(this.match_snippets[i])
      }
    }

  },
}
</script>

<style scoped>
.result-card {
  text-align: left;
  margin-right: 10%;
  margin-left: 10%;
  border-radius: 10px;
  padding: 5px 20px;
  overflow: hidden;
  position: relative;
}

.result-card-small {
  text-align: left;
  max-width: 1000px;
  border-radius: 10px;
  padding: 5px 20px;
  margin: 5px;
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

.expand-icon-div {
  width: max-content;
  margin: auto;
  cursor: pointer;
}

.datasource-name {
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

.datasource-name:hover {
  text-decoration: underline;
}

small:hover {
  text-decoration: underline;
}
</style>