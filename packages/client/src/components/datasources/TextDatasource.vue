<template>
  <div>
    <span id="text" title="File Datasource"><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#2ecc71"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M8 16h8v2H8zm0-4h8v2H8zm6-10H6c-1.1 0-2 .9-2 2v16c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm4 18H6V4h7v5h5v11z"/></svg></span>
    <span id="header">Text File</span>
  </div>
</template>

<script>
export default {
  name: "FileDataSource",
  data() {
    return {
    }
  }
}
</script>

<style scoped>
#text {
  float: left;
}

#header {
  font-size: 1.5em;
  padding-left: 10px;
  float: left;
}
</style>