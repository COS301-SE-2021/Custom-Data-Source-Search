<template>
    <div class="backend-info-card">
        <Toast position="top-right"/>
        <div class="backend-info-sum">
            <div class="minimised-backend-info" >
                <div style="cursor: pointer" @click="change">
                    <em class="pi pi-circle-on" />
                    <span> {{$store.state.users[userIndex].backends[backendIndex].name}} </span>
                </div>
                <div>
                    <InputSwitch id="inputswitch" style="float: right; margin-top: 3px" v-model="$store.state.users[userIndex].backends[backendIndex].active"/>
                </div>
            </div>
            <div class="expanded-backend-info" v-if="expand && !editBackendBool">
                <div><i>Name: </i></div>
                <div> {{ $store.state.users[userIndex].backends[backendIndex].name }} </div>
                <div><i>Link: </i></div>
                <div> {{$store.state.users[userIndex].backends[backendIndex].link}} </div>
                <div><i>Pass Key: </i></div>
                <div> {{$store.state.users[userIndex].backends[backendIndex].passKey}} </div>
                <div></div>
                <div>
                    <Button @click="editBackend" style="float: right" class="p-button p-button-outlined">Edit </Button>
                </div>
            </div>
            <div class="edit-backend-info expanded-backend-info" v-if="editBackendBool">
                <div><i>Name: </i></div>
                <input-text v-model="tempName"/>
                <div><i>Link: </i></div>
                <input-text v-model="tempLink"/>
                <div><i>Pass Key: </i></div>
                <input-text v-model="tempPassKey"/>
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
    import InputSwitch from 'primevue/inputswitch'
    export default {
        components: {
          InputSwitch
        },
        name: "backendCard",
        data () {
            return {
                backend: {
                    userIndex: null,
                    backendIndex: null,
                    name:'',
                    link:'',
                    passKey:''
                },
                checked: false,
                expand: false,
                editBackendBool: false,
                tempName: '',
                tempLink: '',
                tempPassKey: ''
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
          }

        },
        mounted() {
            this.setTempVars();
        },
        methods: {
            setTempVars () {
                this.tempName = this.$store.state.users[this.userIndex].backends[this.backendIndex].name;
                // console.log(this.$store.state.users[this.userIndex].backends[this.backendIndex].name);
                console.log('Initializer called');
                console.log ('Temp: ' + this.tempName);
                this.tempLink = this.$store.state.users[this.userIndex].backends[this.backendIndex].link;
                this.tempPassKey = this.$store.state.users[this.userIndex].backends[this.backendIndex].passKey;
            },
            change() {
                this.expand = !this.expand;
                if (this.editBackendBool) {
                    this.$toast.add({severity: 'warn', summary: 'Manage changes', detail: "Please save or cancel changes", life: 2000})
                }
            },
            editBackend() {
                console.log ("edit birds called" );
                this.expand = !this.expand;
                this.editBackendBool = !this.editBackendBool;
                console.log ('Temp: ' + this.tempName);
            },
            saveChanges() {
                console.log("save changes called");
                this.expand = true;
                this.editBackendBool = false;
                console.log(this.tempName, this.tempLink, this.tempPassKey);
                this.$store.commit("editBackend", {userIndex: 0, backendIndex: this.backendIndex, name: this.tempName, link: this.tempLink, passKey: this.tempPassKey});
                console.log ('Temporary name: ' + this.name);
                this.setTempVars();
            },
            cancelChanges() {
                this.expand = true;
                this.editBackendBool = false;
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