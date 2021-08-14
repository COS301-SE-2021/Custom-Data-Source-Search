<template>
    <Dialog
            header="Remove User?"
            v-model:visible="display"
            :draggable="false"
            :closable="true"
            :dismissable-mask="true"
            :modal="true"
            @hide="$emit('display-popup')"
    >
    <div class="process-request-body" v-if="firstQuestion">
        <div class="p-dialog-content">
            <span>Are you sure you want to delete {{user.name}}?</span>
            <br><br>
            <span>This user may not have a browser backup of their information. If you delete their local account, they may have to re-register to gain access to all their data sources.</span>
        </div>
        <div class="button-holders">
            <Button @click="hasVault">Delete</Button>
            <Button @click="cancelDeletion">Cancel</Button>
        </div>
    </div>
    <div class="process-request-body" v-else>
        <div class="p-dialog-content">
            <span>{{user.name}} has remote access to their account.</span>
            <br><br>
            <span>Do you want to remove only the LOCAL INSTANCE of their account, or ALL INSTANCES?</span>

            <br>
        </div>
        <div class="radio-button-holders">

            <div>
                <RadioButton name="deleteVault" id="deleteLocal" value="deleteLocal" v-model="deleteVault" />
                <label for="deleteLocal">  LOCAL account only</label>
            </div>
            <div>
                <RadioButton name="deleteVault" id="deleteVault" value="deleteVault" v-model="deleteVault" />
                <label for="deleteVault">  ALL instances of account</label>
            </div>
            <br>
            <div style="text-align: center">
                <strong>(You will require internet connection in order for this to be processed)</strong>
            </div>
            <div style="text-align: center">
                <Button :disabled="!deleteVault" @click="cancelDeletion">Delete</Button>
            </div>
        </div>
    </div>
    </Dialog>
</template>

<script>
    export default {
        name: "DeleteUserAreYouSure",
        props: {
            show: Boolean,
            user: {
                id: Number,
                name: String,
                hasVault: Boolean
            }
        },
        data() {
            return {
                display: this.show,
                firstQuestion: true,
                deleteVault: null
            }
        },
        methods: {
            cancelDeletion () {
                this.display = false;
            },
            hasVault () {
                if (this.user.hasVault) {
                    this.firstQuestion = false;
                    console.log ( this.user.name + " has a vault");
                }
                else {
                    this.deleteUser();
                }
            },
            deleteUser () {
                console.log("Deleting User" + this.user.name + " Still in progress");
            }
        },
        watch:{
            show: function(){
                this.display = this.show
            }
        }
    }
</script>

<style scoped>


    .p-dialog-content {
        max-width: 40em;
    }

    span {
        max-width: 1vw;
        overflow-wrap: normal;
    }

    .button-holders {
        display: flex;
        justify-content: center;
    }

    Button {
        max-width: fit-content;
        margin-left: 1em;
        margin-right: 1em;
    }

    .radio-button-holders {
        display: grid;
        grid-row-gap: 0.5em;
        padding: 0 24px 24px;
    }

</style>