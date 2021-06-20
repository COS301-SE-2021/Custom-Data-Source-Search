<template>
  <div id="container">
    <div class="grid">
      <div>
        <span id="folder" title="Folder Datasource"><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#f1c40f"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M9.17 6l2 2H20v10H4V6h5.17M10 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z"/></svg></span>
      </div>
      <div id="header">Folders</div>
      <div @click="add=!add">
        <svg class="add" v-if="add" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#FFFFFF"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M19 13H5v-2h14v2z"/></svg>
        <svg class="add" v-else xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 24 24" height="24px" viewBox="0 0 24 24" width="24px" fill="#FFFFFF"><g><rect fill="none" height="24" width="24"/></g><g><g><path d="M19,13h-6v6h-2v-6H5v-2h6V5h2v6h6V13z"/></g></g></svg>
      </div>
      <div @click="expanded=!expanded" id="expand">
        <svg class="expand" id="minimise" v-if="expanded" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#FFFFFF"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M12 8l-6 6 1.41 1.41L12 10.83l4.59 4.58L18 14l-6-6z"/></svg>
        <svg class="expand" id="expand" v-else xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#FFFFFF"><path d="M24 24H0V0h24v24z" fill="none" opacity=".87"/><path d="M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6-1.41-1.41z"/></svg>
      </div>
    </div>
    <div v-if="add">
      <AddDataURI placeholder-path="Folder URI"></AddDataURI>
    </div>
    <div v-if="expanded" id="folder-datasources">
      <DataSourceCard title="Document"></DataSourceCard>
      <DataSourceCard title="Something"></DataSourceCard>
      <DataSourceCard title="Else"></DataSourceCard>
      <DataSourceCard title="path/name/"></DataSourceCard>
      <DataSourceCard title="dont/know/what/to"></DataSourceCard>
    </div>
  </div>
</template>

<script>
import DataSourceCard from "./DataSourceCard";
import AddDataURI from "./AddDataURI";

export default {
  name: "FolderDatasource",
  data() {
    return {
      expanded: false,
      add: false
    }
  },
  components: {
    DataSourceCard,
    AddDataURI
  }
}
</script>

<style scoped>
#container {
  vertical-align: center;
  width: 100%;
  text-align: left;
  border-radius: 10px;
  margin-top: 10px;
  background-color: #212121;
  padding-left: 20px;
  padding-right: 20px;
}

.add {
  float: right;
  cursor: pointer;
}

#header {
  font-weight: bold;
  padding-top: 28px;
}

.expand {
  float: right;
}

#expand {
  cursor: pointer;
}

.grid {
  display: grid;
  grid-template-columns: 1fr 6fr 1fr 1fr;
}

.grid div {
  width: 100%;
  vertical-align: center;
  padding-top: 20px;
  padding-bottom: 20px;
}

#folder-datasources {
  padding-bottom: 10px;
}

</style>