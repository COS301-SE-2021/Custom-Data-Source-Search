<template>
  <div class="data-input">
    <input :placeholder="placeholderPath" v-model="dataSourceURI" v-on:keyup.enter="addDataSource"/>
    <button class="add-datasource" @click="addDataSource(endpoint)">Add</button>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  name: "AddDataURI",
  props: {
    placeholderPath: String,
    endpoint: String
  },
  data() {
    return {
      dataSourceURI: ""
    }
  },
  methods: {
    addDataSource(endpoint) {
      let respObject = undefined
      if (endpoint === "http://localhost:3001/textdatasources") {
        let p = this.dataSourceURI.split("/")
        let filename = p.pop()
        let path = p.join("/")
        respObject = {"fileName": filename, "filePath": path}
      } else if (endpoint === "http://localhost:3001/webpagedatasources") {
        respObject = {"url": this.dataSourceURI}
      } else {
        respObject = {"path": this.dataSourceURI}
      }
      console.log(respObject)
      axios
          .post(endpoint, respObject)
          .then(resp => {
            console.log(resp.data)
            this.$toast.add({severity: 'success', summary: 'Success', detail: resp.data.message, life: 3000})
          })
          .catch(() => {
            this.$toast.add({severity: 'error', summary: 'Error', detail: 'Could not add data source.', life: 3000})
          })
    }
  }
}
</script>

<style scoped>

div {
  padding: 15px;
}

.data-input {
  min-width: 100%
}

input {
  min-width: 90%
}

.add-datasource {
  float: right;
  border-radius: 10px;
  max-height: 100%;
}

</style>