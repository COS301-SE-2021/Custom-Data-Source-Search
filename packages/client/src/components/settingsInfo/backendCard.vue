<template>
    <div class="backend-info-card">
        <Toast position="top-right"/>
        <div class="backend-info-sum">
            <div class="minimised-backend-info" >
                <div style="cursor: pointer" @click="change">
                    <em class="pi pi-circle-on" />
                    <span>LEGO</span>
                </div>
                <div>
                    <InputSwitch id="inputswitch" style="float: right; margin-top: 2px" v-model="checked"/>
                </div>
            </div>
            <div class="expanded-backend-info" v-if="expand && !editBackendBool">
                <div><i>Name: </i></div>
                <div>LEGO</div>
                <div><i>Link: </i></div>
                <div>www.linktoLegoBackend/156WqezhgHf</div>
                <div><i>Pass Key: </i></div>
                <div>•••••••••••••••••••••••••••••••••••</div>
                <div></div>
                <div>
                    <Button @click="editBackend" style="float: right" class="p-button p-button-outlined">Edit </Button>
                </div>
            </div>
            <div class="edit-backend-info expanded-backend-info" v-if="editBackendBool">
                <div><i>Name: </i></div>
                <input-text/>
                <div><i>Link: </i></div>
                <input-text/>
                <div><i>Pass Key: </i></div>
                <input-text/>
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
                checked: false,
                expand: false,
                editBackendBool: false
            }
        },
        methods: {
            change() {
                this.expand = !this.expand;
                if (this.editBackendBool) {
                    this.$toast.add({severity: 'warn', summary: 'Manage changes', detail: "", life: 3000})
                }
            },
            editBackend() {
                console.log(this.edit);
                console.log(this.change);
                this.expand = !this.expand;
                this.editBackendBool = !this.editBackendBool;
            },
            saveChanges() {
                this.expand = true;
                this.editBackendBool = false;
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
        max-width: 500px;
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