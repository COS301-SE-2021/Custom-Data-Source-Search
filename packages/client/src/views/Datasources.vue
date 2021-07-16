<template>
  <h2>
    Data Sources
  </h2>
  <router-link class="icon" to="/addDatasources"><Button label="Add Data Source" class="p-button-text"/></router-link>

  <div class="card">
    <DataTable :value="sources" :paginator="true" class="p-datatable-customers" :rows="10"
               dataKey="id" v-model:filters="filters2" filterDisplay="row" :loading=loading responsiveLayout="scroll"
               :globalFilterFields="['country.name']">
      <template #header>
        <div class="p-d-flex p-jc-end">
        </div>
      </template>
      <template #empty>
        No sources found.
      </template>
      <template #loading>
        Loading data. Please wait.
      </template>
      <Column header="Source Location" filterField="path" style="min-width:12rem">
        <template #body="{data}">
          <span class="image-text">{{data.path}}</span>
        </template>
        <template #filter="{filterModel,filterCallback}">
          <InputText type="text" v-model="filterModel.value" @input="filterCallback()" class="p-column-filter" placeholder="Search by source location"/>
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
      filters2: {
        'global': {value: null, matchMode: FilterMatchMode.CONTAINS},
        'path': {value: null, matchMode: FilterMatchMode.STARTS_WITH},
      },
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

.customTable{
  width: 90%;
  margin: 10px auto;
}

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

</style>