<template>
    <div class="backend-info-card">
        <Toast position="top-right"/>
        <div class="backend-info-sum">
            <div class="minimised-backend-info" >
                <div style="cursor: pointer" @click="change">
                    <em v-if="receive.connected"  :style="connectedStyle" class="pi pi-circle-on" />
                    <em v-if="!receive.connected" class="pi pi-circle-off" />
                    <span> {{local.name}} </span>
                    <span v-if="receive.admin" style="float: right; padding-top: 3px">ADMIN</span>
                </div>
                <div>
                    <InputSwitch id="inputswitch" style="float: right; margin-top: 3px"  v-model="local.active"/>
                </div>
            </div>
                <div class="expanded-backend-info" v-if="expand">
                <div><em>Email: </em></div>
                <div> {{ connect.associatedEmail }} </div>
                <div><em>Link: </em></div>
                <div> {{connect.link}} </div>
                <div><em>Pass Key: </em></div>
                <div> {{connect.keys.sessionKey}} </div>
                <div></div>
                <div>
                    <Button @click="editBackend" style="float: right" class="p-button p-button-outlined">Edit </Button>
                    <Button @click="deleteBackend" style="float: right" class="p-button p-button-outlined">Delete </Button>
                </div>
            </div>
            <form @submit="saveChanges" class="edit-backend-info expanded-backend-info" v-if="editBackendBool">
                <div><em>Name: </em></div>
                <input-text v-model="tempBackendInfo.name"/>
                <div><em>Email: </em></div>
                <input-text v-model="tempBackendInfo.associatedEmail"/>
                <div><em>Link: </em></div>
                <input-text v-model="tempBackendInfo.link"/>
                <div><em>Session Key: </em></div>
                <input-text v-model="tempBackendInfo.sessionKey"/>
                <div></div>
                <div>
                    <Button @click="editPermissions" style="float: left" class="p-button p-button-outlined" v-if="!newBackend && getUserAdminStatus(local.id)">Permissions</Button>
                    <Button type="submit" style="float: right" class="p-button p-button-outlined">Connect</Button>
                    <Button @click="cancelChanges" style="float: right" class="p-button p-button-outlined">Cancel</Button>
                </div>
            </form>
        </div>
    </div>
</template>

