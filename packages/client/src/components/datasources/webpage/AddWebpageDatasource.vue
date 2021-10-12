<template>
  <div>
    <Button
        icon="pi pi-arrow-left"
        class="p-button-lg p-button-rounded p-button-text back-button"
        @click="$emit('back')"
    />
  </div>
  <br><br><br>
  <div class="main-contents">
    <span>Enter the URL of desired webpage</span>
    <InputText
        id="input"
        v-model="dataSourceURI"
        placeholder="Add WebPage URL..."
        @keyup.enter="focusOnNextInput('tag1')"
    />
    <div>
      <span>Add optional tags</span>
      <br/>
      <span class="p-float-label">
        <InputText
            id="tag1"
            v-model="tag1"
            type="text"
            @keyup.enter="focusOnNextInput('tag2')"
        />
        <label for="tag1">Tag 1</label>
      </span>
      <span class="p-float-label">
        <InputText
            id="tag2"
            v-model="tag2"
            type="text"
            @keyup.enter="focusOnNextInput('Add')"
        />
        <label for="tag2">Tag 2</label>
      </span>
    </div>
    <Button
        v-if="!submitting"
        id="Add"
        label="Add"
        icon="pi pi-check"
        class="p-button-rounded p-button-text"
        @click="submitWebpage"
    />
    <Button
        v-else
        icon="pi pi-spin pi-spinner"
        class="p-button-rounded p-button-text p-button-lg"
    />
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: "AddDataURI",

  props:{
    backend: String,
  },

  data() {
    return {
      dataSourceURI: "",
      tag1: null,
      tag2: null,
      type: 'webpage',
      submitting: false
    }
  },

  methods: {
    focusOnNextInput(n) {
      document.getElementById(n).focus();
    },

    async submitWebpage() {
      if(this.dataSourceURI!==""){
        this.submitting = true;
        let backendID = this.$store.getters.getBackendIDViaName(this.backend);
        let reqObject = {"url": this.dataSourceURI, "tag1": this.tag1, "tag2": this.tag2};
        const headers = {
          "Authorization": "Bearer " + this.$store.getters.getBackendJWTToken(backendID)
        };
        await axios
            .post(
                `http://${this.$store.getters.getBackendLinkUsingName(this.backend)}/webpagedatasources`,
                reqObject, {headers}
            )
            .then(resp => {
              this.$toast.add({
                severity: 'success',
                summary: 'Success',
                detail: resp.data.message,
                life: 3000
                });
              this.submitting = false;
              this.$emit("submitted");
            })
            .catch(async () => {
              await this.$store.dispatch("refreshJWTToken", {id: backendID});
              const headers = {
                "Authorization": "Bearer " + this.$store.getters.getBackendJWTToken(backendID)
              };
              await axios
                .post(`http://${this.$store.getters.getBackendLinkUsingName(this.backend)}/webpagedatasources`,
                    reqObject, {headers}
                )
                .then(resp => {
                  this.$toast.add({
                    severity: 'success',
                    summary: 'Success',
                    detail: resp.data.message,
                    life: 3000
                  });
                  this.submitting = false;
                  this.$emit("submitted");
                })
              .catch((error) =>{
                this.$toast.add({
                  severity: 'error',
                  summary: 'Error',
                  detail: error.response.data.message,
                  life: 3000
                });
                this.dataSourceURI = "";
              })
            })
      }
      else{
        this.$toast.add({
          severity: 'error',
          summary: 'No URL entered',
          detail: 'Enter the URL of the webpage you would like to add',
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

  .p-inputtext:enabled:focus {
    border-color: rgba(255, 255, 255, 0.3);
    box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.3)
  }

  .p-button-rounded{
    float: right;
    margin: 7px;
  }

  .p-float-label{
    margin-top: 15px;
  }

  .main-contents{
    margin-left: 15px;
  }

  #input{
    min-width: 100%;
    margin-top: 15px;
    margin-bottom: 15px;
  }

  .back-button{
    float: left;
    padding: 0;
    margin: 0;
  }
</style>
