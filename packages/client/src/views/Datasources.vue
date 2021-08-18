<template>
  <div class="page">
    <ConfirmDialog></ConfirmDialog>
    <Toast position="bottom-right"/>
    <h2>
      Data Sources
    </h2>
    <ScrollPanel style="width: 100%; height: 90%">
      <DataTable :value="sources" :paginator="true" :rows="10"
                 paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
                 :rowsPerPageOptions="[10,20,50]" v-model:selection="selectedSources"
                 currentPageReportTemplate="Showing {first} to {last} of {totalRecords}"
                 dataKey="id" v-model:filters="filters2" filterDisplay="row" :loading="loading" responsiveLayout="scroll"
                 :globalFilterFields="['location', 'backend', 'type', 'tag1', 'tag2']">
        <template #header>
          <div class="p-d-flex p-jc-end">
          <span class="p-input-icon-left ">
            <i class="pi pi-search" aria-hidden="true"/>
            <InputText v-model="filters2['global'].value" placeholder="Keyword Search"/>
          </span>
            <Button label="Add Data Source" icon="pi pi-plus" class="p-button-text" @click="toggle"
                    style="float: right;"/>
            <OverlayPanel ref="op" :showCloseIcon="false" :dismissable="true"
                          :breakpoints="{'960px': '75vw', '640px': '100vw'}" :style="{width: '450px'}">
              <div v-if="!clicked && backend===null">
                <div class="overlay-header">
                  <span>Which backend would you like to add to?</span>
                </div>
                <div class="overlay-buttons">
                  <Button v-for="i in backends" :key="i.id" label="Backend"
                          class="button p-button-raised p-button-text p-button-plain" @click="backend=i">{{ i }}
                  </Button>
                </div>
              </div>
              <div v-else-if="!clicked && backend!=null">
                <div class="overlay-header">
                  <span>What type of source would you like to add?</span>
                </div>
                <div class="overlay-buttons">
                  <Button label="Document" icon="pi pi-book" class="button p-button-raised p-button-text p-button-plain"
                          id="text-button" @click="clicked=!clicked; type='File'"/>
                  <Button label="Folder" icon="pi pi-folder" class="button p-button-raised p-button-text p-button-plain"
                          id="folder-button" @click="clicked=!clicked; type='Folder'"/>
                  <Button label="Webpage" icon="pi pi-globe" class="button p-button-raised p-button-text p-button-plain"
                          id="web-button" @click="clicked=!clicked; type='Webpage'"/>
                </div>
              </div>
              <!--            Different contents for the overlay are shown for different types-->
              <div v-else-if="type==='File'">
                <add-file-datasource :backend="backend" @submitted="toggle(); updateSources()"/>
              </div>
              <div v-else-if="type==='Folder'">
                <add-folder-datasource :backend="backend" @submitted="toggle(); updateSources()"/>
              </div>
              <div v-else-if="type==='Webpage'">
                <add-webpage-datasource :backend="backend" @submitted="toggle(); updateSources()"/>
              </div>
            </OverlayPanel>
          </div>
        </template>
        <template #empty>
          No sources found.
        </template>
        <template #loading>
          Loading data. Please wait.
        </template>
        <Column selectionMode="multiple" headerStyle="width: 3em">
          <template #body="{data}">
            <Checkbox v-if="deleteSourceStatus(data.backend)" id="id" name="source" :value="data" v-model="selectedSources" :disabled="false"/>
            <Checkbox v-else id="id2" name="source" :value="data" v-model="selectedSources" :disabled="true"/>
          </template>
        </Column>
        <Column header="Source Location" filterField="location" style="min-width:25rem">
          <template #body="{data}">
            <span class="image-text">{{ data.location }}</span>
          </template>
          <template #filter="{filterModel,filterCallback}">
            <InputText type="text" v-model="filterModel.value" @input="filterCallback()" class="p-column-filter"
                       placeholder="Search by source location"/>
          </template>
        </Column>
        <Column header="Backend" filterField="backend" :showFilterMenu="false" style="min-width:12rem">
          <template #body="{data}">
            <span class="image-text">{{ data.backend }}</span>
          </template>
          <template #filter="{filterModel,filterCallback}">
            <MultiSelect v-model="filterModel.value" @change="filterCallback()" :options="backends" placeholder="Any"
                         class="p-column-filter">
              <template #option="slotProps">
                <div class="p-multiselect-backends-option">
                  <span class="image-text">{{ slotProps.option }}</span>
                </div>
              </template>
            </MultiSelect>
          </template>
        </Column>
        <Column header="Type" filterField="type" :showFilterMenu="false" style="min-width:12rem">
          <template #body="{data}">
            <span class="image-text">{{ data.type }}</span>
          </template>
          <template #filter="{filterModel,filterCallback}">
            <MultiSelect v-model="filterModel.value" @change="filterCallback()" :options="types" placeholder="Any"
                         class="p-column-filter">
              <template #option="slotProps">
                <div class="p-multiselect-types-option">
                  <span class="image-text">{{ slotProps.option }}</span>
                </div>
              </template>
            </MultiSelect>
          </template>
        </Column>
        <Column header="Tag 1" filterField="tag1" :showFilterMenu="false" style="min-width:12rem;">
          <template #body="{data}">
            <Tag class="p-mr-2" severity="help" style="margin-left: 2px;">{{ data.tag1 }}</Tag>
          </template>
          <template #filter="{filterModel,filterCallback}">
            <InputText type="text" v-model="filterModel.value" @input="filterCallback()" class="p-column-filter"
                       placeholder="Search tags"/>
          </template>
        </Column>
        <Column header="Tag 2" filterField="tag2" :showFilterMenu="false" style="min-width:12rem">
          <template #body="{data}">
            <Tag class="p-mr-2" severity="warning" style="margin-left: 2px;">{{ data.tag2 }}</Tag>
          </template>
          <template #filter="{filterModel,filterCallback}">
            <InputText type="text" v-model="filterModel.value" @input="filterCallback()" class="p-column-filter"
                       placeholder="Search tags"/>
          </template>
        </Column>
        <template #paginatorLeft>
          <span><Button label="Delete Selected" type="button" icon="pi pi-trash" class="p-button-text p-button-warning" @click="deleteSource"/></span>
        </template>
        <template #paginatorRight>
        </template>
      </DataTable>
    </ScrollPanel>
  </div>

