<template>
  <span>Select one or more Files to add to data sources</span><br/>
  <Button label="Browse" icon="pi pi-plus" class="p-button-raised p-button-text" @click="addDataSource()"/>
  <!--  Please be aware that the below code is simply the skeleton for tags, this functionality does not work as of yet.-->
  <div>
    <span>Add optional tags</span><br/>
    <span class="p-float-label">
        <InputText id="tag1" type="text" v-model="tag1"/>
        <label for="tag1">Tag 1</label>
      </span>
    <span class="p-float-label">
        <InputText id="tag2" type="text" v-model="tag2"/>
        <label for="tag2">Tag 2</label>
      </span>
  </div>
  <!--  Below button does not function yet-->
  <Button icon="pi pi-check" class="p-button-rounded p-button-text"/>
</template>

<script>
import axios from 'axios';
const electron = require('@electron/remote');
export default {
  name: "AddFileDatasource",
  props:{
    backend: String,
    colour: String
  },
  data() {
    return {
      dataSourceURI: "",
      tag1: null,
      tag2: null,
      type: 'file'
    }
  },
  methods: {
    addDataSource() {
      electron.dialog.showOpenDialog({
        title: 'Select Files to Add as Data Sources',
        buttonLabel: "Select",
        filters: [
          {
            name: 'All Files',
            extensions: ['*'] //Will need to expand in the future.
          }],

        properties: ['openFile', 'multiSelections']
      })
          .then(files => {

            //Check that files were successfully selected
            if (files.filePaths && files.filePaths[0]) {

              let p, filename, path, str;

              //for every file selected
              for (let i = 0; i < files.filePaths.length; i++) {

                str = files.filePaths[i]

                //Force use of / in URI's across all platforms
                str = str.replaceAll("\\", "/")

                p = str.split("/")
                filename = p.pop()
                path = p.join("/")

                let respObject = {"fileName": filename, "filePath": path}
                axios
                    .post("http://localhost:3001/filedatasources", respObject)
                    .then((resp) => {
                      this.$toast.add({
                        severity: 'success',
                        summary: 'Success',
                        detail: resp.data.message,
                        life: 3000
                      })
                      this.$emit('addFile')
                    })
                    .catch((error) => {
                      this.$toast.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: error.response.data.message,
                        life: 3000
                      })
                    })
              }
            }
          })
    }
  }
}
</script>

<style scoped>

div {
  padding: 0 15px 15px 0;
}

input {
  font-size: 15px;
  font-style: italic;
  height: 5px;
  background: #242424;
}

.p-button-text{
  margin-top: 15px;
  margin-bottom: 15px;
}

.p-float-label{
  margin-top: 15px;
}

.p-button-rounded{
  float: right;
  margin: 7px;
}

</style>