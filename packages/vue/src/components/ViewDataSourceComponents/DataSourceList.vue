<template>
  <div class ="output" v-if="datasourceList.length !== 0" v-for="(s, i) in datasourceList">
    <p><em>{{s.filename}}</em><button @click="deleteDataSource(i)" id="delete-button">
      X
    </button></p>
    {{s.path}}
  </div>
  <div class ="output" v-else>
    <p>No data sources added</p>
  </div>
</template>

<script>
  export default{
      data() {
      return {
        datasourceList: [
          {
            filename: "File1",
            path: "File1Path",
          },
          {
            filename: "File2",
            path: "File2Path",
          },
          {
            filename: "File3",
            path: "File3Path",
          }
        ]
      }
    },
    methods: {
      deleteDataSource(idToDelete) {
        if (confirm("Are you sure you want to delete this datasource?")) {
          $.ajax({
            type: "DELETE",
            url: "http://localhost:3001/textdatasources/",
            data: JSON.stringify({"id": idToDelete}),
            success: () => {
              this.getDataSources();
              alert("Deleted Data Source...");
            }
          })
        }
      }
    }
  }
</script>
<style>
.output{
  margin-bottom: 20px;
  color: floralwhite;
  font-family: "Trebuchet MS", serif;
  background: #303030;
  border-radius: 5px;
  padding-left:10px;
  text-align: left;
}
.output button{
  float: right;
}
</style>