<script>
    import InputSwitch from 'primevue/inputswitch';
    import {mapGetters} from 'vuex';
    export default {
        name: "backendCard",
        components: {
          InputSwitch
        },
        data () {
            return {
                tempNameNo: 0,
                checked: false,
                editBackendBool: false,
                expand: false,
                newBackendT: null,
                tempBackendInfo: {
                    id: null,
                    name: '',
                    active: false,

                    link: '',
                    passKey: '',
                    associatedEmail: '',

                    admin: null
                }
            }
        },
        computed: {
            ...mapGetters([
                'getSignedInUserId',
                'getUserAdminStatus'
            ]),
            connectedStyle () {
                return 'color: ' + this.local.color;
            }
        },
        props: {
          userIndex: {
              type: Number,
              default: null
          },
          backendIndex: {
              type: Number,
              default: null
          },
          newBackend: {
              type: Boolean,
              default: false
          },

          local: {
              id: Number,
              name: String,
              active: Boolean,
              color: String
          },
          connect: {
              associatedEmail: String,
              link: String,
              passKey: String
          },
          receive: {
              admin: Boolean,
              connected: Boolean
          }
        },
        mounted() {
            this.setTempVars();

            if (this.newBackend) {
                this.editBackendBool = true;
                this.expand = false;
            }
        },

        methods: {

            //View changes
            change() {
              if (!this.newBackend) {
                  this.expand = !this.expand;
                  if (this.editBackendBool) {
                      this.editBackendBool = false;
                      this.expand = false;
                  }
              }
            },
            editBackend() {
                this.setTempVars();
                this.expand = !this.expand;
                this.editBackendBool = !this.editBackendBool;
            },
            saveChanges() {
                this.expand = true;
                this.editBackendBool = false;

                //Operations changing store
                if(this.newBackend) {

                    this.$store.commit("addBackend", {
                        userIndex: this.userIndex,
                        name: this.tempBackendInfo.name,
                        link: this.tempBackendInfo.link,
                        passKey: this.tempBackendInfo.passKey,
                        associatedEmail: this.tempBackendInfo.associatedEmail,
                        active: this.tempBackendInfo.active,
                    });

                    this.$emit('saveNewBackend');
                }
                else {
                    console.log("Saving to store - email: " + this.tempBackendInfo.associatedEmail);
                    this.$store.commit("editBackend", {
                        userIndex: this.userIndex,
                        backendIndex: this.backendIndex,
                        name: this.tempBackendInfo.name,
                        link: this.tempBackendInfo.link,
                        passKey: this.tempBackendInfo.passKey,
                        associatedEmail: this.tempBackendInfo.associatedEmail,
                        admin: this.tempBackendInfo.admin,
                        active: this.tempBackendInfo.active
                    });
                }
                this.setTempVars();
            },
            cancelChanges() {
                this.expand = true;
                this.editBackendBool = false;
                if (this.newBackend) {
                    this.$emit('saveNewBackend');
                }
            },

            //Operations changing store
            deleteBackend() {
                this.expand = false;
                this.editBackendBool = false;
                this.$store.commit("deleteBackend", this.backendIndex);
                this.setTempVars();
                // Still need "are you sure you want to delete this backend?" warning
            },

            editPermissions() {
                console.log("To be implemented");
            },

            connectToBackend() {
                //Api call to make sure that connection information is valid, then it will call the connect api.
                //If valid, a backend is added to the user's array of backends, and it returns the Backend's name and if you are an admin or not. (?)


                //For now, we will just create a random new backend name and random edit status. (Should you be able to give your own personal backend name?)
                // this.newBackend = false;
                // this.tempBackendInfo.name = "Temp Backend no: " + this.tempNameNo;
                this.tempBackendInfo.admin = true;
                this.saveChanges();
                this.tempNameNo = this.tempNameNo + 1;



            },
            //Initialize component state
            setTempVars() {
                if (!this.newBackend) {
                    this.tempBackendInfo.name = this.local.name;
                }
                this.tempBackendInfo.id = this.local.id;
                this.tempBackendInfo.active = this.local.active;

                this.tempBackendInfo.associatedEmail = this.connect.associatedEmail;
                this.tempBackendInfo.link = this.connect.link;
                this.tempBackendInfo.sessionKey = this.connect.keys.sessionKey;

               this.tempBackendInfo.admin = this.receive.admin;
               this.newBackendT = this.newBackend;
            }
        }
    }
</script>

<style scoped>

    .backend-info-card {
        margin-top: 5px;
        padding: 5px;
        border: solid 1px #363636;
        border-radius: 5px;
        max-width: 600px;
    }

    .expanded-backend-info {
        border-radius: 5px;
        margin-top: 4px;
        padding-top: 4px;
        padding-left: 4px;
        padding-bottom: 4px;
        display: grid;
        grid-template-columns: 1fr 3fr;
        grid-template-rows: 1fr 1fr 1fr 1fr;
        row-gap: 4px;
    }

    .expanded-backend-info div {
        max-height: 45px;
    }

    .pi-circle-on, .pi-circle-off {
        padding-top: 2px;
        padding-left: 2px;
        padding-bottom: 2px;
    }


    input {
        margin-right: 2%;
    }

    Button {
        float: right;
        max-height: 30px;
        text-align: center;
        margin-right: 2%;
        margin-bottom: 2%;
        margin-top: 1%;
        max-width: fit-content;
    }

    span {
        padding-left: 15px;
    }

    .minimised-backend-info {
        height: 30px;
        padding-top: 4px;
        padding-left: 4px;
        background-color: rgba(189, 189, 189, 0.05);
        display: grid;
        grid-template-columns: 3fr 1fr;
    }



</style>