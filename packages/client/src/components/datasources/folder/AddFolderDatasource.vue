<template>
  <Button
      icon="pi pi-arrow-left"
      class="p-button-lg p-button-rounded p-button-text back-button"
      @click="$emit('back')"
  />
  <ScrollPanel>
    <span>Select one or more Folders to add as Data Sources</span>
    <br/>
    <Button
        label="Browse"
        icon="pi pi-plus"
        class="p-button-raised p-button-text"
        @click="selectFolders()"
    />
    <br/>
    <span>Selected Folders</span>
    <div class="selected-folders">
      <ScrollPanel style="width: 100%; height: 10vh;">
        <ul v-if="selectedFolders.length!==0">
          <li
            v-for="folder in selectedFolders"
            :key="folder.id"
          >
            {{folder}}
          </li>
        </ul>
        <span v-else class="selection-list">No folders selected.</span>
      </ScrollPanel>
    </div>
    <br/>
    <div class="depth-selector">
      <label for="stacked">Specify depth of folders to search</label>
      <div class="depth-selector-input">
        <InputNumber
            inputStyle="width: 9.3rem; background-color: #242424;"
            id="stacked"
            v-model="depth"
            :min="0"
            mode="decimal"
            showButtons
        />
      </div>
    </div>
    <div class="file-ignore">
      <span>Specify which files/sub-folders to ignore</span>
      <Textarea
          v-model="ignore"
          rows="5"
          cols="40"
      />
    </div>
    <div>
      <span>Add optional tags</span>
      <br/>
      <span class="p-float-label">
        <InputText
            id="tag1"
            v-model="tag1"
            type="text"
        />
        <label for="tag1">Tag 1</label>
      </span>
      <span class="p-float-label">
        <InputText
            id="tag2"
            v-model="tag2"
            type="text"
        />
        <label for="tag2">Tag 2</label>
      </span>
    </div>
    <Button
        label="Add"
        icon="pi pi-check"
        class="p-button-rounded p-button-text"
        @click="submitSelectedFolders"
    />
  </ScrollPanel>
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
      selectedFolders: [],
      depth: 0,
      ignore: '# Files/folders to be ignored are accepted in a .gitignore format # \n \n'  +
          'node_modules/ \n' +
          '*.log \n' +
          'build/ \n'
    }
  },

  methods: {
    selectFolders() {
      electron.dialog.showOpenDialog({
        title: 'Select Folders to Add as Data Sources',
        buttonLabel: "Select",
        properties: ['openDirectory', 'multiSelections']})
          .then(dirs => {
            if(dirs.filePaths && dirs.filePaths[0]) {
              let str;
              let temp;
              for (let i = 0; i < dirs.filePaths.length; i++) {
                str = (dirs.filePaths[i]);
                temp = str.replaceAll("\\","/");
                this.selectedFolders.push(temp);
              }
            }
          })
    },

    submitSelectedFolders() {
      if(this.selectedFolders.length!==0){
        let i;
        for (i of this.selectedFolders) {
          let reqObject = {"path": i, "tag1": this.tag1, "tag2": this.tag2, "dotIgnore": this.ignore, "depth": this.depth};
          const url = `http://${this.$store.getters.getBackendLinkViaName(this.backend)}/folderdatasources`;
          axios
              .post(url, reqObject)
              .then((resp) => {
                this.$toast.add({
                  severity: 'success',
                  summary: 'Success',
                  detail: resp.data.message,
                  life: 3000
                });
                this.$emit('addFolder');
              })
              .catch((error) => {
                this.$toast.add({
                  severity: 'error',
                  summary: 'Error',
                  detail: error.response.data.message,
                  life: 3000
                });
                this.selectedFolders = [];
              })
        }
        this.$emit("submitted");
        this.selectedFolders = [];
      }
      else{
        this.$toast.add({
          severity: 'error',
          summary: 'No folders selected',
          detail: 'Try selecting some folders to add',
          life: 3000
        });
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
    background-color: #262626;
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
    box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.3)
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

  .depth-selector-input{
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

  .p-scrollpanel{
    height: 50vh;
    bottom: 2em;
    padding-bottom: 1vh;
    align-content: center;
    margin-left: 15px;
  }

  .p-inputtextarea{
    background: #262626;
  }

  .back-button{
    float: left;
    padding: 0;
    margin: 0 0 10px;
  }
</style>
