<template>
    <Dialog header="Sign out?"
            v-model:visible="display"
            :draggable="false"
            :closable="true"
            :dismissable-mask="true"
            :modal="true"
            @hide="$emit('display-popup')">
        <div class="p-dialog-content">
            <span>Are you sure you want to sign out {{user.name}}?</span>
        </div>
        <div class="button-holders">
            <Button @click="signOut">Sign Out</Button>
            <Button @click="closePopUp">Cancel</Button>
        </div>
    </Dialog>
</template>

<script>
    export default {
        name: "SignOutCheck",
        data () {
            return {
                display: this.show,
            }
        },
        props: {
            show: Boolean,
            user: {
                id: Number,
                name: String,
                hasVault: Boolean
            }
        },
        methods: {
            closePopUp () {
                this.display = false;
            },
            signOut () {
                this.$store.commit('signOutUser', {user: this.user});
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

    input {
        width: 100%
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

</style>