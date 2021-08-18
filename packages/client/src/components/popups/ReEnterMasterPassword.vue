<template>
    <Dialog header="Enter Master Password" v-model:visible="display" :draggable="true " :closable="true" :dismissable-mask="true" :modal="true" @hide="$emit('display-popup')">
        <div class="header-size">
            Please enter your master password to continue:
        </div>
        <br>
        <div class="p-field p-grid">
            <label for="password" class="p-col-fixed" style="width:100px">Password</label>
            <div class="p-col">
                <PasswordInputField id="password" style="width: 100%" @keyup.enter="assignData" v-model="masterPass" :toggle-mask="true" :feedback="false"/>
                <br><br>
                <div v-if="passwordIncorrect" class="error-message">
                    <span>Password Incorrect!</span>
                    <br>
                    <span>{{ errMessage }}</span>
                </div>
            </div>
        </div>
        <div class="p-field p-grid" style="text-align: center">
            <Button type="submit" class="p-button-sm" label="Submit" @click="assignData"/>
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
                display: this.show,
                passwordIncorrect: false,
                messageArrCount: 0,
                errMessage: 'Please repeat master password.',
            }
        },
        props: {
            show: Boolean,
        },
        methods: {
            assignData() {
                this.$store.commit('signInThisUser', {masterPassword: this.masterPass});
                if(this.$store.getters.getMasterKey != null) {
                    this.passwordIncorrect = false;
                    this.masterPass = '';
                    this.$emit("actionToOccur");
                    this.display = false;
                }
                else {
                    this.passwordIncorrect = true;
                }
            }
        },
        watch: {
            show: function () {
                this.display = this.show;
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

    .error-message {
        color: red;
    }

</style>