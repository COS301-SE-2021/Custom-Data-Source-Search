<template>
    <div>
      <Button label="Browse" icon="pi pi-plus" class="p-button-sm p-button-outlined" @click="addDataSource()"/>
      <div class="p-text-normal">Select one or more Text Files to add as Data Sources</div>
      </div>
</template>

<script>
    import axios from 'axios';
    const electron = require('@electron/remote');
    export default {
        name: "AddTextDatasource",
        data() {
            return {
                dataSourceURI: ""
            }
        },
        methods: {
            addDataSource() {
              electron.dialog.showOpenDialog({
                  title: 'Select Text Files to Add as Data Sources',
                  buttonLabel: "Select",
                filters: [
                  {
                    name: 'Text Files',
                    extensions: ['txt', 'ts', 'js', 'vue', 'css'] //Will need to expand in the future.
                  }, ],

                  properties: ['openFile', 'multiSelections'] })
              .then(files => {

                //Check that files were successfully selected
                if(files.filePaths && files.filePaths[0]) {

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
                        .post("http://localhost:3001/textdatasources", respObject)
                        .then(resp => {
                          this.$toast.add({
                            severity: 'success',
                            summary: 'Success',
                            detail: resp.data.message,
                            life: 3000
                          })
                          this.$emit('addText')
                        })
                        .catch(() => {
                          this.$toast.add({
                            severity: 'error',
                            summary: 'Error',
                            detail: 'Could Not Add Text Datasource.',
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
    padding: 15px;
}

input {
  min-width: 90%;
  font-size: 15px;
  font-style: italic;
  height: 5px;
  background: #2a2a2a;
}

.p-inputtext:enabled:focus {
  border-color: rgba(255, 255, 255, 0.3);
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.3), inset 0 0 0 1px rgba(255, 255, 255, 0.3), inset 0 0 0 1px rgba(255, 255, 255, 0.3), inset 0 0 0 1px rgba(255, 255, 255, 0.3);
}

.p-text-normal {
  display: inline-flex;
}

.p-button-sm {
  vertical-align: middle;
}

</style>