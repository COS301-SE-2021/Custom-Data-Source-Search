<template>
  <div class="result-card">
    <div class="card-icon">
      <span id="text" title="File Datasource" v-if="isTextFile()"><file-data-source/></span>
      <span id="folder" title="Folder Datasource" v-else-if="isFolder()"><folder-datasource/></span>
      <span id="webpage" title="Webpage Datasource" v-else-if="isWebpage()"><webpage-datasource/></span>

    </div>
    <p v-for="(line, index) in occurrences" :key="index"> {{ line.occurrenceString }} <br></p>
    <small> {{ source }}</small>
  </div>
</template>

<script>
import FileDataSource from "../datasources/text/TextDatasource";
import FolderDatasource from "../datasources/folder/FolderDatasource";
import WebpageDatasource from "../datasources/webpage/WebpageDatasource";
export default {
  name: "TextResultCard",
  components: {WebpageDatasource, FolderDatasource, FileDataSource},
  props: {
    type: String,
    source: String,
    occurrences: Array,
  },
  methods: {
    isTextFile() {
      return this.type === "text"
    },
    isFolder() {
      return this.type === "folder"
    },
    isWebpage() {
      return this.type === "webpage"
    }
  }
}
</script>

<style scoped>
  .result-card {
    background-color: rgba(0, 0, 0, 0.2);
    text-align: left;
    max-width: 1000px;
    margin: 10px auto auto;
    border-radius: 10px;
    padding: 10px 20px;
  }
  h1 {
    font-size: 2em;
  }

  h2 {
    font-size: 1.5em;
  }

  p {
    font-size: 1em;
  }

  .card-icon {
    text-align: right;
    float: right;
    padding-top: 10px;
  }

</style>