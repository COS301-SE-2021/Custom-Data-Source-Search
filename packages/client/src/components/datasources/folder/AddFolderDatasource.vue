<template>
  <span>Select one or more Folders to add as Data Sources</span><br/>
      <Button label="Browse" icon="pi pi-plus" class="p-button-raised p-button-text" @click="addDataSource()"/><br/>
  <span>Selected Folders</span>
  <div class="selected-folders">
    <ScrollPanel style="width: 100%; height: 50px">
      <span class="selection-list" v-if="path.length!==0" v-for="i in path" :key="i.id">{{i}}</span>
      <span v-else class="selection-list">No folders selected.</span>
    </ScrollPanel>
  </div>
  <br/>
  <div class="depth-selector">
    <label for="stacked">Specify depth of folders to search</label>
    <div class="depth-input">
      <InputNumber inputStyle="width: 9.3rem; background-color: #242424;" id="stacked" v-model="depth" showButtons mode="decimal" :min="0"/>
    </div>
  </div>
  <div class="file-ignore">
    <span>Specify which files/sub-folders to ignore</span>
    <Textarea v-model="ignore" rows="5" cols="40"></Textarea>
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
  <Button icon="pi pi-check" class="p-button-rounded p-button-text" @click="submitSource"/>
</template>

<script>
    import axios from 'axios'
    const electron = require('@electron/remote');
    const FormData = require('form-data');
    const fs = require('fs');
    export default {
        name: "AddFolderDatasource",
        props:{
          backend: String,
          colour: String
        },
        data() {
            return {
              dataSourceURI: "",
              tag1: null,
              tag2: null,
              type: 'folder',
              path: [],
              depth: 0,
              ignore: '# Files/folders to be ignored are accepted in a .gitignore format # \n \n'  +
                  'node_modules/ \n' +
                  '*.log \n' +
                  'build/ \n'
            }
        },
        methods: {
            addDataSource() {
                electron.dialog.showOpenDialog({
                  title: 'Select Folders to Add as Data Sources',
                  buttonLabel: "Select",

                  properties: ['openDirectory', 'multiSelections'] })
                    .then(dirs => {

                      //Check that files were successfully selected
                      if(dirs.filePaths && dirs.filePaths[0]) {

                        let str;
                        let temp;
                        //for every folder selected
                        for (let i = 0; i < dirs.filePaths.length; i++) {

                          str = (dirs.filePaths[i])

                          //Force use of / in URI's across all platforms
                          temp = str.replaceAll("\\", "/")
                          this.path.push(temp)

                        }
                      }
                      console.log(this.path)
                    })
            },
          submitSource() {
            console.log(this.ignore)
            if(this.path.length>0){
                for (let i = 0; i < this.path.length; i++) {
                let respObject = {"path": this.path[i], "tag1": this.tag1, "tag2": this.tag2}
                  let postURL;
                  //Checking whether the backend is local or remote
                  //The same request body is sent for the time being (i.e. path and tags)
                  if(this.backend === 'Local'){
                    postURL = "http://localhost:3001/folderdatasources"
                  }
                  else{
                    postURL = this.$store.getters.getUserBackendURL(this.backend)
                  }
                axios
                    .post(postURL, respObject)
                    .then((resp) => {
                      this.$toast.add({
                        severity: 'success',
                        summary: 'Success',
                        detail: resp.data.message,
                        life: 3000
                      })
                      this.$emit('addFolder')
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
            else{
              this.$toast.add({
                severity: 'info',
                summary: 'No folders selected',
                detail: 'Please select folders to upload',
                life: 3000
              })
            }
          }
        }
    }
</script>

<style scoped>

input {
    font-size: 15px;
    font-style: italic;
    height: 5px;
    background-color: #242424;
}

.p-text-normal {
  display: inline-flex;
    padding-left: 15px;
}

.p-button-sm {
  vertical-align: middle;
  margin-top: 30px;
}

.p-inputtext:enabled:focus {
  border-color: rgba(255, 255, 255, 0.3);
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.3), inset 0 0 0 1px rgba(255, 255, 255, 0.3), inset 0 0 0 1px rgba(255, 255, 255, 0.3), inset 0 0 0 1px rgba(255, 255, 255, 0.3);
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

.depth-selector{
  margin-bottom: 15px;
  margin-top: 5px;
}

.depth-input{
  margin-top: 15px;
}

.file-ignore{
  margin-bottom: 15px;
}

.p-inputtextarea{
  margin-top: 15px;
}

.selected-folders{
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
