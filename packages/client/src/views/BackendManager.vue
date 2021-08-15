<template>
  <div class="management-page">

    <h1 class="backend-name">{{backend.local.name}}</h1>

    <div class="admin-table-container">

      <DataTable class="table" :value="tableData"  v-model:selection="selectedUsers" :scrollable="true" scrollHeight="70vh">

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
        <span class="p-buttonset">
        <Button label="Add User" icon="pi pi-user-plus" class="p-button p-button-success p-mr-2 p-button-custom-med"  />
          <Button label="Remove User" icon="pi pi-user-minus" class="p-button-danger p-mr-2  p-button-custom-med"  />
        </span>
          <i class="pi pi-pause p-toolbar-separator p-mr-2" />
        <Button label="Change Permissions" icon="pi pi-sort" class="p-button-info p-mr-2 permissions-button p-button-custom-med"  />
        <Dropdown v-model="selectedPermissionLevel" :options="permissionOptions" placeholder="Select a Role" />
          <i class="pi pi-pause p-toolbar-separator p-mr-2" />
        <span class="p-buttonset">
        <Button label="Logout" icon="pi pi-lock" class="p-button-warning p-button-custom-med" />
          <Button label="Revoke Keys" icon="pi pi-lock" class="p-button-danger p-button-custom-med" />
        </span>
          <i class="pi pi-pause p-toolbar-separator p-mr-2" />
        <Button label="Copy" icon="pi pi-copy" class="p-button-info p-button-custom-med" />

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
      selectedPermissionLevel : null,
      permissionOptions: ['Super', 'Admin', 'Moderator', 'Regular'],
      tableData: [{name: "Josh", lastName: "Walker", email: "joshwalker99.za@gmail.com", permissionLevel: "Admin", regStatus: "Registered", loggedIn: true, regKey: "45fdfgfghdnHszSQ"},
        {name: "Josh", lastName: "Walker", email: "joshwalker99.za@gmail.com", permissionLevel: "Admin", regStatus: "Registered", loggedIn: true, regKey: "45fdfgfghdnHszSQ"},
        {name: "Josh", lastName: "Walker", email: "joshwalker99.za@gmail.com", permissionLevel: "Admin", regStatus: "Registered", loggedIn: true, regKey: "45fdfgfghdnHszSQ"},
        {name: "Josh", lastName: "Walker", email: "joshwalker99.za@gmail.com", permissionLevel: "Admin", regStatus: "Registered", loggedIn: true, regKey: "45fdfgfghdnHszSQ"},
        {name: "Josh", lastName: "Walker", email: "joshwalker99.za@gmail.com", permissionLevel: "Admin", regStatus: "Registered", loggedIn: true, regKey: "45fdfgfghdnHszSQ"},
        {name: "Josh", lastName: "Walker", email: "joshwalker99.za@gmail.com", permissionLevel: "Admin", regStatus: "Registered", loggedIn: true, regKey: "45fdfgfghdnHszSQ"},
        {name: "Josh", lastName: "Walker", email: "joshwalker99.za@gmail.com", permissionLevel: "Admin", regStatus: "Registered", loggedIn: true, regKey: "45fdfgfghdnHszSQ"},
        {name: "Josh", lastName: "Walker", email: "joshwalker99.za@gmail.com", permissionLevel: "Admin", regStatus: "Registered", loggedIn: true, regKey: "45fdfgfghdnHszSQ"},
        {name: "Josh", lastName: "Walker", email: "joshwalker99.za@gmail.com", permissionLevel: "Admin", regStatus: "Registered", loggedIn: true, regKey: "45fdfgfghdnHszSQ"},
        {name: "Josh", lastName: "Walker", email: "joshwalker99.za@gmail.com", permissionLevel: "Admin", regStatus: "Registered", loggedIn: true, regKey: "45fdfgfghdnHszSQ"},
        {name: "Josh", lastName: "Walker", email: "joshwalker99.za@gmail.com", permissionLevel: "Admin", regStatus: "Registered", loggedIn: true, regKey: "45fdfgfghdnHszSQ"},
        {name: "Josh", lastName: "Walker", email: "joshwalker99.za@gmail.com", permissionLevel: "Admin", regStatus: "Registered", loggedIn: true, regKey: "45fdfgfghdnHszSQ"},
        {name: "Josh", lastName: "Walker", email: "joshwalker99.za@gmail.com", permissionLevel: "Admin", regStatus: "Registered", loggedIn: true, regKey: "45fdfgfghdnHszSQ"},
        {name: "Josh", lastName: "Walker", email: "joshwalker99.za@gmail.com", permissionLevel: "Admin", regStatus: "Registered", loggedIn: true, regKey: "45fdfgfghdnHszSQ"},
        {name: "Josh", lastName: "Walker", email: "joshwalker99.za@gmail.com", permissionLevel: "Admin", regStatus: "Registered", loggedIn: true, regKey: "45fdfgfghdnHszSQ"},
        {name: "Josh", lastName: "Walker", email: "joshwalker99.za@gmail.com", permissionLevel: "Admin", regStatus: "Registered", loggedIn: true, regKey: "45fdfgfghdnHszSQ"},
        {name: "Josh", lastName: "Walker", email: "joshwalker99.za@gmail.com", permissionLevel: "Admin", regStatus: "Registered", loggedIn: true, regKey: "45fdfgfghdnHszSQ"},
        {name: "Josh", lastName: "Walker", email: "joshwalker99.za@gmail.com", permissionLevel: "Admin", regStatus: "Registered", loggedIn: true, regKey: "45fdfgfghdnHszSQ"},
        {name: "Josh", lastName: "Walker", email: "joshwalker99.za@gmail.com", permissionLevel: "Admin", regStatus: "Registered", loggedIn: true, regKey: "45fdfgfghdnHszSQ"},
        {name: "Josh", lastName: "Walker", email: "joshwalker99.za@gmail.com", permissionLevel: "Admin", regStatus: "Registered", loggedIn: true, regKey: "45fdfgfghdnHszSQ"},
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
  grid-template-rows: 1fr 10fr;
  grid-template-columns: 1fr;


}

.backend-name {
  text-align: center;
  color: #ededed;

  grid-row-start : 1;
}

.backend-toolbar {

  padding: 0.3em

}

.backend-toolbar-container {
  justify-self: center;
  position: sticky;
  bottom: 3vh;
  align-self: center;
  margin: 0 0 2.5em;



}

.operation-button {
  margin-right: 0.16em;
  margin-left: 0.16em
}

.permissions-button {
  margin-right: 0;
  border-bottom-right-radius: 0;
  border-top-right-radius: 0;


}


.p-button-custom-med {
  padding: 0.54rem 0.74rem;
  font-size: 1rem;
}

.p-button {
  padding: 0.54rem 0.74rem;
  font-size: 1rem;
}

.table {
  grid-row-start: 2;
  padding-left: 0.5em;
  padding-right: 0.5em;
}

.p-datatable-header {

  padding: 0.4rem 0.4rem;

}


::v-deep(.p-inputtext) {

  padding: 0.54rem 0.74rem;
  font-size: 1rem;


}

::v-deep(.p-dropdown) {

  border-bottom-left-radius: 0;
  border-top-left-radius: 0;
  width: 8em;


}



</style>