</template>

<script>

import axios from "axios";
import {FilterMatchMode} from 'primevue/api';
import AddFileDatasource from "@/components/datasources/file/AddFileDatasource";
import AddFolderDatasource from "@/components/datasources/folder/AddFolderDatasource";
import AddWebpageDatasource from "@/components/datasources/webpage/AddWebpageDatasource";

export default {
  data() {
    return {
      message: "No sources have been selected.",
      type: null,
      clicked: false,
      sources: null,
      loading: false,
      backend: null,
      selectedSources: null,
      filters2: {
        'global': {value: null, matchMode: FilterMatchMode.CONTAINS},
        'location': {value: null, matchMode: FilterMatchMode.CONTAINS},
        'backend': {value: null, matchMode: FilterMatchMode.IN},
        'type': {value: null, matchMode: FilterMatchMode.IN},
        'tag1': {value: null, matchMode: FilterMatchMode.CONTAINS},
        'tag2': {value: null, matchMode: FilterMatchMode.CONTAINS},
      },
      types: [
        'File', 'Folder', 'Webpage'
      ],
      backends: [],
      colours: [
        'success', 'secondary', 'info', 'warning', 'help', 'danger'
      ]
    }
  },
  components: {
    AddFileDatasource,
    AddFolderDatasource,
    AddWebpageDatasource
  },
  beforeMount() {
    if (this.$store.getters.getNewAppStatus) {
      this.$router.push('/');
    }
  },
  productService: null,
  mounted() {
    this.backends = this.$store.getters.getUserBackendNames;
    this.backends.push("Local");

    axios.get("http://localhost:3001/general/datasources").then(
        resp => {
          console.log(resp.data);
          this.sources = resp.data.data;
          let i;
          for (i = 0; i < this.sources.length; i++) {
            this.sources[i]["backend"] = "Local"
          }
          this.loading = false
        }
    )
    console.log(this.backends)
  },
  methods: {

    toggle(event) {
      this.$refs.op.toggle(event);
      this.clicked = false;
      this.backend = null;
    },
    updateSources(){
      //Update list of sources upon addition of new source.
      this.loading = true;

      axios.get("http://localhost:3001/general/datasources").then(
          resp => {
            console.log(resp.data);
            this.sources = resp.data.data;
            let i;
            for (i = 0; i < this.sources.length; i++) {
              this.sources[i]["backend"] = "Local"
            }
            this.loading = false
          }
      )
    },
    deleteSourceStatus(source){
      if(source === "Local"){
        return true;
      }
      else{
        return this.$store.getters.getBackendAdminStatus(source);
      }
    },
    deleteSource(){
      console.log(this.selectedSources)
      if(this.selectedSources===null){
        this.$toast.add({severity:'info', summary: 'No Sources Selected', detail:'Please select sources to delete', life: 3000});
        return;
      }
      else if(this.selectedSources.length===1){
        this.message="Are you sure you want to delete this data source?"
      }
      else if(this.selectedSources.length>1){
        this.message="Are you sure you want to delete these data sources?"
      }
      this.$confirm.require({
        message: this.message,
        header: 'Confirmation',
        icon: 'pi pi-exclamation-triangle',
        acceptClass: "p-button-danger",
        rejectClass: "p-button-text p-button-plain",
        accept: () => {
          //Loop through all items to delete
          let source;
          for(source in this.selectedSources){
            axios
                .delete("http://localhost:3001/general/datasources", {"data": {"type": this.selectedSources[source].type, "id": this.selectedSources[source].id}})
                .then(() => {
                  this.$toast.add({
                    severity: 'success',
                    summary: 'Deleted',
                    detail: "Source deleted",
                    life: 3000});
                  this.updateSources()
                })
                .catch(() => {
                  this.$toast.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: "Could not delete source",
                    life: 3000
                  })
                })
          }
          console.log(this.sources)
        },
        reject: () => {
          //callback to execute when user rejects the action
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">

.page{
  height: 100vh;
}

td {
  border-top: 1px solid white;
  border-bottom: 1px solid white;
}

h2 {
  margin: 30px 20px 30px 70px;
}

a {
  text-decoration: none;
}

.pi-search {
  padding: 0;
}

.p-inputtext {
  background-color: #242424;
}

.button {
  margin-left: 8px;
  margin-bottom: 5px;
}

.p-multiselect {
  background-color: #242424;
  height: 34px;
}

.overlay-header {
  margin-bottom: 30px;
}

.card {
  width: 95%;
  margin-left: 2.5%;
}

.p-input-icon-left {
 margin-left: 50px;
}
</style>