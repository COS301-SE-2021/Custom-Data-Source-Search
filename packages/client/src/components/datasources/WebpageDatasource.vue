<template>
  <div id="container">
    <div class="grid">
      <div>
        <icon-web/>
      </div>
      <div id="header">Webpages</div>
      <div @click="add=!add">
        <icon-min class="add" v-if="add"/>
        <icon-add class="add" v-else />
      </div>
      <div @click="expanded=!expanded" id="expand">
        <svg class="expand" id="minimise" v-if="expanded" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#FFFFFF"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M12 8l-6 6 1.41 1.41L12 10.83l4.59 4.58L18 14l-6-6z"/></svg>
        <svg class="expand" id="expand" v-else xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#FFFFFF"><path d="M24 24H0V0h24v24z" fill="none" opacity=".87"/><path d="M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6-1.41-1.41z"/></svg>
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

#web-datasources {
  padding-bottom: 10px;
}

</style>