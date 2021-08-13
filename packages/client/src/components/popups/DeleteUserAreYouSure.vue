<template>
    <Dialog
            header="Delete User?"
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
            <Button @click="hasVualt">Delete</Button>
            <Button @click="cancelDeletion">Cancel</Button>
        </div>
    </div>
    <div class="process-request-body" v-else>
        <div class="p-dialog-content">
            <span>{{user.name}} has remote access to their account.</span>
            <br><br>
            <span>Do you want to remove only the local instance of their account or all records?</span>
            <br>
            <b>(You will require and internet connection for this to be processed)</b>
        </div>
        <div class="button-holders">

            <div>
                <RadioButton id="deleteLocal" value="false" v-model="deleteVualt" />
                <label for="deleteLocal">Delete local account only</label>
                <RadioButton id="deleteVualt" value="false" v-model="deleteVualt" />
                <label for="deleteVualt">Delete all instances of account</label>
            </div>
            <br>
            <Button @click="cancelDeletion">Delete</Button>
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
                hasVualt: Boolean
            }
        },
        data() {
            return {
                display: this.show,
                firstQuestion: true,
                deleteVualt: false,
            }
        },
        methods: {
            cancelDeletion () {
                this.display = false;
            },
            hasVualt () {
                if (this.user.hasVualt) {
                    this.firstQuestion = false;
                }
                else {
                    this.deleteUser();
                }
            },
            deleteUser () {

                this.$

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
        margin-left: 1em;
        margin-right: 1em;
    }


</style>