<template>
    <div class="registration-grid">
        <div  class="registration-box">
            <div style="font-size: xx-large; padding-top: 10%; color: #f9f6ee; text-align: center">
                REGISTER
            </div>
            <div v-if="notContinue" class="input-fields">
                <InputText type="text" v-model="userName" label="Name" placeholder="Name" />
                <InputText type="text" v-model="masterEmail" label="Email" placeholder="Email" />
                <div>
                    <Password style="width: 100%" id="masterPassword" v-model="masterPassword" placeholder="Master Password" :feedback="false" :toggle-mask="true"/>
                </div>
                <div>
                    <Password style="width: 100%" id="masterPassCheck" :feedback="false" :toggle-mask="true" v-model="masterPassCheck" placeholder="Repeat Password" />
                </div>
                <div id="checkboxBox">
                    <checkbox id="checkBox" name="checkbox" v-model="backupVault" :binary="true"/>
                    <label for="checkBox">Enable remote access to account?</label>
                </div>
                <div style="text-align: left; vertical-align: center">
                    <span>Already have an account? </span> <u><a v-on:click="showPopup">Sign in</a></u>
                    <Button @click="loadValues" icon="pi pi-arrow-circle-right"  class="p-button-lg p-button-outlined" />
                </div>
                <SignIn :show="displaySignIn" @display-popup="showPopup"></SignIn>

                <div style="display: none">
                    <PasswordInputField/>
                </div>
            </div>
            <div v-else class="set-up-backend-box">
                Do you want to continue on to configure backends?
               <div>
                   <Button @click="loadValues" style="text-align: center; margin-left: 2%" class="p-button-lg p-button-outlined">Yes </Button>
                   <Button @click="loadValues"  style="margin-right: 2%" class="p-button-lg p-button-outlined"> No</Button>
               </div>

            </div>
        </div>
        <div>
            <div class="logo-box">
                <div></div>
                <div id="imageInRegistrationBox"><img  id="imageInRegistration" src="../assets/search_logo.png" height="300" alt=""></div>
             </div>
        </div>
    </div>

</template>

<script>
    import InputText from 'primevue/inputtext'
    import Password from 'primevue/password'
    import SignIn from "../components/popups/SignIn";
    import Checkbox from 'primevue/checkbox';
    import PasswordInputField from "../components/primeComponents/PasswordInputField";
    export default {
        name: "Register",
        components: {
            Checkbox,
            SignIn,
            Password,
            InputText,
            PasswordInputField
        },
        data () {
            return {
                userName: '',
                backupVault: false,
                masterEmail: '',
                masterPassword: '',
                masterPassCheck: '',
                displaySignIn: false,
                notContinue: true
            }
        },
        methods: {
            loadValues() {
                this.continue();
                console.log("Username: " + this.userName);
                console.log("Master Email: " + this.masterEmail);
                console.log("Master Password: " + this.masterPassword);
                console.log("Master Pass Check: " + this.masterPassCheck);
                console.log("Backup to Vault: " + this.backupVault);
            },
            checkUsers() {

            },
            showPopup(){
                this.displaySignIn = !this.displaySignIn
            },
            continue() {
                this.notContinue = false;
            }
        }
    }
</script>

<style scoped>

    .registration-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        height: 100%;
        padding-left: 5%;
        padding-right: 5%;
    }

    .registration-box {
        display: grid;
        grid-template-rows: 2fr 10fr;
        margin: 4%;
        font-size: larger;
        vertical-align: center;
        text-align: center;
    }

    .input-fields {
        display: grid;
        grid-template-rows: 1fr 1fr 1fr 1fr 1fr 1fr 4fr;
        margin: 4%;
    }


    .set-up-backend-box {
        display: grid;
        grid-template-rows: 1fr 1fr 1fr 5fr;
        margin: 4%;
    }

    .logo-box {
        height: 100%;
        display: grid;
        grid-template-rows: 1fr 3fr 1fr;
        vertical-align: center;
    }

    #imageInRegistrationBox {
        text-align: center;
        justify-content: center;
        vertical-align: center;
    }

    #imageInRegistration {
        padding: 10px;
    }

    input::placeholder {
        color: #575757;
        font-weight: bold;
    }

    #checkboxBox {
        text-align: left;
    }


    label {
        padding-bottom: 4%;
        padding-left: 2%;
    }

    Button {
      float: right;
    }

    u {
        color: #41B3B2;
        cursor: pointer;
    }

</style>