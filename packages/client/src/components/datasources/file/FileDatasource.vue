<template>
  <div id="container">
    <div class="grid">
      <div v-on:click="$emit('expandFile')">
        <icon-file />
      </div>
      <div v-on:click="$emit('expandFile')" id="header">Files</div>
      <div>
        <icon-min @click="add=!add" class="add" v-if="add"/>
        <icon-add @click="add=!add" class="add" v-else />
      </div>
    </div>
    <div v-if="add">
      <add-file-datasource @add-text="$emit('addFile')"/>
    </div>
    <div v-if="expanded" id="file-datasources">
      <data-source-card
          v-for="(item, index) in dataSources"
          :key=index
          :title="item.path + item.filename"
          :id="item.uuid"
          endpoint="http://localhost:3001/filedatasources"
      >
      </data-source-card>
    </div>
  </div>
</template>

<script>
import DataSourceCard from "../DataSourceCard";
import AddFileDatasource from "@/components/datasources/file/AddFileDatasource";
import IconFile from "../../icons/IconFile";
import axios from "axios";
import IconMin from "../../icons/IconMin";
import IconAdd from "../../icons/IconAdd";

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
    IconAdd,
    IconMin,
    IconFile,
    DataSourceCard,
    AddFileDatasource
  },
  methods: {
    fetchDataSources() {
      axios.get("http://localhost:3001/filedatasources").then(
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

#file-datasources {
  padding-bottom: 10px;
}

</style>