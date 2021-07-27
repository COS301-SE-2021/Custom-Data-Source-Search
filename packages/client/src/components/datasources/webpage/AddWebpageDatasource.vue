<template>
    <div>
      <span>Enter the URL of desired webpage</span>
      <InputText id="input" placeholder="Add WebPage URL..." v-model="dataSourceURI" v-on:keyup.enter="addDataSource"/>
      <Button icon="pi pi-check" class="p-button-rounded p-button-text" v-on:click="addDataSource()" />
    </div>
</template>

<script>
    import axios from 'axios'
    export default {
        name: "AddDataURI",
        data() {
            return {
                dataSourceURI: ""
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
  min-width: 100%;
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
  margin-top: 30px;
}

.p-button-rounded{
  float: right;
  margin: 7px;
}
</style>
