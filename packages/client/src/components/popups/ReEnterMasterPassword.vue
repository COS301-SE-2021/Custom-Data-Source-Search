<template>
    <Dialog header="Enter Master Password" v-model:visible="display" :draggable="true " :closable="true" :dismissable-mask="true" :modal="true" @hide="$emit('display-popup')">
        <div class="header-size">
            Your session key has expired or been removed. Please sign in to continue:
        </div>
        <br>
        <div class="p-field p-grid">
            <label for="password" class="p-col-fixed" style="width:100px">Password</label>
            <div class="p-col">
                <PasswordInputField id="password" style="width: 100%" v-model="masterPass" :toggle-mask="true" :feedback="false"/>
            </div>
        </div>
        <br>
        <div class="p-field p-grid" style="text-align: center">
            <Button type="button" class="p-button-sm" label="Submit" @click="assignData()"/>
        </div>
    </Dialog>
</template>

<script>
    import PasswordInputField from "../primeComponents/PasswordInputField";
    export default {
        name: "ReEnterMasterPassword",
        components: {PasswordInputField},
        data() {
            return {
                masterPass: null,
                email: '',
                display: this.show
            }
        },
        props: {
            show: Boolean,
        },
        methods: {
            assignData() {
                //Call function to check if information can decrypt a backend (?)
                //For now:
                this.$store.commit('signInUser', {email: this.email, passWord: this.masterPass});
                this.display = false;
            }
        },
        watch: {
            show: function () {
                this.display = this.show
            }
        }
    }
</script>

<style scoped>

    .p-field {
        margin : 0.5rem;
    }

    input {
        width: 100%
    }

    .header-size {
        max-width: 18vw;
    }

</style>