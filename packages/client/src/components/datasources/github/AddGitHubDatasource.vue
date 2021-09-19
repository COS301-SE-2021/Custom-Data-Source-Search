<template>
  <div>
    <span>Enter your github username</span>
    <InputText
        id="name"
        v-model="username"
        placeholder="GitHub username.."
    />
    <span>Enter the target repo name</span>
    <InputText
        id="repo"
        v-model="repo"
        placeholder="Repo name..."
    />
    <span>Enter you access token</span>
    <InputText
        id="token"
        v-model="token"
        placeholder="Token..."
    />
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
        icon="pi pi-check"
        class="p-button-rounded p-button-text"
        @click="submitWebpage"
    />
  </div>
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
      type: 'webpage'
    }
  },

  methods: {
    async submitWebpage() {
      if(this.repo!==""){
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
              this.$emit('addWebpage');
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
                    this.$emit('addWebpage');
                    this.$emit("submitted");
                  })
                  .catch(() =>{
                    this.$toast.add({
                      severity: 'error',
                      summary: 'Error',
                      detail: 'Could Not Add GitHub Repo.',
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

.p-float-label{
  margin-top: 15px;
}
Input {
  min-width: 100%;
  margin-top: 5px;
  margin-bottom: 15px;
}
</style>
