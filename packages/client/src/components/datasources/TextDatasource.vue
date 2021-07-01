<template>
  <div id="container">
    <div class="grid">
      <div v-on:click="$emit('expandText')">
        <icon-file icon-color="#2ecc71"/>
      </div>
      <div id="header" v-on:click="$emit('expandText')">Text Files</div>
      <div>
        <icon-min @click="add=!add" class="add" v-if="add"/>
        <icon-add @click="add=!add" class="add" v-else />
      </div>
<!--      <div id="expand" >-->
<!--        <icon-expand-less @click="expanded=!expanded" class="expand" id="minimise" v-if="expanded" />-->
<!--        <icon-expand-more @click="expanded=!expanded" class="expand" v-else />-->
<!--      </div>-->
    </div>
    <div v-if="add">
      <AddDataURI placeholder-path="Enter Text File URI..." endpoint="http://localhost:3001/textdatasources"></AddDataURI>
    </div>
    <div v-if="expanded" id="text-datasources">
      <DataSourceCard
          v-for="(item, index) in dataSources"
          :key=index :title="item.path + item.filename"
          :id="item.uuid"
          endpoint="http://localhost:3001/textdatasources"
      >
      </DataSourceCard>
    </div>
  </div>
</template>

<script>
import DataSourceCard from "./DataSourceCard";
import AddDataURI from "./AddDataURI";
import IconFile from "../icons/IconFile";
import axios from "axios";
import IconMin from "../icons/IconMin";
import IconAdd from "../icons/IconAdd";
// import IconExpandMore from "../icons/IconExpandMore";
// import IconExpandLess from "../icons/IconExpandLess";

export default {
  name: "FileDataSource",
  data() {
    return {
      expanded: false,
      add: false,
      dataSources: []
    }
  },
  components: {
    // IconExpandLess,
    // IconExpandMore,
    IconAdd,
    IconMin,
    IconFile,
    DataSourceCard,
    AddDataURI
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
}

#header {
  font-weight: bold;
  padding-top: 28px;
}

.expand {
  float: right;
}

.grid {
  display: grid;
  grid-template-columns: 1fr 10fr 1fr 1fr;
  cursor: pointer;
}

.grid div {
  width: 100%;
  vertical-align: center;
  padding-top: 8px;
  padding-bottom: 8px;
}

#text-datasources {
  padding-bottom: 10px;
}

</style>