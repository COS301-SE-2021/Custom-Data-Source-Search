<template>
    <div>
        <input placeholder="Add text file URI..." v-model="dataSourceURI" v-on:keyup.enter="addDataSource">
        <button @click="addDataSource()">Add</button>
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
                        this.$parent.fetchDataSources()
                        alert(resp.data.message)
                    })
                    .catch(() => {
                        alert("Could Not Add Text Datasource")
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
        min-width: 660px;
    }

    button {
        margin-left: 45px;
    }

</style>