<template>
  <span>Select one or more Files to add to data sources</span><br/>
  <Button label="Browse" icon="pi pi-plus" class="p-button-raised p-button-text" @click="addDataSource()"/><br/>
  <span>Selected Files</span>
  <div class="selected-files">
    <ScrollPanel style="width: 100%; height: 70px">
      <span class="selection-list" v-if="filename.length!==0" v-for="i in filename" :key="i.id">{{i}}</span>
      <span v-else class="selection-list">No files selected.</span>
    </ScrollPanel>
  </div>
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
  <Button icon="pi pi-check" class="p-button-rounded p-button-text" @click="submitSource()"/>
</template>

<script>
import axios from 'axios';
const electron = require('@electron/remote');
const fs = require('fs');
const FormData = require('form-data')
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
      type: 'file',
      filename: [],
      path: [],
      filepaths: [] //Paths used for uploading to remote server
    }
  },
  methods: {
    addDataSource() {
      console.log(this.backend)
      if(this.backend==='Local'){
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

                let p, str;

                //for every file selected
                for (let i = 0; i < files.filePaths.length; i++) {

                  str = files.filePaths[i]

                  //Force use of / in URI's across all platforms
                  str = str.replaceAll("\\", "/")

                  p = str.split("/")
                  this.filename.push(p.pop())
                  this.path.push(p.join("/"))
                }
              }
            })
      }
      else{
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

                //for every file selected
                for (let i = 0; i < files.filePaths.length; i++) {
                  let p, str;
                  str = files.filePaths[i]

                  //Force use of / in URI's across all platforms
                  str = str.replaceAll("\\", "/")

                  p = str.split("/")
                  this.filename.push(p.pop())
                  this.filepaths.push(files.filePaths[i].toString())
                  console.log(this.filepaths[i])
                }
              }
            })
      }
    },
    submitSource(){
      if(this.filename.length>0 || this.filepaths.length>0){
        if(this.backend==='Local'){
          for (let i = 0; i < this.filename.length; i++) {
            let respObject = {"filename": this.filename[i], "path": this.path[i], "tag1": this.tag1, "tag2": this.tag2}
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
                  this.$emit("submitted")
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
        else if(this.filepaths && this.filepaths[0]){
          let formData = new FormData();
          let fileStream;
          for(let i =0; i<this.filepaths.length; i++){
            fileStream = fs.readFileSync(this.filepaths[i]);
            formData.set('file', fileStream);
            formData.set('tag1', this.tag1);
            formData.set('tag2', this.tag2);

            axios
              .post(this.$store.getters.getUserBackendURL(this.backend), formData, {
                headers: {'Content-Type': 'multipart/form-data'}
              })
              .then((resp) =>{
                this.$toast.add({
                  severity: 'success',
                  summary: 'Success',
                  detail: resp.data.message,
                  life: 3000
              })
                this.$emit('addFile')
                this.$emit("submitted")
                console.log(resp.data)
              })
              .catch((error) =>{
                this.$toast.add({
                  severity: 'error',
                  summary: 'Error',
                  detail: error.response.data.message,
                  life: 3000
                })
              })
          }
        }
      }
      else{
        this.$toast.add({
          severity: 'info',
          summary: 'No files selected',
          detail: 'Please select files to upload',
          life: 3000
        })
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
</style>