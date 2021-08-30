<template>
  <ScrollPanel>
    <DataTable
        v-model:selection="selectedSources"
        v-model:filters="filters"
        :value="sources"
        :paginator="false"
        :scrollable="true"
        :rows="10"
        :rowsPerPageOptions="[10,20,50]"
        :row-hover="true"
        :loading="loading"
        :globalFilterFields="['location', 'backend', 'type', 'tag1', 'tag2']"
        style="align-content: center"
        scrollHeight="60vh"
        responsiveLayout="scroll"
        paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
        currentPageReportTemplate="Showing {first} to {last} of {totalRecords}"
        dataKey="id"
        filterDisplay="row"
    >
      <template #header>
        <div class="p-d-flex p-jc-end">
          <span class="p-input-icon-left ">
            <i class="pi pi-search" aria-hidden="true"/>
            <InputText v-model="filters['global'].value" placeholder="Keyword Search"/>
          </span>
          <Button
              id="add-datasource-button"
              label="Add Data Source"
              icon="pi pi-plus"
              class="p-button-text"
              @click="toggle"
          />
          <Button
              label="Delete Selected"
              type="button"
              icon="pi pi-trash"
              class="p-button-text p-button-warning delete-selection"
              @click="deleteSource"
          />
          <OverlayPanel
              ref="op"
              :showCloseIcon="true"
              :dismissable="false"
              :breakpoints="{'960px': '75vw', '640px': '100vw'}"
              :style="{width: '450px'}"
          >
            <div v-if="!clicked && backend===null">
              <div class="overlay-header">
                <span>Which backend would you like to add to?</span>
              </div>
              <div class="overlay-buttons">
                <Button
                    v-for="i in backends"
                    :key="i.id"
                    label="Backend"
                    class="button p-button-raised p-button-text p-button-plain"
                    @click="backend= i"
                >
                  {{ i }}
                </Button>
              </div>
            </div>
            <div v-else-if="!clicked && backend!=null">
              <div class="overlay-header">
                <span>What type of source would you like to add?</span>
              </div>
              <div class="overlay-buttons">
                <Button
                    id="text-button"
                    label="Document"
                    icon="pi pi-book"
                    class="button p-button-raised p-button-text p-button-plain"
                    @click="clicked=!clicked; type='File'"
                />
                <Button
                    id="folder-button"
                    v-if="backend==='Local'"
                    label="Folder"
                    icon="pi pi-folder"
                    class="button p-button-raised p-button-text p-button-plain"
                    @click="clicked=!clicked; type='Folder'"
                />
                <Button
                    id="folder-button-disabled"
                    v-else label="Folder"
                    icon="pi pi-folder"
                    class="button p-button-raised p-button-text p-button-plain"
                    @click="clicked=!clicked; type='Folder'" disabled="disabled"
                />
                <Button
                    id="web-button"
                    label="Webpage"
                    icon="pi pi-globe"
                    class="button p-button-raised p-button-text p-button-plain"
                    @click="clicked=!clicked; type='Webpage'"
                />
              </div>
            </div>
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
        Loading data. Please wait...
      </template>
      <Column selectionMode="multiple" headerStyle="width: 3em" style="max-width: 3em;">
        <template #body="{data}">
          <Checkbox
              v-if="datasourceAdminStatus(data.backend)"
              :key="data.id"
              v-model="selectedSources"
              name="source"
              :value="data"
              :disabled="false"
          />
          <Checkbox
              v-else
              :key="data.id"
              v-model="selectedSources"
              name="source"
              :value="data"
              :disabled="true"
          />
        </template>
      </Column>
      <Column header="Source Location" filterField="location" style="min-width:25rem">
        <template #body="{data}">
          <span class="image-text">
            {{ data.location }}
          </span>
        </template>
        <template #filter="{filterModel,filterCallback}">
          <InputText
              v-model="filterModel.value"
              class="p-column-filter"
              placeholder="Search by source location"
              type="text"
              @input="filterCallback()"
          />
        </template>
      </Column>
      <Column header="Backend" filterField="backend" :showFilterMenu="false" style="min-width:12rem">
        <template #body="{data}">
          <span class="image-text">
            {{ data.backend }}
          </span>
        </template>
        <template #filter="{filterModel,filterCallback}">
          <MultiSelect
              v-model="filterModel.value"
              :options="backends"
              placeholder="Any"
              class="p-column-filter"
              @change="filterCallback()"
          >
            <template #option="slotProps">
              <div class="p-multiselect-backends-option">
                <span class="image-text">
                  {{ slotProps.option }}
                </span>
              </div>
            </template>
          </MultiSelect>
        </template>
      </Column>
      <Column header="Type" filterField="type" :showFilterMenu="false" style="min-width:12rem">
        <template #body="{data}">
          <span class="image-text">
            {{ data.type }}
          </span>
        </template>
        <template #filter="{filterModel,filterCallback}">
          <MultiSelect
              v-model="filterModel.value"
              :options="types"
              placeholder="Any"
              class="p-column-filter"
              @change="filterCallback()"
          >
            <template #option="slotProps">
              <div class="p-multiselect-types-option">
                <span class="image-text">
                  {{ slotProps.option }}
                </span>
              </div>
            </template>
          </MultiSelect>
        </template>
      </Column>
      <Column header="Tag 1" filterField="tag1" :showFilterMenu="false" style="min-width:12rem;">
        <template #body="{data}">
          <Tag class="p-mr-2" severity="help" style="margin-left: 2px;">
            {{ data.tag1 }}
          </Tag>
        </template>
        <template #filter="{filterModel,filterCallback}">
          <InputText
              v-model="filterModel.value"
              type="text"
              class="p-column-filter"
              placeholder="Search tags"
              @input="filterCallback()"
          />
        </template>
      </Column>
      <Column header="Tag 2" filterField="tag2" :showFilterMenu="false" style="min-width:12rem">
        <template #body="{data}">
          <Tag class="p-mr-2" severity="warning" style="margin-left: 2px;">
            {{ data.tag2 }}
          </Tag>
        </template>
        <template #filter="{filterModel,filterCallback}">
          <InputText
              v-model="filterModel.value"
              type="text"
              class="p-column-filter"
              placeholder="Search tags"
              @input="filterCallback()"
          />
        </template>
      </Column>
    </DataTable>
  </ScrollPanel>
