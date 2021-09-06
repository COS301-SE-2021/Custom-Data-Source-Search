<template>
  <div class="management-page">
    <div class="management-page-header">
      <h1 class="backend-name">{{backend.local.name}}</h1>
      <p class="management-page-description">
        Manage users of this backend
      </p>
    </div>
    <ScrollPanel
        id="main-scroll"
        style="width: 95vw; height: 80vh; bottom: 4em; padding-bottom: 1vh; align-content: center; padding-right: 1em;"
    >
    <div class="admin-table-container">
      <DataTable class="p-datatable-sm table"
                 @rowSelect="onRowSelect"
                 @rowUnselect="onRowUnselect"
                 @rowSelectAll="onRowSelectAll"
                 @rowUnselectAll="onRowUnselectAll"
                 v-model:selection="selectedUsers"
                 v-model:filters="filters"
                 :rowHover="true"
                 :value="tableData"
                 :scrollable="true"
                 scrollHeight="70vh"
                 filterDisplay="row"
                 responsiveLayout="scroll"
      >
        <template #empty>
          No users found.
        </template>
        <template #loading>
          Loading user data. Please wait...
        </template>
        <Column selectionMode="multiple" headerStyle="min-width: 2.3em" style="max-width: 3em;"></Column>
        <Column filterField="first_name" :showFilterMenu="false" header="Name" style="min-width:12rem">
          <template #body="{data}">
            {{data.first_name}}
          </template>
          <template #filter="{filterModel,filterCallback}">
            <InputText
                type="text"
                v-model="filterModel.value"
                @input="filterCallback()"
                class="p-column-filter"
                :placeholder="`Search by name`"
            />
          </template>
        </Column>
        <Column filterField="last_name" :showFilterMenu="false" header="Surname" style="min-width:12rem">
          <template #body="{data}">
            {{data.last_name}}
          </template>
          <template #filter="{filterModel,filterCallback}">
            <InputText
                type="text"
                v-model="filterModel.value"
                @input="filterCallback()"
                class="p-column-filter"
                :placeholder="`Search by surname`"
            />
          </template>
        </Column>
        <Column filterField="email" :showFilterMenu="false" header="Email" style="min-width:12rem">
          <template #body="{data}">
            {{data.email}}
          </template>
          <template #filter="{filterModel,filterCallback}">
            <InputText
                type="text"
                v-model="filterModel.value"
                @input="filterCallback()"
                class="p-column-filter"
                :placeholder="`Search by email`"
            />
          </template>
        </Column>
        <Column filterField="role" :showFilterMenu="false" header="Role" style="min-width:12rem">
          <template #body="{data}">
            {{data.role}}
          </template>
          <template #filter="{filterModel,filterCallback}">
            <MultiSelect
                v-model="filterModel.value"
                :options="roleOptions"
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
        <Column filterField="reg_status" :showFilterMenu="false" header="Registration Status" style="min-width:12rem">
          <template #body="{data}">
            {{data.reg_status}}
          </template>
          <template #filter="{filterModel,filterCallback}">
            <MultiSelect
                v-model="filterModel.value"
                :options="registrationStatus"
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
        <Column filterField="logged_in" :showFilterMenu="false" header="Logged In" style="min-width:12rem">
          <template #body="{data}">
            {{data.logged_in}}
          </template>
          <template #filter="{filterModel,filterCallback}">
            <MultiSelect
                v-model="filterModel.value"
                :options="loggedIn"
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
        <Column filterField="reg_key" :showFilterMenu="false" header="Registration Key" style="min-width:12rem">
          <template #body="{data}">
            {{data.reg_key}}
          </template>
          <template #filter="{filterModel,filterCallback}">
            <InputText
                type="text"
                v-model="filterModel.value"
                @input="filterCallback()"
                class="p-column-filter"
                :placeholder="`Search by registration key`"
            />
          </template>
        </Column>
      </DataTable>
    </div>
    </ScrollPanel>
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
          <i class="pi pi-pause p-toolbar-separator p-mr-2" aria-hidden="true"/>
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
          <i class="pi pi-pause p-toolbar-separator p-mr-2" aria-hidden="true"/>
          <span class="p-buttonset">
          <Button @click="showLogoutUsersDialog"
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
          <i class="pi pi-pause p-toolbar-separator p-mr-2" aria-hidden="true"/>
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
      <Toolbar class="backend-toolbar-small">
        <template #left>
        <span class="p-buttonset">
          <Button @click="showAddUsersDialog"
                  icon="pi pi-user-plus"
                  class="p-button p-button-success p-mr-2 p-button-custom-med"
          />
          <Button :disabled="!isUserSelected"
                  @click="deleteUsers"
                  icon="pi pi-user-minus"
                  class="p-button-danger p-mr-2
                  p-button-custom-med"
          />
        </span>
          <i class="pi pi-pause p-toolbar-separator p-mr-2" aria-hidden="true"/>
          <Button :disabled="!isUserSelected"
                  @click="changeUserRoles"
                  icon="pi pi-sort"
                  class="p-button-info p-mr-2 permissions-button p-button-custom-med"
          />
          <Dropdown class="toolbar-dropdown"
                    :disabled="!isUserSelected"
                    v-model="selectedRole"
                    :options="roleOptions"
                    placeholder="Select a Role"
          />
          <i class="pi pi-pause p-toolbar-separator p-mr-2" aria-hidden="true"/>
          <span class="p-buttonset">
          <Button @click="showLogoutUsersDialog"
                  icon="pi pi-lock"
                  class="p-button-warning p-button-custom-med"
          />
          <Button @click="showRevokeUserKeysDialog"
                  icon="pi pi-ban"
                  class="p-button-danger p-button-custom-med"
          />
        </span>
          <i class="pi pi-pause p-toolbar-separator p-mr-2" aria-hidden="true"/>
          <Button @click="generateSelectedUserRegistrationKeys"
                  :disabled="!isUserSelected"
                  icon="pi pi-key"
                  class="p-button-info p-button-custom-med"
          />
          <i class="pi pi-pause p-toolbar-separator p-mr-2" aria-hidden="true"/>
          <SplitButton :disabled="!isUserSelected"
                       :model="copyOptions"
                       @click="mailUsers"
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
            <div class="p-field p-col-12 p-md-4">
            <span class="p-float-label">
              <InputText id="input-firstname" type="text" v-model="addUserFirstName"/>
              <label for="input-firstname">First Name</label>
            </span>
            </div>
            <div class="p-field p-col-12 p-md-4" style="margin-left: 2em">
            <span class="p-float-label">
              <InputText id="input-lastname" type="text" v-model="addUserLastName"/>
              <label for="input-lastname">Last Name</label>
            </span>
            </div>
          </div>
          <div class="p-field p-grid" style="margin-top: 0.8em; margin-left:0.8em">
            <div class="p-field p-col-12 p-md-4">
            <span class="p-float-label">
              <InputText id="input-email" type="text" v-model="addUserEmail"/>
              <label for="input-email">Email</label>
            </span>
            </div>
          </div>
          <div class="p-field p-grid" style="margin-top: 0.8em; margin-left:0.8em">
            <div class="p-field p-col-12 p-md-4">
            <span class="p-float-label">
              <Dropdown id="input-perm" v-model="addUserRole" :options="roleOptions"/>
              <label for="input-perm">Role</label>
            </span>
            </div>
          </div>
        </div>
        <template #footer>
          <Button label="Cancel" icon="pi pi-times" @click="hideAddUsersDialog" class="p-button-text"/>
          <Button label="Add" icon="pi pi-check" @click="addUsers" autofocus/>
        </template>
      </Dialog>
      <Dialog header="Confirmation"
              v-model:visible="displayGlobalLogoutConfirmation"
              :style="{width: '32em'}"
              :modal="true">
        <div class="confirmation-content">
          <i class="pi pi-exclamation-triangle p-mr-3" style="font-size: 2rem"/>
          <span style="margin-left: 0.8em;"> Are you sure you want to log all users out?</span>
        </div>
        <template #footer>
          <Button label="No" icon="pi pi-times" @click="closeGlobalLogoutConfirmation" class="p-button-text"/>
          <Button label="Yes" icon="pi pi-check" @click="logOutUsersGlobally()" class="p-button-text" autofocus/>
        </template>
      </Dialog>
      <Dialog header="Confirmation" v-model:visible="displayLogoutConfirmation" :style="{width: '32em'}" :modal="true">
        <div class="confirmation-content">
          <i class="pi pi-exclamation-triangle p-mr-3" style="font-size: 2rem"/>
          <span style="margin-left: 0.8em;">Are you sure you want to log the selected users out?</span>
        </div>
        <template #footer>
          <Button label="No" icon="pi pi-times" @click="closeLogoutConfirmation" class="p-button-text"/>
          <Button label="Yes" icon="pi pi-check" @click="logOutSelectedUsers()" class="p-button-text" autofocus/>
        </template>
      </Dialog>
      <Dialog header="Confirmation"
              v-model:visible="displayGlobalRevokeConfirmation"
              :style="{width: '32em'}"
              :modal="true">
        <div class="confirmation-content">
          <i class="pi pi-exclamation-triangle p-mr-3" style="font-size: 2rem"/>
          <span style="margin-left: 0.8em;"> Are you sure you want to revoke all user keys?</span>
        </div>
        <template #footer>
          <Button label="No" icon="pi pi-times" @click="closeGlobalRevokeConfirmation" class="p-button-text"/>
          <Button label="Yes" icon="pi pi-check" @click="revokeKeysGlobally()" class="p-button-text" autofocus/>
        </template>
      </Dialog>
      <Dialog header="Confirmation" v-model:visible="displayRevokeConfirmation" :style="{width: '32em'}" :modal="true">
        <div class="confirmation-content">
          <i class="pi pi-exclamation-triangle p-mr-3" style="font-size: 2rem"/>
          <span style="margin-left: 0.8em;">Are you sure you want to revoke the selected user's keys?</span>
        </div>
        <template #footer>
          <Button label="No" icon="pi pi-times" @click="closeRevokeConfirmation" class="p-button-text"/>
          <Button label="Yes" icon="pi pi-check" @click="revokeSelectedUserKeys()" class="p-button-text" autofocus/>
        </template>
      </Dialog>
    </div>
    <Toast position="bottom-right"/>
  </div>
