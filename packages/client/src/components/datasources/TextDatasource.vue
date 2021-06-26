<template>
  <div class="container">
    <div class="grid">
      <div @click="expandedText()">
        <span title="File Datasource"><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#2ecc71"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M8 16h8v2H8zm0-4h8v2H8zm6-10H6c-1.1 0-2 .9-2 2v16c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm4 18H6V4h7v5h5v11z"/></svg></span>
      </div>
      <div id="header" @click="expandedText()">Text Files</div>
      <div @click="add=!add">
        <svg class="add" v-if="add" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#FFFFFF"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M19 13H5v-2h14v2z"/></svg>
        <svg class="add" v-else xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 24 24" height="24px" viewBox="0 0 24 24" width="24px" fill="#FFFFFF"><g><rect fill="none" height="24" width="24"/></g><g><g><path d="M19,13h-6v6h-2v-6H5v-2h6V5h2v6h6V13z"/></g></g></svg>
      </div>

    </div>
    <div v-if="add">
      <AddDataURI placeholder-path="Enter Text File URI..." endpoint="http://localhost:3001/textdatasources"></AddDataURI>
    </div>
  </div>

</template>

<script>

import AddDataURI from "./AddDataURI";
import axios from "axios";
export default {
  name: "FileDataSource",
  data() {
    return {
      add: false,
      dataSources: []
    }
  },
  components: {
    AddDataURI
  },
  methods: {
    expandedText(){
      this.$emit('expandText')
    }
  },
  beforeMount() {
    axios.get("http://localhost:3001/textdatasources").then(
        resp => {
          console.log(resp.data)
          this.dataSources = resp.data
        }
    )
  }
}
</script>

<style scoped>
.container {
  vertical-align: center;
  width: 100%;
  text-align: left;
  border-radius: 10px;
  margin-top: 10px;
  background-color: #2c2c2c;
  padding-left: 20px;
  padding-right: 20px;
}

.container:hover{
  background-color: #393939;
  cursor: pointer;
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
  grid-template-columns: 1fr 6fr 1fr;
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