<template>
    <div class="registration-grid">
        <div  class="registration-box">
            <div style="font-size: xx-large; padding-top: 10%; color: #f9f6ee; text-align: center">
                REGISTER
            </div>
            <form v-if="notContinue" class="input-fields"
                id="register"
                @submit="loadValues"
            >
                <div class="input-fields" style="max-height: 20vh">
                    <InputText type="text"  v-model="userDetails.userName" label="Name" placeholder="Name" />
                    <InputText type="email" v-model="userDetails.masterEmail" label="Email" placeholder="Email" />
                    <div>
                        <PasswordInputField id="masterPassword" style="width: 100%" v-model="masterPassword" placeholder="Master Password" :feedback="true" :toggle-mask="true"/>
                        <span style="font-size: small; margin-top: 30px">
                            The master password is the password you use to access your vault. It is very important that you do not forget your master password.
                            There is no way to recover the password in the event that you forget it.
                        </span>
                    </div>
                    <div>
                        <PasswordInputField  id="masterPassCheck" style="width: 100%; margin-bottom: 15px" :feedback="false" :toggle-mask="true" v-model="masterPassCheck" placeholder="Repeat Password" />

                    </div>
                    <div id="checkboxBox">
                        <checkbox id="checkBox" name="checkbox" v-model="userDetails.backupVault" :binary="true"/>
                        <label for="checkBox">Enable remote access to account?</label>
                    </div>
                    <br>
                    <br>
                    <div>
                        <Button type="submit" style="text-align: center;" class="p-button-md p-button-outlined">Register</Button>
                    </div>
                    <div>
                        <span>Already have an account?
                      <u><a v-on:click="showPopup">Sign in</a></u></span>
                    </div>
                    <div>
                        <Button v-if="notContinue" @click="back" style="float: right" icon="pi pi-arrow-circle-left"  class="p-button-lg p-button-outlined">Back</Button>
                    </div>
                    <div v-if="errors.length" style="max-height: 0.05vh">
                        <span> <b>Please correct the following error(s):</b></span>
                        <ul>
                            <li v-for="error in errors">{{ error }}</li>
                        </ul>
                    </div>
                </div>

                <SignIn :show="displaySignIn" @display-popup="showPopup"></SignIn>

            </form>
            <div v-else class="set-up-backend-box">
                <span> Do you want to continue on to configure backends?</span>
                <div class="continue-back-buttons">
                    <Button @click="goToSettings" style="text-align: center; margin-left: 2%" class="p-button-lg p-button-outlined">Yes </Button>
                    <Button @click="goToSearch"  style="margin-right: 2%" class="p-button-lg p-button-outlined"> No</Button>
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
    import SignIn from "../components/popups/SignIn";
    import Checkbox from 'primevue/checkbox';
    import PasswordInputField from "../components/primeComponents/PasswordInputField";
    export default {
        name: "Register",
        components: {
            PasswordInputField,
            Checkbox,
            SignIn,
            InputText
        },
        data () {
            return {
                errors: [],
                regexTester: null,
                masterPassCheck: null,
                masterPassword: null,
                displaySignIn: false,
                notContinue: true,
                userDetails: {
                    userName: null,
                    backupVault: false,
                    masterEmail: null,
                    hashToStore: null
                }
            }
        },
        mounted() {
            this.regexTester = new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})|(?=.{12,})');
        },
        methods: {
            loadValues() {
                //TO DO: Save Username and Master email, check passwords are exactly the same. Store other information for now.
                //Do we need a way to remove a user? Probably.
                let passFormValidation = true;

                //Checks:
                //#1: All fields required
                this.errors = [];

                if (!this.userDetails.userName) {
                    this.errors.push('Name required');
                }
                if (!this.userDetails.masterEmail) {
                    this.errors.push("Email required");
                }
                let emailArr = this.$store.getters.getUserMasterEmailsArr;
                for ( let email of emailArr) {
                    if (email === this.userDetails.masterEmail) {
                        this.errors.push('Email already registered. Please select another.');
                        this.userDetails.masterEmail = null;
                    }
                }

                //#2: Passwords must match & have some kind of strength test
                if (!this.masterPassword || !this.masterPassCheck) {
                    this.errors.push("Password required");
                }
                else if (this.masterPassword !== this.masterPassCheck) {
                    this.errors.push('Your passwords do not match. Please repeat');
                    this.masterPassword = null;
                    this.masterPassCheck = null;
                }
                else if (!this.regexTester.test(this.masterPassword)) {
                    this.errors.push('Password must have at least 8 characters.');
                    this.masterPassword = null;
                    this.masterPassCheck = null;
                }


                //#3: Some kind of hash of password and email must happen to unlock file [[[[[[ => TO DO <= ]]]]]]

                if (this.errors.length) {
                    passFormValidation = false;
                }

                if (passFormValidation)  {

                    //NB!!! HASH METHOD NEEDS TO CHANGE! TEMPORARY!!!
                    this.userDetails.hashToStore = this.hashStrings(this.masterPassword);
                    this.$store.commit("addUserToLocalList", {
                        name: this.userDetails.userName,
                        email: this.userDetails.masterEmail,
                        hash: this.userDetails.hashToStore,
                        browserAccess: this.userDetails.backupVault
                    });
                    this.continue();
                }
            },
            checkUsers() {

            },
            hashStrings (s) {
                let h = 0, l = s.length, i = 0;
                if ( l > 0 )
                    while (i < l)
                        h = (h << 5) - h + s.charCodeAt(i++) | 0;
                return h;
            },
            showPopup(){
                this.displaySignIn = !this.displaySignIn
            },
            continue() {
                this.notContinue = false;
            },
            back() {
                if (this.notContinue) {
                    this.$router.push('/');
                }
                this.notContinue = true;
            },
            goToSearch() {
                this.$router.push('Search');
            },
            goToSettings() {
                this.$router.push("Settings");
            }
        }
    }
</script>

<style scoped>

    .registration-grid {
        overflow-y: scroll;
        display: grid;
        grid-template-columns: 1fr 1fr;
        height: 100vh;
        padding-left: 5%;
        padding-right: 5%;
    }

    .registration-box {
        display: grid;
        grid-template-rows: 1fr 7fr;
        margin: 4%;
        font-size: larger;
        vertical-align: center;
        text-align: left;
    }

    .input-fields {
        display: grid;
        /*grid-template-rows: 1fr 1fr 1fr 1fr 1fr 1fr 4fr;*/
        margin: 4%;
        vertical-align: text-top;
    }

    .input-fields div {
        margin-top: 1.5vh;
    }

    .p-button.p-button-icon-only {
        width: 5rem;
    }

    .set-up-backend-box {
        display: grid;
        grid-template-rows: 1fr 1fr 1fr 5fr;
        margin: 4%;
        text-align: center;
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

    #checkboxBox {
        text-align: left;
    }


    label {
        padding-bottom: 4%;
        padding-left: 2%;
    }

    u {
        color: #41B3B2;
        cursor: pointer;
    }

    input {
        margin-top: 3vh;
    }

    .continue-back-buttons {
        display: flex;
        justify-content: center;
    }

    .p-button-lg {
        max-width: 4vw;
        max-height: 6vh;
        position: revert;
        bottom: 3vh;
        right: 55vw;
        margin: 1vw;
    }

</style>