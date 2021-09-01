<template>
  <div class="page">
    <ConfirmDialog/>
    <Toast position="bottom-right"/>
    <div class="datasource-header">
      <h1 class="datasource-heading">Data Sources</h1>
      <p class="datasource-description">
        View and edit your data sources
      </p>
    </div>
    <datasources-table/>
  </div>
</template>

<script>
    import DatasourcesTable from "../components/datasources/DatasourcesTable";

    export default{

  name: "Datasources",

  components: {DatasourcesTable}
}
</script>

<style scoped lang="scss">
.page{
  height: 100vh;
  padding-left: 1%;
}

.datasource-header{
  margin-bottom: 50px;
}

.datasource-heading {
  text-align: center;
  color: #ededed;
}

.datasource-description {
  text-align: center;
  color: #ededed;
}
</style>