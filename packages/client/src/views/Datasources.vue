<template>
  <div class="all">
      <TextDatasource/>
      <FolderDatasource/>
      <WebpageDatasource/>
  </div>
</template>

<script>
import WebpageDatasource from "../components/datasources/webpage/WebpageDatasource";
import TextDatasource from "../components/datasources/text/TextDatasource";
import FolderDatasource from "../components/datasources/folder/FolderDatasource";
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
