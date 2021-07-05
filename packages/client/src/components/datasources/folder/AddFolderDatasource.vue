<template>
    <div>
        <input placeholder="Add Folder URI..." v-model="dataSourceURI" v-on:keyup.enter="addDataSource">
        <button class="add-datasource" @click="addDataSource()">Add</button>
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
