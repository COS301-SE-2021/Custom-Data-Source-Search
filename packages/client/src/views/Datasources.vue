<template >
  <div class="header">
    Data Sources
  </div>
  <Splitter style="height: 90vh">
    <SplitterPanel style="padding-top: 50px">
      <div class="all-sources">
        <TextDatasource/>
        <FolderDatasource/>
        <WebpageDatasource/>
      </div>
    </SplitterPanel>
    <SplitterPanel size="25">
      Panel 2
    </SplitterPanel>
  </Splitter>

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
.all-sources {
  max-width: 800px;
  margin: auto;
}

.header{
  margin-bottom: 30px;
}
</style>
