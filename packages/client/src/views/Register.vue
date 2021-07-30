<template>
    <div class="registration-grid">
        <div class="registration-box">
            <div style="font-size: xx-large; padding-top: 10%; color: #f9f6ee; text-align: center">
                REGISTER
            </div>
            <InputText tpye="text" v-model="userName" label="Name" placeholder="Name" />
            <InputText type="text" v-model="masterEmail" label="Email" placeholder="Email" />
            <div>
                <Password style="width: 100%" id="masterPassword" v-model="masterPassword" placeholder="Master Password" :feedback="false" :toggle-mask="true"/>
            </div>
            <div>
                <Password style="width: 100%" id="masterPassCheck" :feedback="false" :toggle-mask="true" v-model="masterPassCheck" placeholder="Repeat Password" />
            </div>
            <div id="checkboxBox">
              <checkbox id="checkBox" name="checkbox" v-model="backupVault" />
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
                backupVault: true,
                masterEmail: '',
                masterPassword: '',
                masterPassCheck: '',
                displaySignIn: false
            }
        },
        methods: {
            loadValues() {
                console.log(this.userName);
                console.log(this.masterEmail);
                console.log(this.masterPassword);
                console.log(this.masterPassCheck);
                console.log(this.keepSignedIn);
            },
            checkUsers() {

            },
            showPopup(){
                this.displaySignIn = !this.displaySignIn
            }
        }
    }
</script>

<style scoped>

    .registration-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        height: 100%;
        padding-left: 10%;
        padding-right: 10%;
    }

    .registration-grid div {
    }

    .registration-box {
        display: grid;
        grid-template-rows: 2fr 1fr 1fr 1fr 1fr 1fr 1fr 4fr;
        margin: 4%;
        font-size: larger;
        vertical-align: center;
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