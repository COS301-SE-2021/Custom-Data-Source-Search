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
            <div class="expanded-backend-info">
                <div><em>Name Backend: </em></div>
                <input-text v-model="tempBackendInfo.name"/>
                <div><em>Registration String: </em></div>
                <input-text type="text" id="registration-string" v-model="registrationString"/>
                <div></div>
                <div>
                    <Button @click="connectToBackendChecks" style="float: right" class="p-button p-button-outlined">Connect</Button>
                    <Button @click="cancelChanges" style="float: right" class="p-button p-button-outlined">Cancel</Button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import InputSwitch from 'primevue/inputswitch';
    import {mapGetters} from 'vuex';
    import axios from "axios";
    import {createHmac} from 'crypto'

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
                registrationString: '',
                tempBackendInfo: {
                    id: null,
                    name: '',
                    active: false,
                    associatedEmail: '',
                    link: '',
                    oneTimeKey: '',
                    secret: ''
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
                this.extractEncodedData(this.registrationString);
                if (
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
            extractEncodedData(encodedString) {
                let encoded = encodedString.split(".");
                this.tempBackendInfo.associatedEmail = atob(encoded[0]);
                this.tempBackendInfo.link = atob(encoded[1]);
                this.tempBackendInfo.oneTimeKey = atob(encoded[2]);
                this.tempBackendInfo.secret = atob(encoded[3]);
                console.log(JSON.stringify(this.tempBackendInfo))
            },
            connectToBackend() {
                //Change from commit to action
                axios.post(
                    this.tempBackendInfo.link + "/users/registrationkey",
                {
                        email: this.tempBackendInfo.associatedEmail,
                        single_use_registration_token: this.tempBackendInfo.oneTimeKey
                    }
                ).then((resp) => {
                    let hmac = createHmac('sha512', this.tempBackendInfo.secret)
                    this.$store.dispatch("addNewBackend", {
                        name: this.tempBackendInfo.name,
                        associatedEmail: this.tempBackendInfo.associatedEmail,
                        link: this.tempBackendInfo.link,
                        passKey: hmac.update(resp.data.partial_pass_key).digest('hex'),
                        seed: hmac.update(resp.data.partial_seed).digest('hex'),
                        refreshToken: resp.data.refresh_token
                    });
                    this.$emit('saveNewBackend');
                }).catch((err) => {
                    this.$toast.add({severity: 'error', summary: 'Failed To Add Backend', detail: err.message, life:3000})
                })
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
        grid-template-rows: 1fr 1fr;
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