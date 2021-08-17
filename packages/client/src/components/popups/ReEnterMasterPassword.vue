<template>
    <Dialog header="Enter Master Password" v-model:visible="display" :draggable="true " :closable="true" :dismissable-mask="true" :modal="true" @hide="$emit('display-popup')">
        <div class="header-size">
            Please enter your master password to continue:
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
                this.$store.commit('signInThisUser', {masterPassword: this.masterPass});
                if(this.$store.getters.getMasterKey != null) {
                    this.$emit("newBackend");
                }
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