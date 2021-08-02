<template>
      <span>Select one or more folders to add as data sources</span><br/>
      <Button label="Browse" icon="pi pi-plus" class="p-button-raised p-button-text" @click="addDataSource()"/>
<!--  Please be aware that the below code is simply the skeleton for tags, this functionality does not work as of yet.-->
    <div>
      <span>Add optional tags</span><br/>
      <span class="p-float-label">
        <InputText id="tagInput1" type="text" v-model="tag1"/>
        <label for="tagInput1">Tag 1</label>
        <ColorPicker v-model="colour1" />
        <Tag id= 'tag1' value="Example" :style="style"></Tag>
      </span>
      <span class="p-float-label">
        <InputText id="tagInput2" type="text" v-model="tag2"/>
        <label for="tagInput2">Tag 2</label>
        <ColorPicker v-model="colour2" />
        <Tag id= 'tag2' value="Example" :style="style"></Tag>
      </span>
    </div>
<!--  Below button does not function yet-->
  <Button icon="pi pi-check" class="p-button-rounded p-button-text"/>
</template>

<script>
    import axios from 'axios'
    const electron = require('@electron/remote');
    export default {
        name: "AddFolderDatasource",
        props:{
          backend: String,
        },
        data() {
            return {
              dataSourceURI: "",
              tag1: null,
              tag2: null,
              colour1: "f4a261",
              colour2: "457b9d",
              type: 'folder'
            }
        },
      computed: {
        style(){
          return{
            //Colours for the example tags shown in the overlay
            '--colour-1': '#' + (this.colour1),
            '--colour-2': '#' + (this.colour2)
          }
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

.p-colorpicker{
  margin-left: 10px;
}

#tag1{
  background: var(--colour-1);
  margin-left: 20px;
}

#tag2{
  background: var(--colour-2);
  margin-left: 20px;
}

</style>
