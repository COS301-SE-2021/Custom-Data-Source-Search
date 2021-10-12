<template>
  <ConfirmDialog/>
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
        <DataTable class="p-datatable table"
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
          <Column selectionMode="multiple" headerStyle="min-width: 3em" style="max-width: 3em;"></Column>
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
          <Button @click="logoutUsersConfirmation"
                  label="Logout"
                  icon="pi pi-lock"
                  class="p-button-warning p-button-custom-med"
          />
          <Button @click="revokeUserKeysConfirmation"
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
                  v-tooltip="'Add user'"
          />
          <Button :disabled="!isUserSelected"
                  @click="deleteUsers"
                  icon="pi pi-user-minus"
                  class="p-button-danger p-mr-2
                  p-button-custom-med"
                  v-tooltip="'Remove user'"
          />
        </span>
          <i class="pi pi-pause p-toolbar-separator p-mr-2" aria-hidden="true"/>
          <Button :disabled="!isUserSelected"
                  @click="changeUserRoles"
                  icon="pi pi-sort"
                  class="p-button-info p-mr-2 permissions-button p-button-custom-med"
                  v-tooltip="'Change user role'"
          />
          <Dropdown class="toolbar-dropdown"
                    :disabled="!isUserSelected"
                    v-model="selectedRole"
                    :options="roleOptions"
                    placeholder="Select a Role"
          />
          <i class="pi pi-pause p-toolbar-separator p-mr-2" aria-hidden="true"/>
          <span class="p-buttonset">
          <Button @click="logoutUsersConfirmation"
                  icon="pi pi-lock"
                  class="p-button-warning p-button-custom-med"
                  v-tooltip="'Logout'"
          />
          <Button @click="revokeUserKeysConfirmation"
                  icon="pi pi-ban"
                  class="p-button-danger p-button-custom-med"
                  v-tooltip="'Revoke keys'"
          />
        </span>
          <i class="pi pi-pause p-toolbar-separator p-mr-2" aria-hidden="true"/>
          <Button @click="generateSelectedUserRegistrationKeys"
                  :disabled="!isUserSelected"
                  icon="pi pi-key"
                  class="p-button-info p-button-custom-med"
                  v-tooltip="'Generate keys'"
          />
          <i class="pi pi-pause p-toolbar-separator p-mr-2" aria-hidden="true"/>
          <SplitButton :disabled="!isUserSelected"
                       :model="copyOptions"
                       @click="mailUsers"
                       icon="pi pi-inbox"
                       class="p-button-info p-button-custom-med"
                       v-tooltip="'Email key'"
          />
        </template>
      </Toolbar>

      <!-- Intermittently Available Elements -->
      <Dialog
          header="Add User"
          v-model:visible="displayAddUsersDialog"
          :style="{width: '35em'}"
          :position="addUserPos"
          :modal="true"
          dismissable-mask=true
      >
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
      link: String
    },

    watch: {
      state(newState){
        this.updateTableData();
      }
    },

    data() {
      return {
        usersLink: null,
        registrationKeyLink: null,
        emailLink: null,

        backend: null,
        tableData: [],
        isUserSelected: false,
        selectedUsers: null,
        selectedRole: null,

        addUserPos: "bottomleft",
        displayAddUsersDialog: false,

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
      ]),
      state(){
        return this.$store.getters.getRefreshState;
      }
    },

    beforeMount() {
      if (this.backendID) {
        this.backend = this.getUserBackends(this.getSignedInUserId)[this.backendID];
        this.updateTableData();
      } else {
        this.$router.push('Admin');
      }
    },

    methods: {
      updateTableData() {
        const headers = {
          "Authorization": "Bearer " + this.$store.getters.getBackendJWTToken(this.backendID)
        };
        axios
            .get(`http://${this.$store.getters.getBackendLink(this.backendID)}/users`, {headers})
            .then((resp) => {
              this.tableData = resp.data.data;
              let i = 0;
              for (i; i < this.tableData.length; i++) {
                this.tableData[i].role = this.tableData[i].role.charAt(0).toUpperCase() + this.tableData[i].role.slice(1);
                this.tableData[i].reg_status = this.tableData[i].reg_status.charAt(0).toUpperCase() + this.tableData[i].reg_status.slice(1);
              }
            })
            .catch(async () => {
              await this.$store.dispatch("refreshJWTToken", {id: this.backendID});
              const headers = {
                "Authorization": "Bearer " + this.$store.getters.getBackendJWTToken(this.backendID)
              };
              await axios
                  .get(`http://${this.$store.getters.getBackendLink(this.backendID)}/users`, {headers})
                  .then((resp) => {
                    this.tableData = resp.data.data;
                    let i = 0;
                    for (i; i < this.tableData.length; i++) {
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
            })
      },
      addUsers() {
        const headers = {
          "Authorization": "Bearer " + this.$store.getters.getBackendJWTToken(this.backendID),
          "Content-Type": "application/json"
        };
        let reqUser = {
          first_name: this.addUserFirstName,
          last_name: this.addUserLastName,
          email: this.addUserEmail,
          role: this.addUserRole.toLowerCase()
        };

        this.addUserFirstName = '';
        this.addUserLastName = '';
        this.addUserEmail = '';
        this.addUserRole = '';
        this.displayAddUsersDialog = false;

        let reqObj = {users: [reqUser]};
        let reqBody = JSON.stringify(reqObj);

        axios
            .post(`http://${this.$store.getters.getBackendLink(this.backendID)}/users`, reqBody,
                {headers})
            .then((resp) => {
              this.$toast.add({
                severity: 'success',
                summary: 'Success',
                detail: "Added Users",
                life: 3000
              });
              this.updateTableData();
            })
            .catch(async () => {
              await this.$store.dispatch("refreshJWTToken", {id: this.backendID});
              const headers = {
                "Authorization": "Bearer " + this.$store.getters.getBackendJWTToken(this.backendID),
                "Content-Type": "application/json"
              };
              await axios
                .post(`http://${this.$store.getters.getBackendLink(this.backendID)}/users`, reqBody,
                    {headers}
                )
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
            })
      },
      deleteUsers() {
        const headers = {
          "Authorization": "Bearer " + this.$store.getters.getBackendJWTToken(this.backendID),
          "Content-Type": "application/json"
        };
        let usersArr = this.selectedUsers.map(function (a) {
          return {uuid: a.uuid};
        });
        let reqObj = {users: usersArr};
        let reqBody = JSON.stringify(reqObj);

        axios
            .delete(`http://${this.$store.getters.getBackendLink(this.backendID)}/users`,
                {data: reqBody, headers: headers})
            .then((resp) => {
              this.$toast.add({
                severity: 'success',
                summary: 'Success',
                detail: "Deleted Users",
                life: 3000
              });
              this.updateTableData();
            })
            .catch(async () => {
              await this.$store.dispatch("refreshJWTToken", {id: this.backendID});
              const headers = {
                "Authorization": "Bearer " + this.$store.getters.getBackendJWTToken(this.backendID),
                "Content-Type": "application/json"
              };
              await axios
                .delete(`http://${this.$store.getters.getBackendLink(this.backendID)}/users`,
                    {data: reqBody, headers: headers})
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
            })
      },
      changeUserRoles() {
        if (!this.selectedRole) {
          this.$toast.add({
            severity: 'info',
            summary: "No Role Selected",
            detail: "Please select a role to assign to the selected user(s)",
            life: 3000
          });
          return;
        }
        let usersArr = this.selectedUsers.map(function (a) {
          return {uuid: a.uuid};
        });
        let reqObj = {
          role: this.selectedRole.toLowerCase(),
          users: usersArr
        };
        let reqBody = JSON.stringify(reqObj);
        console.log(this.$store.getters.getUserAdminStatus(this.backendID))
        const headers = {
          "Authorization": "Bearer " + this.$store.getters.getBackendJWTToken(this.backendID),
          "Content-Type": "application/json"
        };
        axios
            .post(`http://${this.$store.getters.getBackendLink(this.backendID)}/users/role`, reqBody,
                {headers: headers})
            .then((resp) => {
              this.$toast.add({
                severity: 'success',
                summary: 'Success',
                detail: "Updated Roles",
                life: 3000
              });
              this.updateTableData();
            })
            .catch(async () => {
              await this.$store.dispatch("refreshJWTToken", {id: this.backendID});
              const headers = {
                "Authorization": "Bearer " + this.$store.getters.getBackendJWTToken(this.backendID),
                "Content-Type": "application/json"
              };
              await axios
                  .post(`http://${this.$store.getters.getBackendLink(this.backendID)}/users/role`, reqBody,
                      {headers: headers})
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
            })
      },
      generateSelectedUserRegistrationKeys() {
        let usersArr = this.selectedUsers.map(function (a) {
          return {uuid: a.uuid};
        });
        let reqObj = {users: usersArr};
        let reqBody = JSON.stringify(reqObj);
        const headers = {
          "Authorization": "Bearer " + this.$store.getters.getBackendJWTToken(this.backendID),
          "Content-Type": "application/json"
        };
        axios
            .post(`http://${this.$store.getters.getBackendLink(this.backendID)}/users/registrationkey`, reqBody,
                {headers: headers})
            .then((resp) => {
              this.$toast.add({
                severity: 'success',
                summary: 'Success',
                detail: "Generated Registration Keys",
                life: 3000
              });
              console.log(resp.data);
              this.updateTableData();
            })
            .catch(async () => {
              await this.$store.dispatch("refreshJWTToken", {id: this.backendID});
              const headers = {
                "Authorization": "Bearer " + this.$store.getters.getBackendJWTToken(this.backendID),
                "Content-Type": "application/json"
              };
              await axios
                  .post(`http://${this.$store.getters.getBackendLink(this.backendID)}/users/registrationkey`, reqBody,
                      {headers: headers})
                  .then((resp) => {
                    this.$toast.add({
                      severity: 'success',
                      summary: 'Success',
                      detail: "Generated Registration Keys",
                      life: 3000
                    });
                    console.log(resp.data);
                    this.updateTableData();
                  })
                  .catch((error) =>{
                    this.$toast.add({
                      severity: 'error',
                      summary: 'Error',
                      detail: error.response.data.message,
                      life: 3000
                    });
                    console.log(error);
                  })
        })

      },
      mailUsers() {
        let usersArr = this.selectedUsers.map(function (a) {
          return {uuid: a.uuid};
        });
        let reqObj = {users: usersArr};
        let reqBody = JSON.stringify(reqObj);
        const headers = {
          "Authorization": "Bearer " + this.$store.getters.getBackendJWTToken(this.backendID),
          "Content-Type": "application/json"
        };
        axios
            .post(`http://${this.$store.getters.getBackendLink(this.backendID)}/users/email`, reqBody,
                {headers: headers})
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
            .catch(async () => {
              await this.$store.dispatch("refreshJWTToken", {id: this.backendID});
              const headers = {
                "Authorization": "Bearer " + this.$store.getters.getBackendJWTToken(this.backendID),
                "Content-Type": "application/json"
              };
              await axios
                  .post(`http://${this.$store.getters.getBackendLink(this.backendID)}/users/email`, reqBody,
                      {headers: headers})
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
            })
      },
      /*
      Selection Event Handlers
      ================
      */
      onRowSelect() {
        this.isUserSelected = true;
      },
      onRowUnselect() {
        if (this.selectedUsers.length === 0) {
          this.isUserSelected = false;
        }
      },
      onRowSelectAll() {
        this.isUserSelected = true;
      },
      onRowUnselectAll() {
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
      closeRevokeConfirmation() {
        this.displayRevokeConfirmation = false;
      },
      logoutUsersConfirmation() {
        if (this.selectedUsers === null || this.selectedUsers.length === 0) {
          this.$confirm.require({
            message: "Are you sure you want to log all users out?",
            header: 'Confirmation',
            icon: 'pi pi-exclamation-triangle',
            acceptClass: "p-button-danger",
            rejectClass: "p-button-text p-button-plain",
            accept: () => {
              const headers = {
                "Authorization": "Bearer " + this.$store.getters.getBackendJWTToken(this.backendID)
              };
              axios
                  .post(`http://${this.$store.getters.getBackendLink(this.backendID)}/users/global/logout`, headers)
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
                  .catch(async () => {
                    await this.$store.dispatch("refreshJWTToken", {id: this.backendID});
                    const headers = {
                      "Authorization": "Bearer " + this.$store.getters.getBackendJWTToken(this.backendID)
                    };
                    await axios
                        .post(`http://${this.$store.getters.getBackendLink(this.backendID)}/users/global/logout`, authHeaders)
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
                  })
            }
          })
        } else {
          this.$confirm.require({
            message: "Are you sure you want to log the selected users out?\n",
            header: 'Confirmation',
            icon: 'pi pi-exclamation-triangle',
            acceptClass: "p-button-danger",
            rejectClass: "p-button-text p-button-plain",
            accept: () => {
              let usersArr = this.selectedUsers.map(function (a) {
                return {uuid: a.uuid};
              });
              let reqObj = {users: usersArr};
              let reqBody = JSON.stringify(reqObj);
              const headers = {
                "Authorization": "Bearer " + this.$store.getters.getBackendJWTToken(this.backendID),
                "Content-Type": "application/json"
              };
              axios
                  .post(`http://${this.$store.getters.getBackendLink(this.backendID)}/users/logout`, reqBody,
                      {headers: headers})
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
                  .catch(async () => {
                    await this.$store.dispatch("refreshJWTToken", {id: this.backendID});
                    const headers = {
                      "Authorization": "Bearer " + this.$store.getters.getBackendJWTToken(this.backendID)
                    };
                    await axios
                        .post(`http://${this.$store.getters.getBackendLink(this.backendID)}/users/logout`, reqBody,
                            {headers: headers})
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
                  })
            }
          })
        }
      },
      revokeUserKeysConfirmation() {
        if (this.selectedUsers === null || this.selectedUsers.length === 0) {
          this.$confirm.require({
            message: "Are you sure you want to revoke all user keys?",
            header: 'Confirmation',
            icon: 'pi pi-exclamation-triangle',
            acceptClass: "p-button-danger",
            rejectClass: "p-button-text p-button-plain",
            accept: () => {
              const headers = {
                "Authorization": "Bearer " + this.$store.getters.getBackendJWTToken(this.backendID)
              };
              axios
                  .post(`http://${this.$store.getters.getBackendLink(this.backendID)}/users/global/revoke`, {}, {headers: {headers}})
                  .then(resp => {
                    this.$toast.add({
                      severity: 'success',
                      summary: 'Success',
                      detail: "Revoked All User Keys",
                      life: 3000
                    });
                    this.updateTableData();
                  })
                  .catch(async () => {
                    await this.$store.dispatch("refreshJWTToken", {id: this.backendID});
                    const headers = {
                      "Authorization": "Bearer " + this.$store.getters.getBackendJWTToken(this.backendID)
                    };
                    await axios
                        .post(`http://${this.$store.getters.getBackendLink(this.backendID)}/users/global/revoke`, {}, {headers: {headers}})
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
                  })
            }
          })
        } else {
          this.$confirm.require({
            message: "Are you sure you want to revoke the selected user's keys?",
            header: 'Confirmation',
            icon: 'pi pi-exclamation-triangle',
            acceptClass: "p-button-danger",
            rejectClass: "p-button-text p-button-plain",
            accept: () => {
              let usersArr = this.selectedUsers.map(function (a) {
                return {uuid: a.uuid};
              });
              let reqObj = {users: usersArr};
              let reqBody = JSON.stringify(reqObj);
              const headers = {
                "Authorization": "Bearer " + this.$store.getters.getBackendJWTToken(this.backendID),
                "Content-Type": "application/json"
              };
              axios
                  .post(`http://${this.$store.getters.getBackendLink(this.backendID)}/users/revoke`, reqBody,
                      {headers})
                  .then(resp => {
                    this.$toast.add({
                      severity: 'success',
                      summary: 'Success',
                      detail: "Revoked User Keys",
                      life: 3000
                    });
                    this.updateTableData();
                  })
                  .catch(async () => {
                    await this.$store.dispatch("refreshJWTToken", {id: this.backendID});
                    const headers = {
                      "Authorization": "Bearer " + this.$store.getters.getBackendJWTToken(this.backendID),
                      "Content-Type": "application/json"
                    };
                    await axios
                        .post(`http://${this.$store.getters.getBackendLink(this.backendID)}/users/revoke`, reqBody,
                            {headers})
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
                  })
            }
          })
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

  .backend-toolbar-small {
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

  ::v-deep(.p-dropdown) {
    height: 2.295rem;
    border-bottom-left-radius: 0;
    border-top-left-radius: 0;
  }

  ::v-deep(.p-dropdown-label) {
    padding: 6px;
  }

  ::v-deep(td) {
    word-break: break-word;
  }

  .p-selection-column {
    margin-right: 0;
  }

  .management-page-header {
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

  #input-perm{
    border-bottom-left-radius: 4px;
    border-top-left-radius: 4px;
  }

  @media only screen and (max-width: 1366px) {
    .backend-toolbar {
      display: none;
    }

    .backend-toolbar-small {
      display: block;
    }
  }

  @media only screen and (max-height: 768px) {
    .management-page-description {
      display: none;
    }

    .management-page-header {
      margin: 0;
    }
  }
</style>