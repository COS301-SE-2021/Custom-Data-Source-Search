<template>
    <Dialog
            header="Delete Backend?"
            v-model:visible="display"
            :draggable="false"
            :closable="true"
            :dismissable-mask="true"
            :modal="true"
            @hide="$emit('display-popup')"
    >
        <div class="process-request-body">
            <div class="p-dialog-content">
                <span>It is a tedious process to insert the key. Are you sure there is no use in {{backend.name}} any longer?</span>
            </div>
            <div class="button-holders">
                <Button @click="deleteBackend">Delete</Button>
                <Button @click="closePopUp">Cancel</Button>
            </div>
        </div>
    </Dialog>
</template>

<script>
    export default {
        name: "BackendDeleteCheck",
        props: {
            show: Boolean,
            backend: {
                name: String,
            }
        },
        data() {
            return {
                display: this.show,
            }
        },
        methods: {
            closePopUp () {
                this.display = false;
            },
            deleteBackend () {
                this.$store.commit("deleteBackendFromLocalList", {user: this.user, deleteVault: this.deleteVault});
                this.$emit("deleteBackend");
                this.closePopUp();
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
        padding: 0 24px 0 24px;
    }

</style>