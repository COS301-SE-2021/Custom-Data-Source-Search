<template>
  <div id="container">
    <div class="grid-data-card">
      <div v-on:click="$emit('expandText')" id="grid-data-card-div-1">
        <icon-file icon-color="#2ecc71"/>
      </div>
      <div id="header" v-on:click="$emit('expandText')">Text Files</div>
      <div>
        <icon-min @click="add=!add" class="add" v-if="add"/>
        <icon-add @click="add=!add" class="add" v-else />
      </div>
    </div>
    <div v-if="add">
      <add-text-datasource/>
    </div>
  </div>
</template>

<script>
import IconFile from "../../icons/IconFile";
import axios from "axios";
import IconMin from "../../icons/IconMin";
import IconAdd from "../../icons/IconAdd";
import AddTextDatasource from "./AddTextDatasource";

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
    AddTextDatasource,
    IconAdd,
    IconMin,
    IconFile
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
  padding-top: 15px;
}

.grid-data-card {
  display: grid;
  grid-template-columns: 1fr 10fr 1fr;
  cursor: pointer;
}

.grid-data-card div {
  max-height: 45px;
  width: 100%;
  padding-top: 8px;
  padding-bottom: 8px;
}

#grid-data-card-div-1 {
  margin-bottom: 8px
}


</style>