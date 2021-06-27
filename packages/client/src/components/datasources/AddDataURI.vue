<template>
  <div>
    <input :placeholder="placeholderPath" v-model="dataSourceURI" v-on:keyup.enter="addDataSource">
    <button @click="addDataSource(endpoint)">Add</button>
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

input {
  background-color: #929292;
  padding: 3px;
  border-radius: 8px;
  border: none;
  min-width: 680px;
}

input::placeholder {
  color: black;
  padding-left: 10px;
}

button {
  background-color: #26C6DA;
  border: none;
  border-radius: 12px;
  margin-left: 45px;
  padding: 6px;
  cursor: pointer;
  display: inline;
}

</style>