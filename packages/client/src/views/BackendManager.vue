<template>
  <div class="management-page">

    <h1 class="backend-name">{{backend.local.name}}</h1>

    <div class="admin-table-container">

      <DataTable :value="tableData" responsiveLayout="scroll" v-model:selection="selectedUsers">

        <template #header>
          <div class="p-datatable-header"> Users</div>

        </template>

        <Column selectionMode="multiple" headerStyle="width: 3em"></Column>
        <Column field="name" header="Name"></Column>
        <Column field="lastName" header="Last Name"></Column>
        <Column field="email" header="Email"></Column>
        <Column field="permissionLevel" header="Permissions"></Column>
        <Column field="regStatus" header="Registration Status"></Column>
        <Column field="loggedIn" header="Logged In"></Column>
        <Column field="regKey" header="Registration Key"></Column>

      </DataTable>

    </div>

    <div class="backend-toolbar-container">
    <Toolbar class="backend-toolbar">
      <template #left>
        <Button label="Add User" icon="pi pi-user-plus" class="p-button-info p-mr-2 operation-button"  />
        <Button label="Remove User" icon="pi pi-user-minus" class="p-button-danger p-mr-2 operation-button"  />
        <i class="pi pi-pause p-toolbar-separator p-mr-2" />
        <Button label="Promote to Admin" icon="pi pi-chevron-up" class="p-button-success operation-button" />
        <Button label="Demote to Regular" icon="pi pi-chevron-down" class="p-button-danger operation-button" />
        <i class="pi pi-pause p-toolbar-separator p-mr-2" />
        <Button label="Revoke Keys" icon="pi pi-lock" class="p-button-danger operation-button" />
        <i class="pi pi-pause p-toolbar-separator p-mr-2" />
        <Button label="Copy" icon="pi pi-copy" class="p-button-warning operation-button" />
        <div class="p-inputgroup">
          <Button label="Promote to Admin" icon="pi pi-sort" class="p-button-success operation-button" />

        </div>
      </template>
      </Toolbar>

    </div>

    </div>



</template>

<script>
import {mapGetters} from "vuex";

export default {
  name: "BackendManager.vue",
  data() {
    return {
      backend: null,
      isUserSelected: false,
      selectedUsers: null,
      tableData: [{name: "Josh", lastName: "Walker", email: "joshwalker99.za@gmail.com", permissionLevel: "Admin", regStatus: "Registered", loggedIn: true, regKey: "45fdfgfghdnHszSQ"},
                  {name: "Dave", lastName: "Something", email: "dave1823@gmail.com", permissionLevel: "Regular", regStatus: "Unregistered", loggedIn: false, regKey: "Zw2rTuGgds234h"}]
    }
  },
  props: {
    backendID : Number,
  },
  computed: {
    ...mapGetters([
      'getUserBackend',
      'getSignedInUserId',
    ])
  },
  beforeMount() {
    //console.log(this.backendID)
    this.backend = this.getUserBackend(this.getSignedInUserId)[this.backendID]
  //  console.log(this.backend.name)
  }
}
</script>

<style scoped>

.management-page {

  width: 100%;
  height: 100%;
  display: grid;
  grid-template-rows: 3fr 14fr 2fr;
  grid-template-columns: 1fr;


}

.backend-name {
  text-align: center;
  color: #ededed;

  grid-row-start : 1;
}

.backend-toolbar {

  padding: 0.5em




}

.backend-toolbar-container {
  grid-row-start : 3;
   height: 2em;
   width: 80em;
  justify-self: center;
  align-self: center;
  margin: 0 0 2.5em;


}

.operation-button {
  margin-right: 0.16em;
  margin-left: 0.16em
}

</style>