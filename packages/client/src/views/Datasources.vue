<template>
  <div class="about">
    <div class="grid">
      <div>
        <TextDatasource/>
      </div>
      <div>
        <FolderDatasource/>
      </div>
      <div>
        <WebpageDatasource/>
      </div>
    </div>

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
.grid {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  row-gap: 5%;
  padding-left: 40px;
}

</style>
