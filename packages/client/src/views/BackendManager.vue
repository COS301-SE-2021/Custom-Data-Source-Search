<template>
  <div class="management-page">

    <h1 class="backend-name">{{backend.local.name}}</h1>

    <div class="admin-table-container">

      <DataTable class="p-datatable-sm table"  @rowSelect="onRowSelect" @rowUnselect="onRowUnselect" @rowSelectAll="onRowSelectAll" @rowUnselectAll="onRowUnselectAll" :rowHover="true" :value="tableData"  v-model:selection="selectedUsers" :scrollable="true" scrollHeight="70vh">

        <template #header>

          <div class="p-datatable-header"> Users</div>

        </template>

        <Column selectionMode="multiple" headerStyle="width: 1em"></Column>
        <Column field="first_name" header="Name"></Column>
        <Column field="last_name" header="Last Name"></Column>
        <Column field="email" header="Email"></Column>
        <Column field="role" header="Role"></Column>
        <Column field="regStatus" header="Registration Status"></Column>
        <Column field="loggedIn" header="Logged In"></Column>
        <Column field="regKey" header="Registration Key"></Column>

      </DataTable>

    </div>

    <div class="backend-toolbar-container">
    <Toolbar class="backend-toolbar">
      <template #left>
        <span class="p-buttonset">
        <Button @click="showAddUsers" label="Add User" icon="pi pi-user-plus" class="p-button p-button-success p-mr-2 p-button-custom-med"  />
          <Button :disabled="!isUserSelected" @click="deleteUsers" label="Remove User" icon="pi pi-user-minus" class="p-button-danger p-mr-2  p-button-custom-med"  />
        </span>
          <i class="pi pi-pause p-toolbar-separator p-mr-2" aria-hidden="true" />
        <Button :disabled="!isUserSelected" @click="changeUserRoles" label="Change Roles" icon="pi pi-sort" class="p-button-info p-mr-2 permissions-button p-button-custom-med"  />
        <Dropdown class="toolbar-dropdown" :disabled="!isUserSelected" v-model="selectedRole" :options="roleOptions" placeholder="Select a Role" />
          <i class="pi pi-pause p-toolbar-separator p-mr-2" aria-hidden="true" />
        <span class="p-buttonset">
        <Button :disabled="!isUserSelected" @click="logOutUsers" label="Logout" icon="pi pi-lock" class="p-button-warning p-button-custom-med" />
          <Button :disabled="!isUserSelected" @click="revokeUserKeys" label="Revoke Keys" icon="pi pi-ban" class="p-button-danger p-button-custom-med" />
        </span>
          <i class="pi pi-pause p-toolbar-separator p-mr-2" aria-hidden="true"/>
        <Button :disabled="!isUserSelected" @click="copyUsers" label="Copy" icon="pi pi-copy" class="p-button-info p-button-custom-med" />

      </template>
      </Toolbar>

      <Dialog header="Add User" v-model:visible="showAddUserDialog" :style="{width: '35em'}" :position="addUserPos" :modal="true" dismissable-mask=true>

        <div style="display: flex; flex-direction: column;">

        <div class="p-field p-grid" style="margin-top: 0.8em; margin-left:0.8em; display: flex">

          <div class="p-field p-col-12 p-md-4" >
            <span class="p-float-label">
                        <InputText id="input-firstname" type="text" v-model="addUserFirstName"  />
                        <label for="input-firstname">First Name</label>
                    </span>
          </div>

          <div class="p-field p-col-12 p-md-4" style="margin-left: 2em">
            <span class="p-float-label">
                        <InputText id="input-lastname" type="text" v-model="addUserLastName"  />
                        <label for="input-lastname">Last Name</label>
                    </span>
          </div>

        </div>
        <div class="p-field p-grid" style="margin-top: 0.8em; margin-left:0.8em">

          <div class="p-field p-col-12 p-md-4" >
            <span class="p-float-label">
                        <InputText id="input-email" type="text" v-model="addUserEmail"  />
                        <label for="input-email">Email</label>
                    </span>
          </div>

        </div>
        <div class="p-field p-grid" style="margin-top: 0.8em; margin-left:0.8em">

          <div class="p-field p-col-12 p-md-4" >
            <span class="p-float-label">
                <Dropdown id="input-perm" v-model="addUserRole" :options="roleOptions" />
                        <label for="input-perm">Role</label>
                    </span>
          </div>

        </div>



        </div>

        <template #footer>
          <Button label="Cancel" icon="pi pi-times" @click="hideAddUsers" class="p-button-text" />
          <Button label="Add" icon="pi pi-check" @click="addUsers" autofocus />
        </template>


      </Dialog>

    </div>

    <Toast position="bottom-right"/>

    </div>



</template>

<script>
import {mapGetters} from "vuex";
import axios from "axios";

