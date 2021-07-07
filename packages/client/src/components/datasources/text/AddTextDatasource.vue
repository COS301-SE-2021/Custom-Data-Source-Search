<template>
    <div>
      <InputText placeholder="Add Text File URI..." v-model="dataSourceURI" v-on:keyup.enter="addDataSource"/>
      <Button label="Add" class="p-button-text p-button-plain" style="height: 35px;" v-on:click="addDataSource()" />
    </div>
</template>

<script>
    import axios from 'axios'
    export default {
        name: "AddTextDatasource",
        data() {
            return {
                dataSourceURI: ""
            }
        },
        methods: {
            addDataSource() {
                let p = this.dataSourceURI.split("/")
                let filename = p.pop()
                let path = p.join("/")
                let respObject = {"fileName": filename, "filePath": path}
                axios
                    .post("http://localhost:3001/textdatasources", respObject)
                    .then(resp => {
                        this.$toast.add({severity: 'success', summary: 'Success', detail: resp.data.message, life: 3000})
                        this.$emit('addText')
                    })
                    .catch(() => {
                        this.$toast.add({severity: 'error', summary: 'Error', detail: 'Could Not Add Text Datasource.', life: 3000})
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