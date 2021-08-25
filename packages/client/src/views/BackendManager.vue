<template>
  <div class="management-page">
    <h1 class="backend-name">{{backend.local.name}}</h1>
    <div class="admin-table-container">
      <DataTable class="p-datatable-sm table"
                 @rowSelect="onRowSelect"
                 @rowUnselect="onRowUnselect"
                 @rowSelectAll="onRowSelectAll"
                 @rowUnselectAll="onRowUnselectAll"
                 :rowHover="true"
                 :value="tableData"
                 :selection="selectedUsers"
                 :scrollable="true"
                 scrollHeight="70vh"
      >
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
          <Button @click="showAddUsersDialog"
                  label="Add User"
                  icon="pi pi-user-plus"
                  class="p-button p-button-success p-mr-2 p-button-custom-med"
          />
          <Button :disabled="!isUserSelected"
                  @click="deleteUsers"
                  label="Remove User"
                  icon="pi pi-user-minus"
                  class="p-button-danger p-mr-2
                  p-button-custom-med"
          />
        </span>
        <i class="pi pi-pause p-toolbar-separator p-mr-2" aria-hidden="true" />
        <Button :disabled="!isUserSelected"
                @click="changeUserRoles"
                label="Change Roles"
                icon="pi pi-sort"
                class="p-button-info p-mr-2 permissions-button p-button-custom-med"
        />
        <Dropdown class="toolbar-dropdown"
                  :disabled="!isUserSelected"
                  v-model="selectedRole"
                  :options="roleOptions"
                  placeholder="Select a Role"
        />
        <i class="pi pi-pause p-toolbar-separator p-mr-2" aria-hidden="true" />
        <span class="p-buttonset">
          <Button  @click="showLogoutUsersDialog"
                  label="Logout"
                  icon="pi pi-lock"
                  class="p-button-warning p-button-custom-med"
          />
          <Button @click="showRevokeUserKeysDialog"
                  label="Revoke Keys"
                  icon="pi pi-ban"
                  class="p-button-danger p-button-custom-med"
          />
        </span>
        <i class="pi pi-pause p-toolbar-separator p-mr-2" aria-hidden="true" />
        <Button @click="generateSelectedUserRegistrationKeys"
                :disabled="!isUserSelected"
                label="Generate Registration Keys"
                icon="pi pi-key"
                class="p-button-info p-button-custom-med"
        />
        <i class="pi pi-pause p-toolbar-separator p-mr-2" aria-hidden="true"/>
        <SplitButton :disabled="!isUserSelected"
                     :model="copyOptions"
                     @click="mailUsers"
                     label="Email"
                     icon="pi pi-inbox"
                     class="p-button-info p-button-custom-med"
        />
      </template>
    </Toolbar>

      <!-- Intermittently Available Elements -->
      <Dialog header="Add User"
              v-model:visible="displayAddUsersDialog"
              :style="{width: '35em'}"
              :position="addUserPos"
              :modal="true"
              dismissable-mask=true>
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
          <Button label="Cancel" icon="pi pi-times" @click="hideAddUsersDialog" class="p-button-text" />
          <Button label="Add" icon="pi pi-check" @click="addUsers" autofocus />
        </template>
      </Dialog>
      <Dialog header="Confirmation"
              v-model:visible="displayGlobalLogoutConfirmation"
              :style="{width: '32em'}"
              :modal="true">
        <div class="confirmation-content">
          <i class="pi pi-exclamation-triangle p-mr-3" style="font-size: 2rem" />
          <span style="margin-left: 0.8em;"> Are you sure you want to log all users out?</span>
        </div>
        <template #footer>
          <Button label="No" icon="pi pi-times" @click="closeGlobalLogoutConfirmation" class="p-button-text"/>
          <Button label="Yes" icon="pi pi-check" @click="logOutUsersGlobally()" class="p-button-text" autofocus />
        </template>
      </Dialog>
      <Dialog header="Confirmation" v-model:visible="displayLogoutConfirmation" :style="{width: '32em'}" :modal="true">
        <div class="confirmation-content">
          <i class="pi pi-exclamation-triangle p-mr-3" style="font-size: 2rem" />
          <span style="margin-left: 0.8em;">Are you sure you want to log the selected users out?</span>
        </div>
        <template #footer>
          <Button label="No" icon="pi pi-times" @click="closeLogoutConfirmation" class="p-button-text"/>
          <Button label="Yes" icon="pi pi-check" @click="logOutSelectedUsers()" class="p-button-text" autofocus />
        </template>
      </Dialog>
      <Dialog header="Confirmation"
              v-model:visible="displayGlobalRevokeConfirmation"
              :style="{width: '32em'}"
              :modal="true">
        <div class="confirmation-content">
          <i class="pi pi-exclamation-triangle p-mr-3" style="font-size: 2rem" />
          <span style="margin-left: 0.8em;"> Are you sure you want to revoke all user keys?</span>
        </div>
        <template #footer>
          <Button label="No" icon="pi pi-times" @click="closeGlobalRevokeConfirmation" class="p-button-text"/>
          <Button label="Yes" icon="pi pi-check" @click="revokeKeysGlobally()" class="p-button-text" autofocus />
        </template>
      </Dialog>
      <Dialog header="Confirmation" v-model:visible="displayRevokeConfirmation" :style="{width: '32em'}" :modal="true">
        <div class="confirmation-content">
          <i class="pi pi-exclamation-triangle p-mr-3" style="font-size: 2rem" />
          <span style="margin-left: 0.8em;">Are you sure you want to revoke the selected user's keys?</span>
        </div>
        <template #footer>
          <Button label="No" icon="pi pi-times" @click="closeRevokeConfirmation" class="p-button-text"/>
          <Button label="Yes" icon="pi pi-check" @click="revokeSelectedUserKeys()" class="p-button-text" autofocus />
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
  props: {
    backendID: Number,
  },
  data() {
    return {
      backend: null,
      tableData: [],
      isUserSelected: false,
      selectedUsers: null,
      selectedRole: null,

      addUserPos: "bottomleft",
      displayAddUsersDialog: false,
      displayGlobalLogoutConfirmation: false,
      displayLogoutConfirmation: false,
      displayGlobalRevokeConfirmation: false,
      displayRevokeConfirmation: false,

      addUserFirstName: "",
      addUserLastName: "",
      addUserEmail: "",
      addUserRole: "",
      roleOptions: ['Super', 'Admin', 'Editor', 'Viewer'],
      copyOptions: [
        {
          label: 'Copy',
          icon: 'pi pi-copy',
          command: () => {
            let usersString = "";
            for (let userData of this.selectedUsers) {
              usersString += "Backend: " + this.backend.connect.link;
              usersString += ",Email: " + userData.email;
              usersString += ",Name: " + userData.first_name + " " + userData.last_name;
              usersString += ",Registration Key: " + userData.regKey + "\n";
            }
            navigator.clipboard.writeText(usersString);
            this.$toast.add({
              severity: 'success',
              summary: 'Success',
              detail: this.selectedUsers.length + " Users Copied to Clipboard",
              life: 3000
            });
          }
        }],
    }
  },
  computed: {
    ...mapGetters([
      'getUserBackends',
      'getSignedInUserId',
    ])
  },
  beforeMount() {
    this.backend = this.getUserBackends(this.getSignedInUserId)[this.backendID];
    this.updateTableData();
  },
  methods: {
    updateTableData() {
      axios.get("http://localhost:3001/users")
          .then((resp) => {
            this.tableData = resp.data.data;
          })
          .catch((error) => {
            this.$toast.add({
              severity: 'error',
              summary: 'Error',
              detail: error.response.data.message,
              life: 3000
            })
            console.log(error);
          })
    },
    addUsers() {
      let reqUser = {
        first_name: this.addUserFirstName,
        last_name: this.addUserLastName,
        email: this.addUserEmail,
        role: this.addUserRole.toLowerCase()
      };
      let reqObj = {users: [reqUser]};
      let reqBody = JSON.stringify(reqObj);

      axios.post("http://localhost:3001/users", reqBody,
          {headers: {"Content-Type": "application/json"}})
          .then((resp) => {
            this.$toast.add({
              severity: 'success',
              summary: 'Success',
              detail: "Added Users",
              life: 3000
            });
            this.updateTableData();
          })
          .catch((error) => {
            this.$toast.add({
              severity: 'error',
              summary: 'Error',
              detail: error.response.data.message,
              life: 3000
            })
            console.log(error);
          })
    },
    deleteUsers() {
      let usersArr = this.selectedUsers.map(function (a) {
        return {uuid: a.uuid};
      });
      let reqObj = {users: usersArr};
      let reqBody = JSON.stringify(reqObj);

      axios.delete("http://localhost:3001/users",
          {data: reqBody, headers: {"Content-Type": "application/json"}})
          .then((resp) => {
            this.$toast.add({
              severity: 'success',
              summary: 'Success',
              detail: "Deleted Users",
              life: 3000
            });
            this.updateTableData();
          })
          .catch((error) => {
            this.$toast.add({
              severity: 'error',
              summary: 'Error',
              detail: error.response.data.message,
              life: 3000
            })
            console.log(error);
          })
    },
    changeUserRoles() {
      let usersArr = this.selectedUsers.map(function (a) {
        return {uuid: a.uuid};
      });
      let reqObj = {
        role: this.selectedRole.toLowerCase(),
        users: usersArr
      }
      let reqBody = JSON.stringify(reqObj);

      axios.post("http://localhost:3001/users/role", reqBody,
          {headers: {"Content-Type": "application/json"}})
          .then((resp) => {
            this.$toast.add({
              severity: 'success',
              summary: 'Success',
              detail: "Updated Roles",
              life: 3000
            });
            this.updateTableData();
          })
          .catch((error) => {
            this.$toast.add({
              severity: 'error',
              summary: 'Error',
              detail: error.response.data.message,
              life: 3000
            })
            console.log(error);
          })
    },
    revokeKeysGlobally() {
      axios.post("http://localhost:3001/users/global/revoke")
          .then(resp => {
            this.$toast.add({
              severity: 'success',
              summary: 'Success',
              detail: "Revoked All User Keys",
              life: 3000
            });
            this.updateTableData();
          })
          .catch((error) => {
            this.$toast.add({
              severity: 'error',
              summary: 'Error',
              detail: error.response.data.message,
              life: 3000
            })
            console.log(error);
          })
    },
    revokeSelectedUserKeys() {
      let usersArr = this.selectedUsers.map(function (a) {
        return {uuid: a.uuid};
      });
      let reqObj = {users: usersArr};
      let reqBody = JSON.stringify(reqObj);

      axios.post("http://localhost:3001/users/revoke", reqBody,
          {headers: {"Content-Type": "application/json"}})
          .then(resp => {
            this.$toast.add({
              severity: 'success',
              summary: 'Success',
              detail: "Revoked User Keys",
              life: 3000
            });
            this.updateTableData();
          })
          .catch((error) => {
            this.$toast.add({
              severity: 'error',
              summary: 'Error',
              detail: error.response.data.message,
              life: 3000
            })
            console.log(error);
          })
    },
    logOutUsersGlobally() {
      axios.post("http://localhost:3001/users/global/logout")
          .then(resp => {
            this.$toast.add({
              severity: 'success',
              summary: 'Success',
              detail: "Logged All Users Out",
              life: 3000
            });
            console.log(resp.data);
            this.updateTableData();
          })
          .catch((error) => {
            this.$toast.add({
              severity: 'error',
              summary: 'Error',
              detail: error.response.data.message,
              life: 3000
            })
            console.log(error);
          })
    },
    logOutSelectedUsers() {
      let usersArr = this.selectedUsers.map(function (a) {
        return {uuid: a.uuid};
      });
      let reqObj = {users: usersArr};
      let reqBody = JSON.stringify(reqObj);

      axios.post("http://localhost:3001/users/logout", reqBody,
          {headers: {"Content-Type": "application/json"}})
          .then(resp => {
            this.$toast.add({
              severity: 'success',
              summary: 'Success',
              detail: "Logged Users Out",
              life: 3000
            });
            console.log(resp.data);
            this.updateTableData();
          })
          .catch((error) => {
            this.$toast.add({
              severity: 'error',
              summary: 'Error',
              detail: error.response.data.message,
              life: 3000
            })
            console.log(error);
          })
    },
    generateSelectedUserRegistrationKeys() {
      let usersArr = this.selectedUsers.map(function (a) {
        return {uuid: a.uuid};
      });
      let reqObj = {users: usersArr};
      let reqBody = JSON.stringify(reqObj);

      axios.post("http://localhost:3001/users/registrationkey", reqBody,
          {headers: {"Content-Type": "application/json"}})
          .then((resp) => {
            this.$toast.add({
              severity: 'success',
              summary: 'Success',
              detail: "Generated Registration Keys",
              life: 3000
            });

            console.log(resp.data);
            this.updateTableData();

          }).catch((error) => {
        this.$toast.add({
          severity: 'error',
          summary: 'Error',
          detail: error.response.data.message,
          life: 3000
        })
        console.log(error);
      })

    },
    mailUsers() {
      let usersArr = this.selectedUsers.map(function (a) {
        return {uuid: a.uuid};
      });
      let reqObj = {users: usersArr};
      let reqBody = JSON.stringify(reqObj);

      axios.post("http://localhost:3001/users/email", reqBody,
          {headers: {"Content-Type": "application/json"}})
          .then((resp) => {
            this.$toast.add({
              severity: 'success',
              summary: 'Success',
              detail: "Mailed Users",
              life: 3000
            });
            console.log(resp.data);
            this.updateTableData();
          })
          .catch((error) => {
            this.$toast.add({
              severity: 'error',
              summary: 'Error',
              detail: error.response.data.message,
              life: 3000
            })
            console.log(error);
          })
    },
  /*
  Selection Event Handlers
  ================
  */
    onRowSelect() {
      console.log("Selected a Row");
      this.isUserSelected = true;
    },
    onRowUnselect() {
      console.log("Unselected a Row");
      if (this.selectedUsers.length === 0) {
        this.isUserSelected = false;
      }
    },
    onRowSelectAll() {
      console.log("Selected all Rows");
      this.isUserSelected = true;
    },
    onRowUnselectAll() {
      console.log("Unselected all Rows");
      this.isUserSelected = false;
    },
  /*
  Dialog Display Toggles
  ======================
  */
    showAddUsersDialog() {
      this.displayAddUsersDialog = true;
    },
    hideAddUsersDialog() {
      this.displayAddUsersDialog = false;
    },
    closeGlobalLogoutConfirmation() {
      this.displayGlobalLogoutConfirmation = false;
    },
    closeLogoutConfirmation() {
      this.displayLogoutConfirmation = false;
    },
    closeGlobalRevokeConfirmation() {
      this.displayGlobalRevokeConfirmation = false;
    },
    closeRevokeConfirmation() {
      this.displayRevokeConfirmation = false;
    },
    showLogoutUsersDialog() {
      if (this.selectedUsers === null || this.selectedUsers.length === 0) {
        this.displayGlobalLogoutConfirmation = true;
      } else {
        this.displayLogoutConfirmation = true;
      }
    },
    showRevokeUserKeysDialog() {
      if (this.selectedUsers === null || this.selectedUsers.length === 0) {
        this.displayGlobalRevokeConfirmation = true;
      } else {
        this.displayRevokeConfirmation = true;
      }
    }
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

.permissions-button {
  margin-right: 0;
  border-bottom-right-radius: 0;
  border-top-right-radius: 0;
}


.p-button-custom-med {
  padding: 0.54rem 0.74rem;
  font-size: 1rem;
}

::v-deep(.p-button) {
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