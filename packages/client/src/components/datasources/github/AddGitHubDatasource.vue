<template>
  <div>
    <Button
        icon="pi pi-arrow-left"
        class="p-button-lg p-button-rounded p-button-text back-button"
        @click="$emit('back')"
    />
  </div>
  <ScrollPanel>
    <div>
      <span>Enter your github username</span>
      <InputText
          id="input1"
          class="input-fields"
          v-model="username"
          placeholder="GitHub username.."
          @keyup.enter="focusOnNextInput( 'input2' )"
      />
    </div>
    <div>
      <span>Enter the target repo name</span>
      <InputText
          id="input2"
          class="input-fields"
          v-model="repo"
          placeholder="Repo name..."
          @keyup.enter="focusOnNextInput('input3')"
      />
    </div>
    <div>
      <span>Enter your access token</span>
      <InputText
          id="input3"
          class="input-fields"
          v-model="token"
          placeholder="Token..."
          @keyup.enter="focusOnNextInput('tag1')"
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
        id="Add"
        v-if="!submitting"
        label="Add"
        icon="pi pi-check"
        class="p-button-rounded p-button-text"
        @click="submitGitRepo"
        @keyup.enter="submitGitRepo()"
    />
    <Button
        v-else
        icon="pi pi-spin pi-spinner"
        class="p-button-rounded p-button-text p-button-lg"
    />
  </ScrollPanel>
</template>

<script>
import axios from 'axios'

export default {
  name: "AddGitHubDatasource",

  props:{
    backend: String,
  },

  data() {
    return {
      username: "",
      token: "",
      repo: "",
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

    async submitGitRepo() {
      if(this.repo!==""){
        this.submitting = true;
        let backendID = this.$store.getters.getBackendIDViaName(this.backend);
        let respObject = {
          "repo": this.username + "/" + this.repo,
          "token": this.token,
          "tag1": this.tag1,
          "tag2": this.tag2
        };
        const headers = {
          "Authorization": "Bearer " + this.$store.getters.getBackendJWTToken(backendID)
        };
        await axios
            .post(
                `http://${this.$store.getters.getBackendLinkUsingName(this.backend)}/githubdatasources`,
                respObject, {headers}
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
                  .post(
                      `http://${this.$store.getters.getBackendLinkUsingName(this.backend)}/githubdatasources`,
                      respObject, {headers}
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
                  .catch((e) =>{
                    this.$toast.add({
                      severity: 'error',
                      summary: 'Error',
                      detail: e.response.data.message,
                      life: 3000
                    });
                  })
            })
      }
      else{
        this.$toast.add({
          severity: 'error',
          summary: 'No GitHub Repo entered',
          detail: 'Enter the Github Repo info you desire to search',
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

  .p-button-text{
    margin-top: 15px;
    margin-bottom: 15px;
  }

  .p-float-label{
    margin-top: 15px;
  }

  .p-scrollpanel{
    height: 45vh;
    bottom: 2em;
    padding-bottom: 1vh;
    align-content: center;
    margin-left: 15px;
  }

  .back-button{
    float: left;
    padding: 0;
    margin: 0 0 10px;
  }

  .input-fields{
    min-width: 100%;
    margin-top: 15px;
    margin-bottom: 15px;
  }
</style>
