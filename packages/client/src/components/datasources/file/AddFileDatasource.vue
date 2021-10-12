<template>
  <Button
      icon="pi pi-arrow-left"
      class="p-button-lg p-button-rounded p-button-text back-button"
      @click="$emit('back')"
  />
  <ScrollPanel>
    <span id="header">Select one or more Files to add to data sources</span>
    <br/>
    <Button
        id="browse"
        label="Browse"
        icon="pi pi-plus"
        class="p-button-raised p-button-text"
        @click="selectFiles()"
    />
    <br/>
    <span>Selected Files</span>
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
        <span v-else class="selection-list">No files selected.</span>
      </ScrollPanel>
    </div>
    <div>
      <span>Add optional tags</span>
      <br/>
      <span class="p-float-label">
        <InputText
            id="tag1"
            v-model="tag1"
            type="text"
            @keyup.enter="nextInputFocus()"
        />
        <label for="tag1">Tag 1</label>
      </span>
      <span class="p-float-label">
        <InputText
            id="tag2"
            v-model="tag2"
            type="text"
            @keyup.enter="focusOnAdd()"
        />
        <label for="tag2">Tag 2</label>
      </span>
    </div>
    <Button
        id="Add"
        v-if="!submitting"
        label="Add"
        icon="pi pi-check"
        class="p-button-rounded p-button-text"
        @click="submitSelectedFiles()"
        @keyup.enter="submitSelectedFiles()"
    />
    <Button
        v-else
        icon="pi pi-spin pi-spinner"
        class="p-button-rounded p-button-text p-button-lg"
    />
  </ScrollPanel>
</template>

<script>
  import axios from 'axios';

  const fs = require('fs');
const FormData = require('form-data');
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
      paths: [],
      submitting: false
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
                this.paths[i] += "/";
              }
              console.log(this.paths);
              document.getElementById("tag1").focus();
            }
          });
    },

    nextInputFocus() {
      document.getElementById("tag2").focus();
    },

    focusOnAdd() {
      document.getElementById("Add").focus();
    },

    async submitSelectedFiles(){
      if(this.filenames.length!==0){
        this.submitting = true;
        if(this.backend === 'Local'){
          for (let i = 0; i < this.filenames.length; i++) {
            let reqObject = {
              "filename": this.filenames[i], "path": this.paths[i], "file": null, "tag1": this.tag1, "tag2": this.tag2
            };
            await axios
                .post(
                    `http://${this.$store.getters.getBackendLinkUsingName(this.backend)}/filedatasources`,
                    reqObject
                )
                .then((resp) => {
                  this.$toast.add({
                    severity: 'success',
                    summary: 'Success',
                    detail: resp.data.message,
                    life: 3000
                  });
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
          this.submitting = false;
          this.$emit("submitted");
        }
        else{
          let backendID = this.$store.getters.getBackendIDViaName(this.backend);
          for (let i = 0; i < this.filenames.length; i++) {
            let reqObject;
            try {
              reqObject = {
                "filename": this.filenames[i],
                "path": null,
                "file": fs.readFileSync(this.paths[i] + this.filenames[i], "base64"),
                "tag1": this.tag1,
                "tag2": this.tag2
              };
              fs.writeFileSync(this.paths[i] + "copy_" + this.filenames[i], reqObject.file, {encoding: "base64"})
            } catch (e) {
              console.log(e)
            }
            const headers = {
            "Authorization": "Bearer " + this.$store.getters.getBackendJWTToken(backendID),
            };
            await axios
                .post(
                    `http://${this.$store.getters.getBackendLinkUsingName(this.backend)}/filedatasources`,
                    reqObject, {headers}
                )
                .then((resp) => {
                  this.$toast.add({
                    severity: 'success',
                    summary: 'Success',
                    detail: resp.data.message,
                    life: 3000
                  });
                })
                .catch(async() => {
                  await this.$store.dispatch("refreshJWTToken", {id: backendID});
                  const headers = {
                  "Authorization": "Bearer " + this.$store.getters.getBackendJWTToken(backendID)
                  };
                  await axios
                    .post(
                      `http://${this.$store.getters.getBackendLinkUsingName(this.backend)}/filedatasources`,
                      reqObject, {headers}
                    )
                    .then((resp) => {
                      this.$toast.add({
                        severity: 'success',
                        summary: 'Success',
                        detail: resp.data.message,
                        life: 3000
                      });
                      this.$emit('addFile');
                    })
                    .catch((error) => {
                      this.$toast.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: error.response.data.message,
                        life: 3000
                      });
                    })
                })
          }
          this.submitting = false;
          this.$emit("submitted");
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
    background: #262626;
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

  .p-scrollpanel{
    height: 45vh;
    bottom: 2em;
    padding-bottom: 1vh;
    align-content: center;
    margin-left:15px;
  }

  .selection-list{
    display: block;
    margin-bottom: 2px;
  }

  .back-button{
    float: left;
    padding: 0;
    margin: 0 0 10px;
  }
</style>