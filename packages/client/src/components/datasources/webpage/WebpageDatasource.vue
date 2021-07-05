<template>
  <div id="container">
    <div class="grid-data-card">
      <div v-on:click="$emit('expandWebpage')" id="grid-data-card-div-1">
        <icon-web/>
      </div>
      <div id="header" v-on:click="$emit('expandWebpage')">Webpages</div>
      <div>
        <icon-min @click="add=!add" class="add" v-if="add"/>
        <icon-add @click="add=!add" class="add" v-else />
      </div>
    </div>
    <div v-if="add">
      <add-webpage-datasource/>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import IconWeb from "../../icons/IconWeb";
import IconMin from "../../icons/IconMin";
import IconAdd from "../../icons/IconAdd";
import AddWebpageDatasource from "./AddWebpageDatasource";

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
    AddWebpageDatasource
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