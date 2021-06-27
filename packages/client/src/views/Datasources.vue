<template >
  <div class="header">
    Data Sources
  </div>
  <ConfirmDialog></ConfirmDialog>
  <Toast/>
  <Splitter style="height: 90vh">
    <SplitterPanel style="padding-top: 50px">
      <div class="all-sources">
        <TextDatasource @expand-text="expansion()"></TextDatasource>
        <FolderDatasource/>
        <WebpageDatasource/>
      </div>
    </SplitterPanel>
    <SplitterPanel size=25>
      <TabView class="tabview-custom" v-if="tabs.length">
        <TabPanel v-for="tab in tabs" :key="tab.title">
          <template #header>
            <span>{{tab.title}}</span>
            <i class="pi pi-times-circle" style="color: gray" @click="deleteTab(tab.title)"></i>
          </template>
          <div v-if="tab.title==='Text'" id="text-datasources">
            <DataSourceCard
                v-for="(item, index) in dataSources"
                :key=index :title="item.path + item.filename"
                :id="item.uuid"
                endpoint="http://localhost:3001/textdatasources"
            >
            </DataSourceCard>
          </div>
        </TabPanel>
      </TabView>
      <div v-else>
        <p>Please click on a type to view stored data sources</p>
      </div>


<!--      <div v-if="expand" id="text-datasources">-->
<!--        <div class="heading">-->
<!--          Text Data Sources-->
<!--        </div>-->
<!--        <DataSourceCard-->
<!--            v-for="(item, index) in dataSources"-->
<!--            :key=index :title="item.path + item.filename"-->
<!--            :id="item.uuid"-->
<!--            endpoint="http://localhost:3001/textdatasources"-->
<!--        >-->
<!--        </DataSourceCard>-->
<!--      </div>-->
<!--      <div v-else>-->
<!--        {{ msg }}-->
<!--      </div>-->

    </SplitterPanel>
  </Splitter>

</template>

<script>
import WebpageDatasource from "../components/datasources/WebpageDatasource";
import TextDatasource from "../components/datasources/TextDatasource";
import FolderDatasource from "../components/datasources/FolderDatasource";
import DataSourceCard from "../components/datasources/DataSourceCard";
import axios from "axios";

export default {

  components: {
    DataSourceCard,
    WebpageDatasource,
    TextDatasource,
    FolderDatasource
  },
  props: {
    expanded: Boolean
  },
  data() {
    return {
      msg: "No data source chosen",
      expand: false,
      dataSources: [],
      tabs: []
    }
  },
  methods: {
    deleteTab(tab){
      this.tabs.splice(this.tabs.indexOf(tab),1)
    },
    expansion(){
      this.expand = !this.expand
      this.tabs.push({title: 'Text'})
    }
  },
  beforeMount() {
    axios.get("http://localhost:3001/textdatasources").then(
        resp => {
          console.log(resp.data)
          this.dataSources = resp.data
        }
    )
  }
}
</script>

<style scoped lang="scss">
.all-sources {
  max-width: 800px;
  margin: auto;
}

.header{
  margin-bottom: 30px;
}

.heading {
  margin-bottom: 30px;
}

.tabview-custom {
  i, span {
    vertical-align: middle;
  }

  span {
    margin: 0 .5rem;
  }
}

</style>