export default {
  name: "BackendManager.vue",
  data() {
    return {
      backend: null,
      isUserSelected: false,
      selectedUsers: null,
      selectedRole : null,

      showAddUserDialog : false,
      addUserPos: "bottomleft",

      addUserFirstName: "",
      addUserLastName: "",
      addUserEmail: "",
      addUserRole: "",

      //Needs to be determined on page load
      roleOptions: ['Super', 'Admin', 'Editor', 'Viewer'],

      //Temporarily Hardcoded for Testing
      tableData: []
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
  methods : {

    //Populate Table with users from backend
    updateTableData() {

      //FOR TESTING LOCALLY, MUST CHANGE TO ACTUAL URL

      axios.get("http://localhost:3001/users")
          .then((resp) => {

            this.$toast.add({
              severity: 'success',
              summary: 'Success',
              detail: "Updated Table",
              life: 3000
            });

            this.tableData = resp.data.data;

            console.log(resp.data);

          }).catch( (error) => {
        this.$toast.add({
          severity: 'error',
          summary: 'Error',
          detail: error.response.data.message,
          life: 3000
        })
        console.log(error);
      })



    },
    //Add a User to backend
    addUsers(){

     // let config
      let reqUser = {first_name: this.addUserFirstName, last_name: this.addUserLastName,
        email: this.addUserEmail, role: this.addUserRole.toLowerCase() }

      let reqObj = {users : [reqUser]};

      let reqBody = JSON.stringify(reqObj);

      //FOR TESTING LOCALLY, MUST CHANGE TO ACTUAL URL

      //axios.post(this.backend.connect.link + "/users", reqBody ).then(
      axios.post("http://localhost:3001/users", reqBody,
          { headers : {"Content-Type" : "application/json" }} )
          .then((resp) => {

            this.$toast.add({
              severity: 'success',
              summary: 'Success',
              detail: "Updated Table",
              life: 3000
            });

            console.log(resp.data);
            this.updateTableData();

          }).catch( (error) => {
        this.$toast.add({
          severity: 'error',
          summary: 'Error',
          detail: error.response.data.message,
          life: 3000
        })
        console.log(error);
      })


    },
    deleteUsers(){

      let usersArr = this.selectedUsers.map(function(a) {return { uuid : a.id};});

      let reqObj = { users: usersArr };

      let reqBody = JSON.stringify(reqObj);

    //  axios.delete(this.backend.connect.link + "/users", reqBody )
      axios.delete("http://localhost:3001/users",
          {data : reqBody, headers : {"Content-Type" : "application/json" }})
          .then((resp) => {

            this.$toast.add({
              severity: 'success',
              summary: 'Success',
              detail: "Updated Table",
              life: 3000
            });

            console.log(resp.data);
            this.updateTableData();

          }).catch( (error) => {
        this.$toast.add({
          severity: 'error',
          summary: 'Error',
          detail: error.response.data.message,
          life: 3000
        })
        console.log(error);
      })


    },
    changeUserRoles(){

      let reqObj = {role: this.selectedRole,
                    users: this.selectedUsers}

      let reqBody = JSON.stringify(reqObj);

      axios.post(this.backend.connect.link + "/users/role", reqBody).then(
          resp => {

            if(resp.data === 200){

              this.$toast.add({
                severity: 'success',
                summary: 'Success',
                detail: "Changed Roles",
                life: 3000});

              this.updateTableData();

            } else {
              this.$toast.add({
                severity: 'warning',
                summary: 'Error',
                detail: "Could Not Change Roles",
                life: 3000});
            }
            console.log(resp.data);

          }
      )

    },
    revokeUserKeys(){

      let reqObj = { users: this.selectedUsers}

      let reqBody = JSON.stringify(reqObj);

      axios.post(this.backend.connect.link + "/users/revoke", reqBody).then(
          resp => {

            if(resp.data === 200){

              this.$toast.add({
                severity: 'success',
                summary: 'Success',
                detail: "Revoked Keys",
                life: 3000});

              this.updateTableData();

            } else {
              this.$toast.add({
                severity: 'warning',
                summary: 'Error',
                detail: "Could Not Revoke Keys",
                life: 3000});
            }
            console.log(resp.data);

          }
      )

    },
    logOutUsers(){

      let reqObj = { users: this.selectedUsers}

      let reqBody = JSON.stringify(reqObj);

      axios.post(this.backend.connect.link + "/users/logout", reqBody).then(
          resp => {

            if(resp.data === 200){

              this.$toast.add({
                severity: 'success',
                summary: 'Success',
                detail: "Logged Users Out",
                life: 3000});

              this.updateTableData();

            } else {
              this.$toast.add({
                severity: 'warning',
                summary: 'Error',
                detail: "Could Not Log Users out",
                life: 3000});
            }
            console.log(resp.data);

          }
      )

    },
    //Copy backend url and user name, email, registration key to clipboard
    copyUsers(){

      let usersString = "";

      for(let userData of this.selectedUsers) {
        usersString += "Backend: " + this.backend.connect.link;
        usersString += " ,Email: " + userData.email;
        usersString += " ,Name: " + userData.first_name + " " + userData.last_name;
        usersString += " ,Registration Key: " + userData.regKey + "\n";

      }

      navigator.clipboard.writeText(usersString);

      this.$toast.add({
        severity: 'success',
        summary: 'Success',
        detail: this.selectedUsers.length + " Users Copied to Clipboard",
        life: 3000});

    },

    //Selection Events
    onRowSelect(){
      console.log("Selected a Row");
      this.isUserSelected = true;
    },
    onRowUnselect(){
      console.log("Unselected a Row");
      if(this.selectedUsers.length === 0){
        this.isUserSelected = false;
      }
    },
    onRowSelectAll(){
      console.log("Selected all Rows");
      this.isUserSelected = true;
    },
    onRowUnselectAll(){
      console.log("Unselected all Rows");
      this.isUserSelected = false;
    },
    showAddUsers(){

      this.showAddUserDialog = true;

    },
    hideAddUsers(){

      this.showAddUserDialog = false;

    }
  },
  beforeMount() {
    //console.log(this.backendID)
    this.backend = this.getUserBackend(this.getSignedInUserId)[this.backendID];
    this.updateTableData();
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

::v-deep(.p-dropdown){

  border-bottom-left-radius: 0;
  border-top-left-radius: 0;
  width: 8em;


}

::v-deep(td){
  overflow: hidden;
}



</style>