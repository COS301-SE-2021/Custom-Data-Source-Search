<template>
  <div id="container">
    <div class="grid">
      <div>
        <icon-folder/>
      </div>
      <div id="header">Folders</div>
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
      <add-folder-datasource/>
    </div>
    <div v-if="expanded" id="folder-datasources">
      <data-source-card
          v-for="(item, index) in dataSources"
          :key=index :title="item.path"
          :id="item.uuid"
          endpoint="http://localhost:3001/folderdatasources"
      ></data-source-card>
    </div>
  </div>
</template>

<script>
import DataSourceCard from "../DataSourceCard";
import AddFolderDatasource from "@/components/datasources/folder/AddFolderDatasource";
import axios from "axios";
import IconFolder from "../../icons/IconFolder";
import IconMin from "../../icons/IconMin";
import IconAdd from "../../icons/IconAdd";
import IconExpandMore from "../../icons/IconExpandMore";
import IconExpandLess from "../../icons/IconExpandLess";

export default {
  name: "FolderDatasource",
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
    IconFolder,
    DataSourceCard,
    AddFolderDatasource
  },
  methods: {
      fetchDataSources() {
          axios.get("http://localhost:3001/folderdatasources").then(
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
}

.grid div {
  width: 100%;
  vertical-align: center;
  padding-top: 8px;
  padding-bottom: 8px;
}

#folder-datasources {
  padding-bottom: 10px;
}

</style>