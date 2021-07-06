<template>
  <div id="container">
    <div class="grid">
      <div v-on:click="$emit('expandWebpage')">
        <icon-web/>
      </div>
      <div v-on:click="$emit('expandWebpage')" id="header">Webpages</div>
      <div>
        <icon-min @click="add=!add" class="add" v-if="add"/>
        <icon-add @click="add=!add" class="add" v-else />
      </div>
    </div>
    <div v-if="add">
      <add-webpage-datasource/>
    </div>
    <div v-if="expanded" id="web-datasources">
      <data-source-card
          v-for="(item, index) in dataSources"
          :key=index
          :title="item.url"
          :id="item.uuid"
          endpoint="http://localhost:3001/webpagedatasources"
      >
      </data-source-card>
    </div>
  </div>
</template>

<script>
import DataSourceCard from "../DataSourceCard";
import AddWebpageDatasource from "@/components/datasources/webpage/AddWebpageDatasource";
import axios from "axios";
import IconWeb from "../../icons/IconWeb";
import IconMin from "../../icons/IconMin";
import IconAdd from "../../icons/IconAdd";

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
    AddWebpageDatasource
  },
  methods: {
    fetchDataSources() {
      axios.get("http://localhost:3001/webpagedatasources").then(
          resp => {
            console.log(resp.data)
            this.dataSources = resp.data
          }
      )
    }
  },
  beforeMount() {
    this.fetchDataSources()
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
  background-color: #2a2a2a;
  padding-left: 20px;
  padding-right: 20px;
}

.add {
  float: right;
}

#header {
  padding-top: 20px;
}

.expand {
  float: right;
}

.grid {
  display: grid;
  grid-template-columns: 1fr 10fr 1fr;
  cursor: pointer;
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