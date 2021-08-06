<template>
    <div class="backend-info-card">
        <Toast position="top-right"/>
        <div class="backend-info-sum">
            <div class="minimised-backend-info" >
                <div style="cursor: pointer" @click="change">
                    <em class="pi pi-circle-on" />
                    <span> {{fedInBackend.name}} </span>
                </div>
                <div>
                    <InputSwitch id="inputswitch" style="float: right; margin-top: 3px" v-model="fedInBackend.active"/>
                </div>
            </div>
                <div class="expanded-backend-info" v-if="expand && !editBackendBool">
                <div><i>Name: </i></div>
                <div> {{ fedInBackend.name }} </div>
                <div><i>Link: </i></div>
                <div> {{fedInBackend.link}} </div>
                <div><i>Pass Key: </i></div>
                <div> {{fedInBackend.passKey}} </div>
                <div></div>
                <div>
                    <Button @click="editBackend" style="float: right" class="p-button p-button-outlined">Edit </Button>
                    <Button @click="deleteBackend" style="float: right" class="p-button p-button-outlined">Delete </Button>
                </div>
            </div>
            <div class="edit-backend-info expanded-backend-info" v-if="editBackendBool">
                <div><i>Name: </i></div>
                <input-text v-model="tempBackendInfo.name"/>
                <div><i>Link: </i></div>
                <input-text v-model="tempBackendInfo.link"/>
                <div><i>Pass Key: </i></div>
                <input-text v-model="tempBackendInfo.passKey"/>
                <div></div>
                <div>
                    <Button @click="saveChanges" style="float: right" class="p-button p-button-outlined">Save </Button>
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
        components: {
          InputSwitch
        },
        name: "backendCard",
        data () {
            return {
                checked: false,
                editBackendBool: false,
                expand: false,
                tempBackendInfo: {
                    name: '',
                    active: false,
                    link: '',
                    passKey: ''
                }
            }
        },
        props: {
          userIndex: {
              type: Number,
              default: 0
          },
          backendIndex: {
              type: Number,
              default: 0
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
            change() {
                this.expand = !this.expand;
                // if (this.editBackendBool) {
                //     this.$toast.add({severity: 'warn', summary: 'Manage changes', detail: "Please select save or cancel before minimising", life: 2000})
                // }
            },
            editBackend() {
                this.expand = !this.expand;
                this.editBackendBool = !this.editBackendBool;
            },
            saveChanges() {
                this.expand = false;
                this.editBackendBool = false;

                if(this.newBackend) {
                    this.$store.commit("addBackend", {userIndex: this.userIndex, name: this.tempBackendInfo.name, link: this.tempBackendInfo.link, passKey: this.tempBackendInfo.passKey});
                    this.$emit('saveNewBackend');
                }
                else {
                    console.log("No name: " + this.tempName);
                    this.$store.commit("editBackend", {userIndex: this.userIndex, backendIndex: this.backendIndex, name: this.tempBackendInfo.name, link: this.tempBackendInfo.link, passKey: this.tempBackendInfo.passKey});
                }
                console.log ('Temporary name: ' + this.name);
                this.setTempVars();
            },
            cancelChanges() {
                this.expand = false;
                this.editBackendBool = false;
                if (this.newBackend) {
                    this.$emit('saveNewBackend');
                }
            },
            deleteBackend() {
                this.expand = false;
                this.editBackendBool = false;
                this.$store.commit("deleteBackend", this.backendIndex);
                this.setTempVars();
            },
            setTempVars() {
               this.tempBackendInfo = this.fedInBackend;
                console.log("Temp vars are now: " + this.tempBackendInfo.name + " " + this.tempBackendInfo.link + " " + this.tempBackendInfo.passKey );
                console.log("Fed in backend is currently: " + this.fedInBackend.name)

            }
        },

        watch: {
            fedInBackend() {
                this.tempBackendInfo = this.fedInBackend;
            }
        },
        computed: {
            ...mapGetters([
                'getUserBackend'
            ])
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
    }

    .expanded-backend-info div {
        max-height: 40px;
    }

    .pi-circle-on {
        color: #41B3B2;
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