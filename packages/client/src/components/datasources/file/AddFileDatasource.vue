<template>
  <ScrollPanel>
    <span>
      Select one or more Files to add to data sources
    </span>
    <br/>
    <Button label="Browse" icon="pi pi-plus" class="p-button-raised p-button-text" @click="selectFiles()"/>
    <br/>
    <span>
      Selected Files
    </span>
    <div class="selected-files">
      <ScrollPanel style="width: 100%; height: 10vh">
        <ul v-if="filenames.length!==0">
          <li
              v-for="file in filenames"
              :key="file.id"
          >
            {{file}}
          </li>
        </ul>
        <span v-else class="selection-list">
          No files selected.
        </span>
      </ScrollPanel>
    </div>
    <div>
      <span>
        Add optional tags
      </span>
      <br/>
      <span class="p-float-label">
        <InputText id="tag1" v-model="tag1" type="text"/>
        <label for="tag1">
          Tag 1
        </label>
      </span>
      <span class="p-float-label">
        <InputText id="tag2" v-model="tag2" type="text"/>
        <label for="tag2">
          Tag 2
        </label>
      </span>
    </div>
    <Button icon="pi pi-check" class="p-button-rounded p-button-text" @click="submitSelectedFiles()"/>
  </ScrollPanel>
</template>

<script>
import axios from 'axios';

const electron = require('@electron/remote');

export default {
  name: "AddFileDatasource",

  props:{
    backend: String,
  },

  data() {
    return {
      dataSourceURI: "",
      tag1: null,
      tag2: null,
      type: 'file',
      filenames: [],
      paths: []
    }
  },

  methods: {
    selectFiles() {
      electron.dialog.showOpenDialog({
        title: 'Select Files to Add as Data Sources',
        buttonLabel: "Select",
        filters: [
          {
            name: 'All Files',
            extensions: ['*']
          }],
        properties: ['openFile', 'multiSelections']
      })
          .then(files => {
            if (files.filePaths && files.filePaths[0]) {
              let p, str;
              for (let i = 0; i < files.filePaths.length; i++) {
                str = files.filePaths[i];
                str = str.replaceAll("\\", "/");
                p = str.split("/");
                this.filenames.push(p.pop());
                this.paths.push(p.join("/"));
              }
            }
          })
    },

    submitSelectedFiles(){
      if(this.filenames.length!==0){
        for (let i = 0; i < this.filenames.length; i++) {
          let respObject = {"filename": this.filenames[i], "path": this.paths[i], "tag1": this.tag1, "tag2": this.tag2};
          axios
              .post(
                  `http://${this.$store.getters.getBackendLinkUsingName(this.backend)}/filedatasources`,
                  respObject
              )
              .then((resp) => {
                this.$toast.add({
                  severity: 'success',
                  summary: 'Success',
                  detail: resp.data.message,
                  life: 3000
                });
                this.$emit('addFile');
                this.$emit("submitted");
              })
              .catch((error) => {
                this.$toast.add({
                  severity: 'error',
                  summary: 'Error',
                  detail: error.response.data.message,
                  life: 3000
                });
              })
        }
      }
      else{
        this.$toast.add({
          severity: 'error',
          summary: 'No files selected',
          detail: 'Try selecting some files to add',
          life: 3000
        });
      }
    }
  }
}
</script>

<style scoped>
div {
  padding: 0 15px 15px 0;
}

input {
  min-width: 90%;
  font-size: 15px;
  font-style: italic;
  height: 5px;
  background: #2a2a2a;
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

.selected-files{
  color: #9e9d9e;
  font-style: italic;
  font-size: 15px;
  margin-top: 15px;
}

.selection-list{
  display: block;
  margin-bottom: 2px;
}

.p-scrollpanel{
  height: 50vh;
  bottom: 2em;
  padding-bottom: 1vh;
  align-content: center;
}
</style>