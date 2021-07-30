<template>
    <div>
      <span>Enter the URL of desired webpage</span>
      <InputText id="input" placeholder="Add WebPage URL..." v-model="dataSourceURI" v-on:keyup.enter="addDataSource"/>
      <div>
        <span>Add optional tags</span><br/>
        <span class="p-float-label">
        <InputText id="tag1" type="text" v-model="tag1"/>
        <label for="tag1">Tag 1</label>
      </span>
        <span class="p-float-label">
        <InputText id="tag2" type="text" v-model="tag2"/>
        <label for="tag2">Tag 2</label>
      </span>
      </div>
      <Button icon="pi pi-check" class="p-button-rounded p-button-text" v-on:click="addDataSource()" />
    </div>
</template>

<script>
    import axios from 'axios'
    export default {
        name: "AddDataURI",
        props:{
          backend: String,
          colour: String,

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
            addDataSource() {
                axios
                    .post("http://localhost:3001/webpagedatasources", {"url": this.dataSourceURI})
                    .then(resp => {
                        this.$toast.add({severity: 'success', summary: 'Success', detail: resp.data.message, life: 3000})
                        this.$emit('addWebpage')
                    })
                    .catch(() => {
                        this.$toast.add({severity: 'error', summary: 'Error', detail: 'Could Not Add Webpage.', life: 3000})
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
  background: #2a2a2a;
}

.p-inputtext:enabled:focus {
  border-color: rgba(255, 255, 255, 0.3);
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.3), inset 0 0 0 1px rgba(255, 255, 255, 0.3), inset 0 0 0 1px rgba(255, 255, 255, 0.3), inset 0 0 0 1px rgba(255, 255, 255, 0.3);
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



</style>
