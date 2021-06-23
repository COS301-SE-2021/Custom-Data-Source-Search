<template>
  <div class="all">
      <TextDatasource/>
      <FolderDatasource/>
      <WebpageDatasource/>
  </div>
</template>

<script>
import WebpageDatasource from "../components/datasources/WebpageDatasource";
import TextDatasource from "../components/datasources/TextDatasource";
import FolderDatasource from "../components/datasources/FolderDatasource";
export default {
  components: {
    WebpageDatasource,
    TextDatasource,
    FolderDatasource
  }
}
</script>

<style scoped>
.all {
  max-width: 800px;
  margin: auto;
}

</style>
