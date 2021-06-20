<template>
  <div class="grid">
    <div>
    <span title="File Datasource"><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#2ecc71"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M8 16h8v2H8zm0-4h8v2H8zm6-10H6c-1.1 0-2 .9-2 2v16c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm4 18H6V4h7v5h5v11z"/></svg></span>
    </div>
    <div id="header">Text Files</div>
    <div>
      <svg style="float: right" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#FFFFFF"><path d="M24 24H0V0h24v24z" fill="none" opacity=".87"/><path d="M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6-1.41-1.41z"/></svg>
    </div>
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
div {
  width: 100%;
  text-align: left;
  border-radius: 10px;
  margin-top: 10px;
}

#header {
  font-weight: bold;
  padding-top: 28px;
}

.grid {
  display: grid;
  grid-template-columns: 1fr 6fr 1fr;
}

.grid div {
  padding: 20px;
  background-color: #212121;
  vertical-align: center;
}
</style>