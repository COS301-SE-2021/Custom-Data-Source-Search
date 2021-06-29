<template>
  <div class="container">
    <div class="grid">
      <div>
        <icon-web/>
      </div>
      <div id="header">Webpages</div>
      <div>
        <icon-min @click="add=!add" class="add" v-if="add"/>
        <icon-add @click="add=!add" class="add" v-else />
      </div>
      <div id="expand" >
        <icon-expand-less @click="expanded=!expanded" class="expand" id="minimise" v-if="expanded" />
        <icon-expand-more @click="expanded=!expanded" class="expand" v-else />
      </div>
    </div>
    <div v-if="add">
      <AddDataURI placeholder-path="Enter Webpage Link..." endpoint="http://localhost:3001/webpagedatasources"></AddDataURI>
    </div>
    <div v-if="expanded" id="web-datasources">
      <DataSourceCard
          v-for="(item, index) in dataSources"
          :key=index
          :title="item.url"
          :id="item.uuid"
          endpoint="http://localhost:3001/webpagedatasources"
      >
      </DataSourceCard>
    </div>
  </div>
</template>

<script>
import DataSourceCard from "./DataSourceCard";
import AddDataURI from "./AddDataURI";
import axios from "axios";
import IconWeb from "../icons/IconWeb";
import IconMin from "../icons/IconMin";
import IconAdd from "../icons/IconAdd";
import IconExpandMore from "../icons/IconExpandMore";
import IconExpandLess from "../icons/IconExpandLess";

export default {
  name: "WebpageDatasource",
  data() {
    return {
      expanded: false,
      add: false,
      dataSources: []
    }
  },
  components: {
    IconExpandLess,
    IconExpandMore,
    IconMin,
    IconAdd,
    IconWeb,
    DataSourceCard,
    AddDataURI
  },
  beforeMount() {
    axios.get("http://localhost:3001/webpagedatasources").then(
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
  background-color: #363636;
  padding-left: 20px;
  padding-right: 20px;
}

.container:hover{
  background-color: #393939;
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
}

.grid div {
  width: 100%;
  vertical-align: center;
  padding-top: 8px;
  padding-bottom: 8px;
}

#web-datasources {
  padding-bottom: 10px;
}

</style>