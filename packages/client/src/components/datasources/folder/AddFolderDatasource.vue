<template>
      <span>Select one or more Folders to add as Data Sources</span><br/>
      <Button label="Browse" icon="pi pi-plus" class="p-button-raised p-button-text" @click="addDataSource()"/>
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
              path: null
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

                      //for every folder selected
                      for (let i = 0; i < dirs.filePaths.length; i++) {

                        str = dirs.filePaths[i]

                        //Force use of / in URI's across all platforms
                        this.path = str.replaceAll("\\", "/")
                      }
                    }
                  })
            },
          submitSource(){
            let respObject = {"path": this.path, "tag1": this.tag1, "tag2": this.tag2}
            axios
                .post("http://localhost:3001/folderdatasources", respObject)
                .then((resp) => {
                  this.$toast.add({
                    severity: 'success',
                    summary: 'Success',
                    detail: resp.data.message,
                    life: 3000
                  })
                  this.$emit('addFolder')
                })
                .catch((error) => {
                  this.$toast.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: error.response.data.message,
                    life: 3000
                  })
                })
            this.$emit("submitted")
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

</style>
