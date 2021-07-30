<template>
      <span>Select one or more Folders to add as Data Sources</span>
      <Button label="Browse" icon="pi pi-plus" class="p-button-raised p-button-text" @click="addDataSource()"/>
</template>

<script>
    import axios from 'axios'
    const electron = require('@electron/remote');
    export default {
        name: "AddFolderDatasource",
        data() {
            return {
                dataSourceURI: ""
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

                      let path, str;

                      //for every folder selected
                      for (let i = 0; i < dirs.filePaths.length; i++) {

                        str = dirs.filePaths[i]

                        //Force use of / in URI's across all platforms
                        path = str.replaceAll("\\", "/")

                         axios
                             .post("http://localhost:3001/folderdatasources", {"path": path})
                             .then(resp => {
                                this.$toast.add({severity: 'success', summary: 'Success', detail: resp.data.message, life: 3000})
                                this.$emit('addFolder')
                             })
                              .catch(() => {
                                  this.$toast.add({severity: 'error', summary: 'Error', detail: 'Could Not Add Folder.', life: 3000})
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

.data-input {
    min-width: 100%
}

input {
    min-width: 90%;
    font-size: 15px;
    font-style: italic;
    height: 5px;
    background: #2a2a2a;
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
</style>