</template>

<script>
    import axios from "axios";
    import {FilterMatchMode} from 'primevue/api';
    import AddFileDatasource from "./file/AddFileDatasource";
    import AddFolderDatasource from "./folder/AddFolderDatasource";
    import AddWebpageDatasource from "./webpage/AddWebpageDatasource";

    export default {
        name: "DatasourcesTable",

        components: {
            AddFileDatasource,
            AddFolderDatasource,
            AddWebpageDatasource
        },

        data() {
            return {
                message: "No sources have been selected.",
                type: null,
                clicked: false,
                sources: null,
                loading: false,
                backend: null,
                selectedSources: null,
                filters: {
                    'global': {value: null, matchMode: FilterMatchMode.CONTAINS},
                    'location': {value: null, matchMode: FilterMatchMode.CONTAINS},
                    'backend': {value: null, matchMode: FilterMatchMode.IN},
                    'type': {value: null, matchMode: FilterMatchMode.IN},
                    'tag1': {value: null, matchMode: FilterMatchMode.CONTAINS},
                    'tag2': {value: null, matchMode: FilterMatchMode.CONTAINS},
                },
                types: [
                    'file', 'folder', 'webpage'
                ],
                backends: [],
            }
        },

        beforeMount() {
          if (this.$store.getters.getNewAppStatus) {
            this.$router.push('/');
          }
          this.backends = this.$store.getters.getUserBackendNames;
          console.log(this.$store.getters.getUserBackends(this.$store.getters.getSignedInUserId));
          this.updateSources();
        },

        productService: null,

        methods: {
            /**
             * Toggles the visibility of the overlay panel
             * @param event
             */
            toggle(event) {
                this.$refs.op.toggle(event);
                this.clicked = false;
                this.backend = null;
            },

            updateSources() {
                this.loading = true;
                this.sources = [];
                for (let backend of this.$store.getters.getUserBackends(this.$store.getters.getSignedInUserId)) {
                    const url = `http://${backend.connect.link}/general/datasources`;
                    const headers = {
                        "Authorization": "Bearer " + backend.connect.keys.jwtToken
                    };
                    axios
                        .get(url, {headers})
                        .then((resp) => {
                            this.handleSuccess(resp.data.data, backend.connect.link, backend.local.id, backend.local.name);
                        })
                        .catch(async () => {
                            await this.$store.dispatch("refreshJWTToken", {id: backend.local.id});
                            const headers = {
                                "Authorization": "Bearer " + this.$store.getters.getBackendJWTToken(backend.local.id)
                            };
                            await axios
                                .get(url, {headers})
                                .then((resp) => {
                                    this.handleSuccess(resp.data.data, backend.connect.link, backend.local.id, backend.local.name);
                                })
                                .catch((e) => {
                                    console.error(e);
                                })
                        })
                }
            },

            /**
             * Method called on success of the axios call made in updateSources.
             *
             * @param results - data returned by axios call
             * @param link - backend link to which the axios call is made
             * @param id - id belonging to the backend to which the axios call is made
             * @param name - name belonging to the backend to which the axios call is made
             */
            handleSuccess(results, link, id, name) {
                for (let r of results) {
                    r.link = link;
                    r.backendId = id;
                    r.backend = name;
                }
                this.sources = this.sources.concat(results);

                if (this.sources.length === 0) {
                    this.$toast.add({
                        severity: 'warn',
                        summary: 'No sources',
                        detail: "Try adding data sources",
                        life: 3000
                    });
                }
                this.loading = false;
            },

            /**
             * Queries the store to check the admin status associated with the user for a specific backend.
             *
             * @param source - name of the backend to be queried
             * @returns {boolean|*} - returns a boolean indicating whether a user has admin privileges (true) or not (false)
             */
            datasourceAdminStatus(source) {
                if (source === "Local") {
                    return true;
                } else {
                    return this.$store.getters.getBackendAdminStatus(source);
                }
            },

            deleteSource() {
                if (this.selectedSources === null) {
                    this.$toast.add({
                        severity: 'info',
                        summary: 'No Sources Selected',
                        detail: 'Please select sources to delete',
                        life: 3000
                    });
                    return;
                } else if (this.selectedSources.length === 1) {
                    this.message = "Are you sure you want to delete this data source?";
                } else if (this.selectedSources.length > 1) {
                    this.message = "Are you sure you want to delete these data sources?";
                }
                this.$confirm.require({
                    message: this.message,
                    header: 'Confirmation',
                    icon: 'pi pi-exclamation-triangle',
                    acceptClass: "p-button-danger",
                    rejectClass: "p-button-text p-button-plain",
                    accept: () => {
                        let source;
                        for (source in this.selectedSources) {
                            const url = `http://${this.selectedSources[source].link}/general/datasources`;
                            console.log(url);
                            axios
                                .delete(url, {
                                    "data": {
                                        "type": this.selectedSources[source].type,
                                        "id": this.selectedSources[source].id
                                    }
                                })
                                .then(() => {
                                    this.$toast.add({
                                        severity: 'success',
                                        summary: 'Deleted',
                                        detail: "Source deleted",
                                        life: 3000
                                    });
                                    this.updateSources();
                                })
                                .catch(() => {
                                    this.$toast.add({
                                        severity: 'error',
                                        summary: 'Error',
                                        detail: "Could not delete source",
                                        life: 3000
                                    });
                                })
                        }
                        this.selectedSources = null;
                    }
                })
            }
        }
    }
</script>

<style scoped>
  td {
    border-top: 1px solid white;
    border-bottom: 1px solid white;
  }

  a {
    text-decoration: none;
  }

  .pi-search {
    padding: 0;
  }

  .button {
    margin-left: 8px;
    margin-bottom: 5px;
  }

  .overlay-header {
    margin-bottom: 30px;
  }

  .p-input-icon-left {
    margin-left: 50px;
  }

  .p-inputtext {
    background-color: #242424;
  }

  .p-multiselect {
    background-color: #242424;
    height: 34px;
  }

.image-text{
  word-break: break-word;
}

.delete-selection{
  float: right;
  margin-right: 2vw;
}

.p-scrollpanel{
  width: 95vw;
  height: 80vh;
  bottom: 2em;
  padding-bottom: 1vh;
  align-content: center;
}

@media only screen and (max-width: 900px) {
  .delete-selection{
    display: none;
  }

  .p-scrollpanel{
    width: 92vw;
  }

  #add-datasource-button{
    display: none;
  }
}

.data-table{
 bottom: 4em;
}

#add-datasource-button{
  float: right;
  margin-right: 2vw;
}
</style>