</template>

<script>
    import {mapGetters} from "vuex";
    import {FilterMatchMode} from 'primevue/api';
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

                filters: {
                  'global': {value: null, matchMode: FilterMatchMode.CONTAINS},
                  'first_name': {value: null, matchMode: FilterMatchMode.STARTS_WITH},
                  'last_name': {value: null, matchMode: FilterMatchMode.STARTS_WITH},
                  'email': {value: null, matchMode: FilterMatchMode.STARTS_WITH},
                  'role': {value: null, matchMode: FilterMatchMode.EQUALS},
                  'reg_status': {value: null, matchMode: FilterMatchMode.EQUALS},
                  'logged_in': {value: null, matchMode: FilterMatchMode.EQUALS},
                  'reg_key': {value: null, matchMode: FilterMatchMode.STARTS_WITH}
                },
                loggedIn: ['true', 'false'],
                registrationStatus: [
                    'Unregistered', 'Registered'
                ]
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
                      console.log(resp.data.data);
                      this.tableData = resp.data.data;
                      let i=0;
                      for(i; i<this.tableData.length; i++){
                        this.tableData[i].role = this.tableData[i].role.charAt(0).toUpperCase() + this.tableData[i].role.slice(1);
                        this.tableData[i].reg_status = this.tableData[i].reg_status.charAt(0).toUpperCase() + this.tableData[i].reg_status.slice(1);
                      }
                    })
                    .catch((error) => {
                        this.$toast.add({
                            severity: 'error',
                            summary: 'Error',
                            detail: error.response.data.message,
                            life: 3000
                        });
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
                        });
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
                        });
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
                };
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
                        });
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
                        });
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
                        });
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
                        });
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
                        });
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
                    });
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
                        });
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
  height: 100vh;
  padding-left: 1%;
  display: grid;
  grid-template-rows: 1fr 10fr;
  grid-template-columns: 1fr;
}

.backend-name {
  text-align: center;
  color: #ededed;
}

.backend-toolbar {
  padding: 0;
}

.backend-toolbar-small{
  display: none;
  padding: 0;
}

.backend-toolbar-container {
  justify-self: center;
  position: sticky;
  bottom: 3vh;
  align-self: center;
  z-index: 5;
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

::v-deep(.p-dropdown){
  height: 36px;
  border-bottom-left-radius: 0;
  border-top-left-radius: 0;
}

::v-deep(.p-dropdown-label){
  padding: 6px;
}

::v-deep(td){
  word-break: break-word;
}

.p-selection-column{
  margin-right: 0;
}

.management-page-header{
  margin-bottom: 20px;
}

.management-page-description {
  text-align: center;
  color: #ededed;
}

.p-multiselect {
  background-color: #242424;
  height: 34px;
}

.p-inputtext {
  background-color: #242424;
}

@media only screen and (max-width: 1366px) {
  .backend-toolbar{
    display: none;
  }

  .backend-toolbar-small{
    display: block;
  }
}

@media only screen and (max-height: 768px) {
  .management-page-description{
    display: none;
  }

  .management-page-header{
    margin: 0;
  }
}
</style>