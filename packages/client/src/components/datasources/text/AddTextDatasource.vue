<template>
    <div>
      <InputText placeholder="Add Text File URI..." v-model="dataSourceURI" v-on:keyup.enter="addDataSource"/>
      <Button label="Add" class="p-button-text p-button-plain" style="height: 35px;" v-on:click="addDataSource()" />
      <Button label="Browse" icon="pi pi-plus" @click="addDataSource()"/>
    </div>
</template>

<script>
    import axios from 'axios';
    const electron = require('electron');
    const dialog = electron.remote.dialog;
    export default {
        name: "AddTextDatasource",
        data() {
            return {
                dataSourceURI: ""
            }
        },
        methods: {
            addDataSource() {


              dialog.showOpenDialog({
                  title: 'Select Text Files to Add as Data Sources',
                  buttonLabel: "Select",
                filters: [
                  {
                    name: 'Text Files',
                    extensions: ['txt', 'ts', 'js', 'vue', 'css'] //Could be problematic in the future.
                  }, ],

                  properties: ['openFile', 'multiSelections'] })
              .then(files => {

                //Check that files were successfully selected
                if(files.filePaths && files.filePaths[0]) {

                  let p, filename, path, str;

                  for (let i = 0; i < files.filePaths.length; i++) {


                    //Choose appropriate slash form
                  //  if (files.filePaths[i].indexOf("/") === -1) {
                   //   p = files.filePaths[i].split("\\")
                   //   filename = p.pop()
                   //   path = p.join("\\")
                    //  console.log(filename)
                   //   console.log(path)


                   // } else {
                    str = files.filePaths[i]
                    console.log("yyyyyy",str)
                    str = str.replace("\\", "/")
                    console.log("yyyyy", str)
                    p = str.split("/")
                      filename = p.pop()
                      path = p.join("/")
                      console.log(filename)
                      console.log(path)

                  //  }

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

</style>