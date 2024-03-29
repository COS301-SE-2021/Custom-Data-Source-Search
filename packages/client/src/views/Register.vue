<template>
  <div class="registration-grid">
    <Toast position="bottom-right"/>
    <div>
      <div style="margin-top: 3vh;">
        <Button
            icon="pi pi-arrow-left"
            class="p-button-lg p-button-rounded p-button-text"
            @click="back"
        />
      </div>
      <div style="margin-top: 5vh;">
        <div style="font-size: xx-large; color: #f9f6ee; text-align: center">
          <span>Register</span>
        </div>
        <form >
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
                  :binary="true"
              />
              <label for="checkbox">Enable remote access to account?</label>
              <br>
              <span style="font-size: small;">
                Remote access enables the user to log into their
                account on the web browser version of DataSleuth.
            </span>
            </div>
            <div style="text-align: center; margin-top: 5%;">
              <Button
                  id="btnRegister"
                  label="Register"
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
        </form>
      </div>
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
        <div>
          <span class="p-float-label">
            <PasswordInputField
                id="password"
                style="width: 100%"
                v-model="vaultPassword"
                :feedback="false"
                :toggle-mask="true"
                @keyup.enter="focusSignIn"
            />
            <label for="password">Master Password</label>
          </span>
          <div v-if="passwordIncorrect" class="error-message">
            <span class="error-message">Incorrect password.</span>
          </div>
        </div>
        <div style="text-align: center; margin-top: 5%;">
          <Button
              v-if="signingIn === false"
              id="signin-remote-btn"
              label="Sign In"
              type="submit"
              style="text-align: center;"
              class="p-button-md p-button-outlined"
              @click="retrieveVaultProfile"
          />
          <i v-else class="pi pi-spin pi-spinner"></i>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import InputText from 'primevue/inputtext'
  import SignIn from "../components/popups/SignIn";
  import Checkbox from 'primevue/checkbox';
  import PasswordInputField from "../components/customComponents/PasswordInputField";
  import axios from "axios";
  import {pbkdf2Sync} from 'crypto';
  import {decryptJsonObject, encryptJsonObject, generateMasterKey} from "@/store/Store";


  import {createVerifierAndSalt, SRPClientSession, SRPParameters, SRPRoutines,} from "tssrp6a"
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
        notContinue: true,
        vaultEmail: null,
        vaultPassword: null,
        passwordIncorrect: false,
        signingIn: false,
        userDetails: {
            userName: null,
            backupVault: false,
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
      focusSignIn() {
        document.getElementById("signin-remote-btn").focus();
      },

      /**
       * Ensure form filled in.
       *
       * Present errors on failure, create new user on success.
       */
      async retrieveVaultProfile(){
        this.signingIn = this.vaultPassword !== null;
        const remoteEmail = this.vaultEmail;
        const remotePassword = this.vaultPassword;
        const client = new SRPClientSession(new SRPRoutines(new SRPParameters()));
        const step1 = await client.step1(remoteEmail, remotePassword);
        //
        const reqBody = {
          email: remoteEmail
        };
        axios.post("https://datasleuthvault.nw.r.appspot.com/vault/challenge", reqBody,
            {headers: {"Content-Type": "application/json"}})
            .then(async (resp) => {
              //
              const step2 = await step1.step2(BigInt(resp.data.salt), BigInt(resp.data.B));
              //
              const clientA = step2.A;
              const clientM1 = step2.M1;
              //
              let reqObj = {
                email: remoteEmail,
                A: clientA,
                verificationMessage1: clientM1
              };
              //
              let reqBody = JSON.stringify(reqObj, (key, value) =>
                  typeof value === 'bigint'
                      ? value.toString()
                      : value
              );
              //
              axios.post("https://datasleuthvault.nw.r.appspot.com/vault/authenticate", reqBody,
                  {headers: {"Content-Type": "application/json"}})
                  .then(async (resp) => {
                    //verify server
                    try {
                      const step3 = await step2.step3(BigInt(resp.data.vM2));
                    } catch (e){
                      this.$toast.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: e.response.data,
                        life: 3000
                      });
                      this.signingIn = false;
                      console.log(e);
                      return;
                    }
                    //PHASE2
                    let reqObj = {
                      email: remoteEmail,
                      A: clientA,
                      verificationMessage1: clientM1
                    };
                    //
                    let reqBody = JSON.stringify(reqObj, (key, value) =>
                        typeof value === 'bigint'
                            ? value.toString()
                            : value
                    );
                    //
                    axios.post("https://datasleuthvault.nw.r.appspot.com/vault/pull", reqBody,
                        {headers: {"Content-Type": "application/json"}})
                        .then(async (resp) => {
                          //decrypt data
                          const encryptedObj =  {
                            iv: resp.data.data.user_iv,
                            authTag: resp.data.data.user_authtag,
                            data: resp.data.data.user_data
                          };
                          //NEED TO ADD USER HERE:
                          const masterKey = generateMasterKey(remotePassword, resp.data.data.user_salt);
                          const unencryptedUserData = decryptJsonObject(masterKey, encryptedObj);
                          //
                          this.$store.commit('addRemoteUserToLocalList', unencryptedUserData);
                          await this.$router.push({name: 'ContinueView'});
                        })
                        .catch((error) => {
                          this.passwordIncorrect = true;
                          this.signingIn = false;
                          console.log(error);
                        })
                  })
                  .catch((error) => {
                    this.passwordIncorrect = true;
                    this.signingIn = false;
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
              this.signingIn = false;
              console.log(error);
            })
      },

      async loadValues(){
        let passFormValidation = this.formValidationChecks();
        if (passFormValidation) {

          if(this.userDetails.backupVault === true){

            const cReqObj = {
              email: this.userDetails.masterEmail
            }

            const cReqBody = JSON.stringify(cReqObj);

            //check if email exists
            axios.post("https://datasleuthvault.nw.r.appspot.com/vault/challenge", cReqBody,
                {headers: {"Content-Type": "application/json"}})
                .then(async (resp) => {
                  console.log("Already Exists");
                  this.$toast.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: "User already exists on Vault",
                    life: 3000
                  });
                })
                .catch(async (error) => {

                  console.log(error);
                  await this.$store.dispatch("addNewUser", {
                    name: this.userDetails.userName,
                    email: this.userDetails.masterEmail,
                    masterPassword: this.masterPassword,
                    hasVault: this.userDetails.backupVault
                  });

                  const srp6aNimbusRoutines = new SRPRoutines(new SRPParameters());
                  const email = this.userDetails.masterEmail;
                  const password = this.masterPassword;
                  const saltAndVerifier = await createVerifierAndSalt(
                      srp6aNimbusRoutines,
                      email,
                      password,
                  );


                  const user = await this.getUser(this.getSignedInUserId);
                  //Registration Fields
                  const userSalt = user.info.salt;
                  const masterKey = generateMasterKey(password, userSalt);
                  const encryptedInfo = encryptJsonObject(masterKey, user);
                  const dataString = JSON.stringify(user);
                  const dataFingerprint = pbkdf2Sync(
                      dataString,
                      userSalt,
                      10000,
                      32,
                      'sha256'
                  ).toString('hex');

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

                  let reqBody = JSON.stringify(reqObj, (key, value) =>
                      typeof value === 'bigint'
                          ? value.toString()
                          : value
                  );

                  axios.post("https://datasleuthvault.nw.r.appspot.com/vault/register", reqBody,
                      {headers: {"Content-Type": "application/json"}})
                      .then(async (resp) => {

                        await this.$router.push({name: 'ContinueView'});
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
                })


          } else {
            await this.$store.dispatch("addNewUser", {
              name: this.userDetails.userName,
              email: this.userDetails.masterEmail,
              masterPassword: this.masterPassword,
              hasVault: this.userDetails.backupVault
            });
            await this.$router.push({name: 'ContinueView'});

          }

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
        if (!this.masterPassword) {
          this.errors.push("Password is invalid");
        } else if ( !this.masterPassCheck) {
          this.errors.push("Password Required");
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

  .error-message {
    color: #EF9A9A;
    text-align: center;
    margin-top: 5px;
  }

  .pi-spinner{
    font-size: 1.5rem;
    color: #41B3B2;
  }

  u {
    color: #41B3B2;
    cursor: pointer;
  }
</style>