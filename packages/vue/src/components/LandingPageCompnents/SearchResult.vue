<template>
  <el-card v-for="file in result"  class="box-card">
    <div class="text item">
      <span>Filename: {{file.fileName}}</span><br>
      <div v-for="r in file.occurrences">
        <p ><em>{{r.lineNumber}}</em> {{r.occurrenceString}}</p>
      </div>
      <span>This will be the directory/url</span>
    </div>
  </el-card>

</template>

<script>

</script>
<style>
.box-card{
  margin-bottom: 10px;
  width: 100%;
}


</style>