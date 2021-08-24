<template>
  <ScrollPanel>
    <div>
      <span>
        Enter the URL of desired webpage
      </span>
      <InputText id="input" v-model="dataSourceURI" placeholder="Add WebPage URL..."/>
      <div>
        <span>
          Add optional tags
        </span>
        <br/>
        <span class="p-float-label">
          <InputText id="tag1" v-model="tag1"  type="text"/>
          <label for="tag1">
            Tag 1
          </label>
        </span>
        <span class="p-float-label">
          <InputText id="tag2" v-model="tag2"  type="text"/>
          <label for="tag2">
            Tag 2
          </label>
        </span>
      </div>
      <Button icon="pi pi-check" class="p-button-rounded p-button-text" @click="submitWebpage"/>
    </div>
  </ScrollPanel>
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
        type: 'webpage'
      }
    },
    methods: {
      submitWebpage() {
        if(this.dataSourceURI!==""){
          let respObject = {"url": this.dataSourceURI, "tag1": this.tag1, "tag2": this.tag2}
          axios
              .post(
                  `http://${this.$store.getters.getBackendLinkUsingName(this.backend)}/webpagedatasources`,
                  respObject
              )
              .then(resp => {
                this.$toast.add({
                  severity: 'success',
                  summary: 'Success',
                  detail: resp.data.message,
                  life: 3000
                })
                this.$emit('addWebpage')
                this.$emit("submitted")
              })
              .catch(() => {
                this.$toast.add({
                  severity: 'error',
                  summary: 'Error',
                  detail: 'Could Not Add Webpage.',
                  life: 3000})
              })
        }
        else{
          this.$toast.add({
            severity: 'error',
            summary: 'No URL entered',
            detail: 'Enter the URL of the webpage you would like to add',
            life: 3000
          })
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
  background-color: #242424;
}

.p-inputtext:enabled:focus {
  border-color: rgba(255, 255, 255, 0.3);
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.3)
}

#input{
  min-width: 100%;
  margin-top: 15px;
  margin-bottom: 15px;
}

.p-button-rounded{
  float: right;
  margin: 7px;
}

.p-float-label{
  margin-top: 15px;
}

.p-scrollpanel{
  height: 50vh;
  bottom: 2em;
  padding-bottom: 1vh;
  align-content: center;
}
</style>
