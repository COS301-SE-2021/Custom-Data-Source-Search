<template>
  <h2>
    Data Sources
  </h2>
  <div class="card">
    <DataTable :value="endpoint" :paginator="true" class="p-datatable-customers" :rows="10"
               dataKey="id" v-model:filters="filters2" filterDisplay="row" :loading=false responsiveLayout="scroll"
               :globalFilterFields="['location', 'backend', 'type', 'tag1', 'tag2']">
      <template #header>
        <div class="p-d-flex p-jc-end">
          <span class="p-input-icon-left ">
            <i class="pi pi-search" aria-hidden="true"/>
            <InputText v-model="filters2['global'].value" placeholder="Keyword Search" />
          </span>
          <router-link class="icon" to="/addDatasources"><Button label="Add Data Source" icon="pi pi-plus" class="p-button-text"/></router-link>

        </div>
      </template>
      <template #empty>
        No sources found.
      </template>
      <template #loading>
        Loading data. Please wait.
      </template>
      <Column header="Source Location" filterField="location" style="min-width:12rem">
        <template #body="{data}">
          <span class="image-text">{{data.location}}</span>
        </template>
        <template #filter="{filterModel,filterCallback}">
          <InputText type="text" v-model="filterModel.value" @input="filterCallback()" class="p-column-filter" placeholder="Search by source location"/>
        </template>
      </Column>
      <Column header="Backend" filterField="backend" style="min-width:12rem">
        <template #body="{data}">
          <span class="image-text">{{data.backend}}</span>
        </template>
        <template #filter="{filterModel,filterCallback}">
          <InputText type="text" v-model="filterModel.value" @input="filterCallback()" class="p-column-filter" placeholder="Search by backend"/>
        </template>
      </Column>
      <Column header="Type" filterField="type" style="min-width:12rem">
        <template #body="{data}">
          <span class="image-text">{{data.type}}</span>
        </template>
        <template #filter="{filterModel,filterCallback}">
          <InputText type="text" v-model="filterModel.value" @input="filterCallback()" class="p-column-filter" placeholder="Sort by type"/>
        </template>
      </Column>
      <Column header="Tag 1" filterField="tag1" :showFilterMenu="false" style="min-width:12rem">
        <template #body="{data}">
          <span class="image-text">{{data.tag1}}</span>
        </template>
        <template #filter="{filterModel,filterCallback}">
          <MultiSelect v-model="filterModel.value" @change="filterCallback()" :options="tags" placeholder="Any" class="p-column-filter">
            <template #option="slotProps">
              <div class="p-multiselect-tag1-option">
                <span class="image-text">{{slotProps.option}}</span>
              </div>
            </template>
          </MultiSelect>
        </template>
      </Column>
      <Column header="Tag 2" filterField="tag2" style="min-width:12rem">
        <template #body="{data}">
          <span class="image-text">{{data.tag2}}</span>
        </template>
        <template #filter="{filterModel,filterCallback}">
          <InputText type="text" v-model="filterModel.value" @input="filterCallback()" class="p-column-filter" placeholder="Sort by tag"/>
        </template>
      </Column>
    </DataTable>
  </div>

</template>

<script>

import axios from "axios";
import {FilterMatchMode} from 'primevue/api';
export default {
  data() {
    return {
      sources: null,
      loading: false,
      //Template for the endpoint
      endpoint:[
        {
          location: "desktop",
          backend: "Sonic Co",
          type: "Folder",
          tag1: "Business",
          tag2: "Fun"
        }
      ],
      filters2: {
        'global': {value: null, matchMode: FilterMatchMode.CONTAINS},
        'location': {value: null, matchMode: FilterMatchMode.CONTAINS},
        'backend': {value: null, matchMode: FilterMatchMode.CONTAINS},
        'type': {value: null, matchMode: FilterMatchMode.CONTAINS},
        'tag1': {value: null, matchMode: FilterMatchMode.IN},
        'tag2': {value: null, matchMode: FilterMatchMode.CONTAINS},
      },
      tags: [
        'Fun', 'Business', 'Home'
      ],
    }
  },
  productService: null,
  mounted() {
    this.loading = true;

    axios.get("http://localhost:3001/folderdatasources").then(
        resp => {
          console.log(resp.data)
          this.sources = resp.data
          this.loading = false
        }
    )
  },
  methods: {
  }
}
</script>

<style scoped lang="scss">

td{
  border-top: 1px solid white;
  border-bottom: 1px solid white;
}

h2{
  margin: 30px 20px 30px 55px;
}

a {
  text-decoration: none;
}

.p-button-text{
  float: right;
  margin-right: 10%;
}

.pi-search{
  padding: 0;
}

.p-inputtext{
  background-color: #242424;
}

.p-multiselect{
  background-color: #242424;
  height: 34px;
}

</style>