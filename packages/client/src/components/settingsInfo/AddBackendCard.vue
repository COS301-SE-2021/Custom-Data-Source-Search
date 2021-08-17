<template>
    <div class="backend-info-card">
        <Toast position="top-right"/>
        <div class="backend-info-sum">
            <div class="minimised-backend-info" >
                <div style="cursor: pointer" @click="change">
                    <em class="pi pi-circle-off" />
                    <span> {{cardName}} </span>
                </div>
                <div>
                </div>
            </div>
            <form @submit="saveChanges" class="edit-backend-info expanded-backend-info" v-if="editBackendBool">
                <div><em>Name: </em></div>
                <input-text v-model="tempBackendInfo.name"/>
                <div><em>Email: </em></div>
                <input-text v-model="tempBackendInfo.associatedEmail"/>
                <div><em>Link: </em></div>
                <input-text v-model="tempBackendInfo.link"/>
                <div><em>One Time Key: </em></div>
                <input-text v-model="tempBackendInfo.oneTimeKey"/>
                <div><em>Secret: </em></div>
                <input-text v-model="tempBackendInfo.secret"/>
                <div><em>Master Password: </em></div>
                <input-text v-model="tempBackendInfo.masterPassword"/>
                <div></div>
                <div>
                    <Button @click="connectToBackendChecks" style="float: right" class="p-button p-button-outlined">Connect</Button>
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
        name: "AddBackendCard",
        components: {
            InputSwitch
        },
        data () {
            return {
                expand: false,
                checked: false,
                editBackendBool: true,
                addBackendSuccess: null,
                newBackend: true,
                cardName: 'New Backend',
                tempBackendInfo: {
                    id: null,
                    name: '',
                    active: false,

                    associatedEmail: '',
                    link: '',
                    oneTimeKey: '',
                    secret: '',

                    masterPassword: ''
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
            }
        },
        methods: {

            //View changes
            change() {
                //TO DO: check that masterKey is there before adding a backend

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
            connectToBackendChecks(){

                if (
                    this.tempBackendInfo.masterPassword === '' ||
                    this.tempBackendInfo.link === '' ||
                    this.tempBackendInfo.associatedEmail === '' ||
                    this.tempBackendInfo.secret === '' ||
                    this.tempBackendInfo.oneTimeKey === ''
                ) {
                    this.$toast.add({severity:'error', summary: 'Backend Could Not Be Added', detail:'All the fields have not been filled.', life: 3000});
                }
                else {
                    this.connectToBackend();
                }
            },
            connectToBackend() {
                //Change from commit to action
                this.addBackendSuccess = this.$store.dispatch("addNewBackend", {
                    name: this.tempBackendInfo.name,
                    associatedEmail: this.tempBackendInfo.associatedEmail,
                    link: this.tempBackendInfo.link,
                    oneTimeKey: this.tempBackendInfo.oneTimeKey,
                    secret: this.secret,
                    masterPassword: this.tempBackendInfo.masterPassword
                });
                 console.log (this.addBackendSuccess);
                if(!this.addBackendSuccess.state){
                    this.$toast.add({severity:'error', summary: 'Backend Could Not Be Added', detail:'Please review details or request a new One Time Key', life: 3000});
                }
                this.$emit('saveNewBackend');
            },

            cancelChanges() {
                this.expand = true;
                this.editBackendBool = false;
                if (this.newBackend) {
                    this.$emit('saveNewBackend');
                }
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