<template>
  <div id="container">
    <div class="grid">
      <div>
        <span title="File Datasource"><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#2ecc71"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M8 16h8v2H8zm0-4h8v2H8zm6-10H6c-1.1 0-2 .9-2 2v16c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm4 18H6V4h7v5h5v11z"/></svg></span>
      </div>
      <div id="header">Text Files</div>
      <div @click="add">
        <svg class="add" xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 24 24" height="24px" viewBox="0 0 24 24" width="24px" fill="#FFFFFF"><g><rect fill="none" height="24" width="24"/></g><g><g><path d="M19,13h-6v6h-2v-6H5v-2h6V5h2v6h6V13z"/></g></g></svg>
      </div>
      <div @click="expanded=!expanded" id="expand" >
        <svg class="expand" id="minimise" v-if="expanded" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#FFFFFF"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M12 8l-6 6 1.41 1.41L12 10.83l4.59 4.58L18 14l-6-6z"/></svg>
        <svg class="expand" id="expand" v-if="!expanded" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#FFFFFF"><path d="M24 24H0V0h24v24z" fill="none" opacity=".87"/><path d="M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6-1.41-1.41z"/></svg>
      </div>
    </div>
    <div>
      <AddDataURI placeholder-path="Text File URI"></AddDataURI>
    </div>
    <div v-if="expanded" id="text-datasources">
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
  name: "FileDataSource",
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

#text-datasources {
  padding-bottom: 10px;
}

</style>