<template>
  <div id="container">
    <div class="grid">
      <div>
        <span id="webpage" title="Webpage Datasource"><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#3498db"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zm6.93 6h-2.95c-.32-1.25-.78-2.45-1.38-3.56 1.84.63 3.37 1.91 4.33 3.56zM12 4.04c.83 1.2 1.48 2.53 1.91 3.96h-3.82c.43-1.43 1.08-2.76 1.91-3.96zM4.26 14C4.1 13.36 4 12.69 4 12s.1-1.36.26-2h3.38c-.08.66-.14 1.32-.14 2s.06 1.34.14 2H4.26zm.82 2h2.95c.32 1.25.78 2.45 1.38 3.56-1.84-.63-3.37-1.9-4.33-3.56zm2.95-8H5.08c.96-1.66 2.49-2.93 4.33-3.56C8.81 5.55 8.35 6.75 8.03 8zM12 19.96c-.83-1.2-1.48-2.53-1.91-3.96h3.82c-.43 1.43-1.08 2.76-1.91 3.96zM14.34 14H9.66c-.09-.66-.16-1.32-.16-2s.07-1.35.16-2h4.68c.09.65.16 1.32.16 2s-.07 1.34-.16 2zm.25 5.56c.6-1.11 1.06-2.31 1.38-3.56h2.95c-.96 1.65-2.49 2.93-4.33 3.56zM16.36 14c.08-.66.14-1.32.14-2s-.06-1.34-.14-2h3.38c.16.64.26 1.31.26 2s-.1 1.36-.26 2h-3.38z"/></svg></span>
      </div>
      <div id="header">Webpages</div>
      <div @click="add=!add">
        <svg class="add" v-if="add" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#FFFFFF"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M19 13H5v-2h14v2z"/></svg>
        <svg class="add" v-else xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 24 24" height="24px" viewBox="0 0 24 24" width="24px" fill="#FFFFFF"><g><rect fill="none" height="24" width="24"/></g><g><g><path d="M19,13h-6v6h-2v-6H5v-2h6V5h2v6h6V13z"/></g></g></svg>
      </div>
      <div @click="expanded=!expanded" id="expand">
        <svg class="expand" id="minimise" v-if="expanded" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#FFFFFF"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M12 8l-6 6 1.41 1.41L12 10.83l4.59 4.58L18 14l-6-6z"/></svg>
        <svg class="expand" id="expand" v-else xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#FFFFFF"><path d="M24 24H0V0h24v24z" fill="none" opacity=".87"/><path d="M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6-1.41-1.41z"/></svg>
      </div>
    </div>
    <div v-if="add">
      <AddDataURI placeholder-path="Enter Webpage Link..."></AddDataURI>
    </div>
    <div v-if="expanded" id="folder-datasources">
      <DataSourceCard v-for="(item, index) in dataSources" :key=index :title="item.path" :id="item.uuid"></DataSourceCard>
    </div>
  </div>
</template>

<script>
import DataSourceCard from "./DataSourceCard";
import AddDataURI from "./AddDataURI";

export default {
  name: "WebpageDatasource",
  data() {
    return {
      expanded: false,
      add: false,
      dataSources: [
        { uuid: '3463457345235', path: 'working/on/many/things' },
        { uuid: '4564564564564', path: 'working/random/lengths/things' },
        { uuid: '1212121212121', path: 'working/on/many/they/must/be/different' },
        { uuid: '9595959595959', path: 'working/I/think/many/things' },
        { uuid: '3333333333333', path: 'working/on/Gianni/moet/gelato/kry/things' }
      ]
    }
  },
  components: {
    DataSourceCard,
    AddDataURI
  }
}
</script>

<style scoped>
#container {
  vertical-align: center;
  width: 100%;
  text-align: left;
  border-radius: 10px;
  margin-top: 10px;
  background-color: #212121;
  padding-left: 20px;
  padding-right: 20px;
}

.add {
  float: right;
  cursor: pointer;
}

#header {
  font-weight: bold;
  padding-top: 28px;
}

.expand {
  float: right;
}

#expand {
  cursor: pointer;
}

.grid {
  display: grid;
  grid-template-columns: 1fr 6fr 1fr 1fr;
}

.grid div {
  width: 100%;
  vertical-align: center;
  padding-top: 20px;
  padding-bottom: 20px;
}

#web-datasources {
  padding-bottom: 10px;
}

</style>