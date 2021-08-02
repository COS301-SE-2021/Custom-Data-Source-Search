<template>
  <div class="grid-content">
    <div class="header">
        <router-link to="/datasources"><Button label="Back to data sources" icon="pi pi-angle-left" class="p-button-text"/></router-link>
      <h2>
        Add Data Sources
      </h2>
    </div>
    <div>
      <ConfirmDialog/>
      <Toast position="bottom-right"/>
      <Splitter style="height: 88vh; background:var(--surface-200); margin-top: 10px;">
        <SplitterPanel :size=40 style="padding-top: 50px">
          <div class="all-sources">
            <TextDatasource @expand-text="expandText()" @add-text="updateText" ></TextDatasource>
            <FolderDatasource @expand-folder="expandFolder()" @add-folder="updateFolder"></FolderDatasource>
            <WebpageDatasource @expand-webpage="expandWebpage()" @add-webpage="updateWebpage"></WebpageDatasource>
          </div>
        </SplitterPanel>
        <SplitterPanel>
          <TabView class="tabview-custom" v-if="tabs.length">
            <TabPanel v-for="(tab, index) in tabs" :key="tab.title">
              <template #header>
                <span>{{tab.title}}</span>
                <em class="pi pi-times" style="color: gray" @click="deleteTab(index)"></em>
              </template>
              <!--          For the below code, we might need to find a better way to check the type of the data source, seeing as custom data sources can be created-->
              <div v-if="tab.title==='Text'" id="text-datasources">
                <DataSourceCard
                        v-for="(item, index) in textDataSources"
                        :key=index :title="item.path + item.filename"
                        :id="item.uuid"
                        endpoint="http://localhost:3001/textdatasources"
                        @delete-item="deleteItem(tab.title)"
                >
                </DataSourceCard>
              </div>
              <div v-else-if="tab.title==='Folder'" id="folder-datasources">
                <DataSourceCard
                        v-for="(item, index) in folderDataSources"
                        :key=index :title="item.path"
                        :id="item.uuid"
                        endpoint="http://localhost:3001/folderdatasources"
                        @delete-item="deleteItem(tab.title)"
                ></DataSourceCard>
              </div>
              <div v-else-if="tab.title==='Webpage'" id="webpage-datasources">
                <DataSourceCard
                        v-for="(item, index) in webDataSources"
                        :key=index
                        :title="item.url"
                        :id="item.uuid"
                        endpoint="http://localhost:3001/webpagedatasources"
                        @delete-item="deleteItem(tab.title)"
                >
                </DataSourceCard>
              </div>
            </TabPanel>
          </TabView>
          <div v-else>
            <p style="padding-top:30px; text-align: center;">Please click on a type to view stored data sources</p>
          </div>
        </SplitterPanel>
      </Splitter>
    </div>
  </div>
</template>

<script>
import WebpageDatasource from "../components/datasources/webpage/WebpageDatasource";
import TextDatasource from "../components/datasources/text/TextDatasource";
import FolderDatasource from "../components/datasources/folder/FolderDatasource";
import DataSourceCard from "@/components/datasources/DataSourceCard";
import axios from "axios";
export default {
  components: {
    WebpageDatasource,
    TextDatasource,
    FolderDatasource,
    DataSourceCard
  },
  data() {
    return {
      msg: "No data source chosen",
      textDataSources: [],
      webDataSources: [],
      folderDataSources: [],
      tabs: [],
      name: "Data Sources"
    }
  },
  methods: {
    /**
     *@param index - The index of the tab we want to delete.
     */
    deleteTab(index){
      this.tabs.splice(index,1)
    },
    /**
     * All expandX() methods make an API call to retrieve the data sources.
     */
    expandText(){
      axios.get("http://localhost:3001/textdatasources").then(
          resp => {
            console.log(resp.data)
            this.textDataSources = resp.data
          }
      )
      //Checking whether the tab already exists.
      if (!this.isExist('Text')) {
        this.tabs.push({title: 'Text'})
      }
    },
    expandFolder(){
      axios.get("http://localhost:3001/folderdatasources").then(
          resp => {
            console.log(resp.data)
            this.folderDataSources = resp.data
          }
      )
      //Checking whether the tab already exists.
      if (!this.isExist('Folder')) {
        this.tabs.push({title: 'Folder'})
      }
    },
    expandWebpage(){
      axios.get("http://localhost:3001/webpagedatasources").then(
          resp => {
            console.log(resp.data)
            this.webDataSources = resp.data
          }
      )
      //Checking whether the tab already exists.
      if (!this.isExist('Webpage')) {
        this.tabs.push({title: 'Webpage'})
      }
    },
    /**
     *This function prevents multiple tabs from being created by looping through the tab array.
     *
     * @param title - The name of the tab we want to create
     * @returns {boolean} - Whether tab already exists or not
     */
    isExist(title) {
      for (let i of this.tabs) {
        if (i.title === title) {
          return true
        }
      }
      return false
    },
    /**
     * All updateX() methods update the contents of the tabs dynamically.
     */
    updateFolder(){
      axios.get("http://localhost:3001/folderdatasources").then(
          resp => {
            console.log(resp.data)
            this.folderDataSources = resp.data
          }
      )
    },
    updateWebpage(){
      axios.get("http://localhost:3001/webpagedatasources").then(
          resp => {
            console.log(resp.data)
            this.webDataSources = resp.data
          }
      )
    },
    updateText(){
      axios.get("http://localhost:3001/textdatasources").then(
          resp => {
            console.log(resp.data)
            this.textDataSources = resp.data
          }
      )
    },
    /**
     *Updates tabs accordingly after a source has been deleted.
     *
     * @param type - The type of data source that we have deleted
     */
    deleteItem(type){
      if(type==="Folder"){
        axios.get("http://localhost:3001/folderdatasources").then(
            resp => {
              console.log(resp.data)
              this.folderDataSources = resp.data
              console.log(this.folderDataSources)
            }
        )
      }
      else if(type==="Text"){
        axios.get("http://localhost:3001/textdatasources").then(
            resp => {
              console.log(resp.data)
              this.textDataSources = resp.data
              console.log(this.textDataSources)
            }
        )
      }
      else if(type==="Webpage"){
        axios.get("http://localhost:3001/webpagedatasources").then(
            resp => {
              console.log(resp.data)
              this.webDataSources = resp.data
              console.log(this.webDataSources)
            }
        )
      }
    }
  }
}
</script>

<style scoped lang="scss">

.grid-content {
  display: grid;
  grid-template-rows: 1fr 9fr;
}

.all-sources {
  max-width: 800px;
  margin: auto;
}

.tabview-custom {
  i, span {
    vertical-align: middle;
  }

  span {
    margin: 0 .5rem;
  }
}

.p-splitter{
  border-left: none;
  border-right:none;
  border-bottom: none;
}

.header{
  text-align:center;
}

a {
  text-decoration: none;
}

.p-button-text{
  float: left;
  padding: 0;
}

</style>
