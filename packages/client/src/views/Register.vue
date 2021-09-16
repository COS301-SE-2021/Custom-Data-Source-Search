<template>
  <div class="registration-grid">
    <Toast position="bottom-right"/>
    <div>
      <div style="margin-top: 10%;">
        <Button
            icon="pi pi-arrow-left"
            class="p-button-lg p-button-rounded p-button-text"
            @click="back"
        />
      </div>
      <div style="font-size: xx-large; color: #f9f6ee; text-align: center">
        <span>Register</span>
      </div>
      <form @submit="loadValues">
        <div class="input-fields" style="max-height: 20vh">
          <span class="p-float-label">
              <InputText
                  id="Name"
                  v-model="userDetails.userName"
                  label="Name"
                  type="text"
                  style="width: 100%"
              />
            <label for="Name">Name</label>
          </span>
          <span class="p-float-label">
            <InputText
                id="Email"
                type="email"
                v-model="userDetails.masterEmail"
                style="width: 100%"
            />
            <label for="Email" >Email</label>
          </span>
          <div>
            <span class="p-float-label">
              <PasswordInputField
                  id="masterPassword"
                  style="width: 100%"
                  v-model="masterPassword"
                  :feedback="true"
                  :toggle-mask="true"
              />
              <label for="masterPassword">Master Password</label>
            </span>
            <span style="font-size: small; margin-top: 30px">
                The master password is the password you use to access your vault.
                It is very important that you do not forget your master password.
                There is no way to recover the password in the event that you forget it.
            </span>
          </div>
          <div>
           <span class="p-float-label">
              <PasswordInputField
                  id="masterPassCheck"
                  v-model="masterPassCheck"
                  style="width: 100%;"
                  :feedback="false"
                  :toggle-mask="true"
              />
             <label for="masterPassCheck">Repeat Password</label>
           </span>
          </div>
          <div>
            <Checkbox
                id="checkbox"
                name="checkbox"
                v-model="userDetails.backupVault"
                :binary="true"/>
            <label for="checkbox">Enable remote access to account?</label>
            <br>
            <span style="font-size: small;">
                Remote access enables the user to log into their
                account on the web browser version of DataSleuth.
            </span>
          </div>
          <div style="text-align: center; margin-top: 5%;">
            <Button
                label="Register"
                type="submit"
                style="text-align: center;"
                class="p-button-md p-button-outlined"
                @click="loadValues"
            />
          </div>
          <div v-if="errors.length" style="max-height: 0.05vh">
            <span> <strong>Please correct the following error(s):</strong></span>
            <ul>
              <li v-for="error in errors">{{ error }}</li>
            </ul>
          </div>
        </div>
        <SignIn :show="displaySignIn" @display-popup="showSignIn"></SignIn>
      </form>
    </div>
    <div>
      <Divider layout="vertical">
        <strong>OR</strong>
      </Divider>
    </div>
    <div style="margin-top: 25vh;">
      <div style="font-size: xx-large; color: #f9f6ee; text-align: center;">
        <span>Sign In</span>
      </div>
      <div style="text-align: center; margin-top: 10px;">
        Sign in to an existing profile on the vault
      </div>
      <div class="input-fields">
        <span class="p-float-label">
          <InputText
              id="emailVault"
              type="text"
              v-model="vaultEmail"
              style="width: 100%"
          />
          <label for="emailVault">Email</label>
        </span>
        <span class="p-float-label">
          <PasswordInputField
              id="password"
              style="width: 100%"
              v-model="vaultPassword"
              :feedback="false"
              :toggle-mask="true"
          />
          <label for="password">Master Password</label>
        </span>
        <div style="text-align: center; margin-top: 5%;">
          <Button
              label="Sign In"
              type="submit"
              style="text-align: center;"
              class="p-button-md p-button-outlined"
              @click="retrieveVaultProfile"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import InputText from 'primevue/inputtext'
  import SignIn from "../components/popups/SignIn";
  import Checkbox from 'primevue/checkbox';
  import PasswordInputField from "../components/primeComponents/PasswordInputField";
  import axios from "axios";
  import {createHash} from 'crypto';
  import {decryptJsonObject, encryptJsonObject, generateMasterKey} from "@/store/Store";


  import {
    createVerifierAndSalt, SRPClientSession, SRPParameters, SRPRoutines,
  } from "tssrp6a"
  import {mapGetters} from "vuex";

  const zxcvbn = require('zxcvbn');

  export default {
    name: "Register",

    components: {
      PasswordInputField,
      Checkbox,
      SignIn,
      InputText
    },

    data() {
      return {
        errors: [],
        regexTester: null,
        masterPassCheck: null,
        masterPassword: null,
        displaySignIn: false,
        notContinue: true,
        vaultEmail: null,
        vaultPassword: null,
        userDetails: {
            userName: null,
            backupVault: null,
            masterEmail: null,
            hashToStore: null
        }
      }
    },

    computed: {
      passwordStrength() {
        return zxcvbn(this.masterPassCheck);
      },
      ...mapGetters ([
        'getUserInfo',
        'getUserBackends',
        'getSignedInUserId',
        'getSignedIn',
          'getUser'
      ])
    },

    methods: {
      /**
       * Ensure form filled in.
       *
       * Present errors on failure, create new user on success.
       */
      async retrieveVaultProfile(){

        const remoteEmail = this.vaultEmail;
        const remotePassword = this.vaultPassword;
        console.log("Attempting to fetch user profile from the vault...");
        const client = new SRPClientSession(new SRPRoutines(new SRPParameters()));
        const step1 = await client.step1(remoteEmail, remotePassword);

        const reqBody = {
          email: remoteEmail
        }
        axios.post("https://datasleuthvault.nw.r.appspot.com/vault/challenge", reqBody,
            {headers: {"Content-Type": "application/json"}})
            .then(async (resp) => {

              console.log(resp.data);
              console.log("Salt: " + resp.data.salt);
              console.log("B: " + resp.data.B);

              const step2 = await step1.step2(BigInt(resp.data.salt), BigInt(resp.data.B));

              const clientA = step2.A;
              const clientM1 = step2.M1;

              let reqObj = {
                email: remoteEmail,
                A: clientA,
                verificationMessage1: clientM1
              }

              let reqBody = JSON.stringify(reqObj, (key, value) =>
                  typeof value === 'bigint'
                      ? value.toString()
                      : value
              );

              axios.post("https://datasleuthvault.nw.r.appspot.com/vault/authenticate", reqBody,
                  {headers: {"Content-Type": "application/json"}})
                  .then(async (resp) => {

                    console.log(resp.data);
                    //verify server
                    try {
                      const step3 = await step2.step3(BigInt(resp.data.vM2));
                    } catch (e){
                      console.log(e);
                    }

                    //PHASE2
                    let reqObj = {
                      email: remoteEmail,
                      A: clientA,
                      verificationMessage1: clientM1
                    }

                    let reqBody = JSON.stringify(reqObj, (key, value) =>
                        typeof value === 'bigint'
                            ? value.toString()
                            : value
                    );

                    axios.post("https://datasleuthvault.nw.r.appspot.com/vault/pull", reqBody,
                        {headers: {"Content-Type": "application/json"}})
                        .then((resp) => {
                          console.log(resp.data.data);
                          //decrypt data
                          const encryptedObj =  {
                            iv: resp.data.data.user_iv,
                            authTag: resp.data.data.user_authtag,
                            data: resp.data.data.user_data
                          }
                          //NEED TO ADD USER HERE:
                          //
                          const masterKey = generateMasterKey(remotePassword, resp.data.data.user_salt);
                          const unencryptedUserData = decryptJsonObject(masterKey, encryptedObj);

                          this.$store.commit('addRemoteUserToLocalList', unencryptedUserData);
                          this.$router.push('Search');

                        })
                        .catch((error) => {
                          this.$toast.add({
                            severity: 'error',
                            summary: 'Error',
                            detail: error.response.data,
                            life: 3000
                          });
                          console.log(error);
                        })

                  })
                  .catch((error) => {
                    this.$toast.add({
                      severity: 'error',
                      summary: 'Error',
                      detail: error.response.data,
                      life: 3000
                    });
                    console.log(error);
                  })
            })
            .catch((error) => {
              this.$toast.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Could not find user',
                life: 3000
              });
              console.log(error);
            })

      },
      async loadValues(){

        let passFormValidation = this.formValidationChecks();
        if (passFormValidation) {
          this.$store.dispatch("addNewUser", {
            name: this.userDetails.userName,
            email: this.userDetails.masterEmail,
            masterPassword: this.masterPassword,
            hasVault: this.userDetails.backupVault
          });
          this.$router.push({name: 'ContinueView'});
        }

        if(this.userDetails.backupVault === true){
          const srp6aNimbusRoutines = new SRPRoutines(new SRPParameters());

          const email = this.userDetails.masterEmail;
          const password = this.masterPassword;

          const saltAndVerifier = await createVerifierAndSalt(
              srp6aNimbusRoutines,
              email,
              password,
          );

          const user = await this.getUser(this.getSignedInUserId);


          //user_salt
          const userSalt = user.info.salt;
          const masterKey = generateMasterKey(password, userSalt);
          const encryptedInfo = encryptJsonObject(masterKey, user);

          const dataString = JSON.stringify(user);
          const dataFingerprint = createHash('sha256').update(dataString).digest("hex");

          let reqObj = {
                  email: this.userDetails.masterEmail,
                  salt: saltAndVerifier.s,
                  verifier: saltAndVerifier.v,
                  user_data: encryptedInfo.data,
                  fingerprint: dataFingerprint,
                  user_iv: encryptedInfo.iv,
                  user_authtag: encryptedInfo.authTag,
                  user_salt: userSalt
          }

          console.log(reqObj.fingerprint);
          let reqBody = JSON.stringify(reqObj, (key, value) =>
          typeof value === 'bigint'
              ? value.toString()
              : value
        );

          axios.post("https://datasleuthvault.nw.r.appspot.com/vault/register", reqBody,
              {headers: {"Content-Type": "application/json"}})
              .then((resp) => {
                this.$toast.add({
                  severity: 'success',
                  summary: 'Success',
                  detail: "User Added to Vault",
                  life: 2500
                });
                console.log(resp.data);

              })
              .catch((error) => {
                this.$toast.add({
                  severity: 'error',
                  summary: 'Error',
                  detail: error.response.data.message,
                  life: 3000
                });
                console.log(error);
              })
        }
      },
      formValidationChecks() {
        this.errors = [];
        //
        if (!this.userDetails.userName) {
          this.errors.push('Name required');
        }
        if (!this.userDetails.masterEmail) {
          this.errors.push("Email required");
        }
        let emailArr = this.$store.getters.getUserMasterEmailsArr;
        for (let email of emailArr) {
          if (email === this.userDetails.masterEmail) {
            this.errors.push('Email already registered. Please select another.');
            this.userDetails.masterEmail = null;
          }
        }
        // Password Checks
        if (!this.masterPassword || !this.masterPassCheck) {
          this.errors.push("Password required");
        } else if (this.masterPassword !== this.masterPassCheck) {
          this.errors.push('Your passwords do not match. Please repeat');
          this.masterPassword = null;
          this.masterPassCheck = null;
        } else if (this.passwordStrength.score <= 1) {
          this.errors.push('Please select a stronger password');
          this.masterPassword = null;
          this.masterPassCheck = null;
        }
        return !this.errors.length;
      },
      /**
       * Display sign-in Popup
       */
      showSignIn() {
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
    grid-template-columns: 2fr 1fr 2fr;
    height: 100vh;
    padding-left: 5%;
    padding-right: 5%;
  }

  .input-fields {
    display: grid;
    margin: 10% 4% 4%;
    vertical-align: text-top;
    grid-row-gap: 2.2vh;
  }

  .p-checkbox {
    margin-right: 1em;
    text-align: left;
  }

  u {
    color: #41B3B2;
    cursor: pointer;
  }
</style>