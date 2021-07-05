<template>
    <div>
        <input placeholder="Add Folder URI..." v-model="dataSourceURI" v-on:keyup.enter="addDataSource">
        <button @click="addDataSource()">Add</button>
    </div>
</template>

<script>
    import axios from 'axios'
    export default {
        name: "AddFolderDatasource",
        data() {
            return {
                dataSourceURI: ""
            }
        },
        methods: {
            addDataSource() {
                axios
                    .post("http://localhost:3001/folderdatasources", {"path": this.dataSourceURI})
                    .then(resp => {
                        this.$parent.fetchDataSources()
                        alert(resp.data.message)
                    })
                    .catch(() => {
                        alert("Could Not Add Folder Datasource")
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
