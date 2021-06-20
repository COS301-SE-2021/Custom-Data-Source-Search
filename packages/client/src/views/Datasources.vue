<template>
  <div class="about">
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


