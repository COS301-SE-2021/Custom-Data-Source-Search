<template>
    <Dialog header="Confirm Sign Out"
            :visible="display"
            :draggable="false"
            :closable="true"
            :dismissable-mask="true"
            :modal="true"
            @hide="$emit('display-popup')"
    >
        <div class="p-confirm-popup-message-moderator">
            <em class="pi pi-exclamation-triangle em-dialog"></em>
            <div class="p-dialog-content">
                <span class="span-dialog">
                    Are you sure you want to sign out {{user.name}}?
                </span>
            </div>
        </div>
        <div class="button-holders">
            <Button id="confirm-sign-out" @click="signOut" class="p-button-danger these-buttons">Sign Out</Button>
            <Button @click="closePopUp" class="p-button-text p-button-plain these-buttons">Cancel</Button>
        </div>
    </Dialog>
</template>

<script>
    export default {
        name: "SignOutCheck",

        props: {
            show: Boolean,
            user: {
                id: Number,
                name: String,
                hasVault: Boolean
            }
        },

        data () {
            return {
                display: this.show,
            }
        },

        watch:{
            show: function(){
                this.display = this.show
            }
        },

        methods: {
            closePopUp () {
                this.display = false;
            },
            signOut () {
                this.$store.commit('signOutUser', {userID: this.user.id});
                this.closePopUp();
                this.$router.push('/');
            }
        }
    }
</script>

<style scoped>

    input {
        width: 100%
    }

    .em-dialog {
        font-size: xx-large;
    }

    .these-buttons {
        max-width: fit-content;
        margin-left: 1em;
        margin-right: 1em;
        float: right;
    }

    .span-dialog {
        height: 40px;
        max-width: 1vw;
        overflow-wrap: normal;
    }

    .p-confirm-popup-message-moderator {
        display: grid;
        grid-template-columns: 1fr 12fr;
    }

</style>