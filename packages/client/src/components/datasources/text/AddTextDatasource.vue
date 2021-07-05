<template>
    <div>
        <input placeholder="Add text file URI..." v-model="dataSourceURI" v-on:keyup.enter="addDataSource">
        <button class="add-datasource" @click="addDataSource()">Add</button>
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

.data-input {
    min-width: 100%
}

input {
    min-width: 90%
}

.add-datasource {
    float: right;
    border-radius: 10px;
    max-height: 100%;
}

</style>