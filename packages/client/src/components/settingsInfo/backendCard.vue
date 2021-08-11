<template>
    <div class="backend-info-card">
        <Toast position="top-right"/>
        <div class="backend-info-sum">
            <div class="minimised-backend-info" >
                <div style="cursor: pointer" @click="change">
                    <em v-if="fedInBackend.connected"  :style="connectedStyle" class="pi pi-circle-on" />
                    <em v-if="!fedInBackend.connected" class="pi pi-circle-off" />
                    <span> {{fedInBackend.name}} </span>
                    <span v-if="fedInBackend.admin" style="float: right; padding-top: 3px">ADMIN</span>
                </div>
                <div>
                    <InputSwitch id="inputswitch" style="float: right; margin-top: 3px"  v-model="fedInBackend.active"/>
                </div>
            </div>
                <div class="expanded-backend-info" v-if="expand">
                <div><em>Email: </em></div>
                <div> {{ fedInBackend.associatedEmail }} </div>
                <div><em>Link: </em></div>
                <div> {{fedInBackend.link}} </div>
                <div><em>Pass Key: </em></div>
                <div> {{fedInBackend.passKey}} </div>
                <div></div>
                <div>
                    <Button @click="editBackend" style="float: right" class="p-button p-button-outlined">Edit </Button>
                    <Button @click="deleteBackend" style="float: right" class="p-button p-button-outlined">Delete </Button>
                </div>
            </div>
            <div class="edit-backend-info expanded-backend-info" v-if="editBackendBool">
                <div><em>Name: </em></div>
                <input-text v-model="tempBackendInfo.name"/>
                <div><em>Email: </em></div>
                <input-text v-model="tempBackendInfo.associatedEmail"/>
                <div><em>Link: </em></div>
                <input-text v-model="tempBackendInfo.link"/>
                <div><em>Pass Key: </em></div>
                <input-text v-model="tempBackendInfo.passKey"/>
                <div></div>
                <div>
                    <Button @click="connectToBackend" style="float: right" class="p-button p-button-outlined" v-if="newBackend">Connect </Button>
                    <Button @click="editPermissions" style="float: left" class="p-button p-button-outlined" v-if="!newBackend && getUserAdminStatus(fedInBackend.id)">Permissions </Button>
                    <Button @click="saveChanges" style="float: right" class="p-button p-button-outlined" v-if="!newBackend">Save </Button>
                    <Button @click="cancelChanges" style="float: right" class="p-button p-button-outlined">Cancel </Button>
                </div>
            </div>
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
                'getUserBackend',
                'getSignedInUserId',
                'getUserAdminStatus'
            ]),
            connectedStyle () {
                return 'color: ' + this.fedInBackend.color;
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
          fedInBackend: {
              name: String,
              active: Boolean,
              link: String,
              passKey: String
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
                console.log ("I AM BEING UPDATED");
                console.log("This backend email: " + this.tempBackendInfo.associatedEmail);
                this.expand = !this.expand;
                this.editBackendBool = !this.editBackendBool;
            },
            saveChanges() {
                this.expand = true;
                this.editBackendBool = false;

                //Operations changing store
                if(this.newBackend) {
                    console.log("New backend Bool: " + this.newBackendT);
                    this.$store.commit("addBackend", {
                        userIndex: this.userIndex,
                        name: this.tempBackendInfo.name,
                        link: this.tempBackendInfo.link,
                        passKey: this.tempBackendInfo.passKey,
                        associatedEmail: this.tempBackendInfo.associatedEmail,
                        admin: this.tempBackendInfo,
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
               this.tempBackendInfo.name = this.fedInBackend.name;
               this.tempBackendInfo.link = this.fedInBackend.link;
               this.tempBackendInfo.active = this.fedInBackend.active;
               this.tempBackendInfo.passKey = this.fedInBackend.passKey;
               this.tempBackendInfo.associatedEmail = this.fedInBackend.associatedEmail;
               this.tempBackendInfo.id = this.fedInBackend.id;
               this.tempBackendInfo.admin = this.fedInBackend.admin;
               this.newBackendT = this.newBackend;
            }
        },
        watch: {
            fedInBackend() {
                this.setTempVars();
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
        row-gap: 2px;
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