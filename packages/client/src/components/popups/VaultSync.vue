<template>
  <Dialog header="Enter master password"
          v-model:visible="display"
          :draggable="true "
          :closable="true"
          :dismissable-mask="true"
          :modal="true"
          @hide="closeDialog"
  >
    We need to verify that it's you before interacting with the Vault
    <div class="p-field p-grid">
      <div class="p-col">
        <span class="p-float-label">
           <PasswordInputField
               id="password"
               style="width: 100%"
               v-model="masterPass"
               :toggle-mask="true"
               :feedback="false"
           />
        <label for="password">Password</label>
        </span>
        <div v-if="passwordIncorrect" class="error-message">
          <span class="error-message">Incorrect password.</span>
        </div>
      </div>
    </div>
  <template #footer>
    <Button type="button" icon="pi pi-arrow-down" class="p-button button-dialog" label="Pull" @click="pullFromVault" />
    <Button type="button" icon="pi pi-arrow-up" class="p-button button-dialog" label="Push" @click="pushToVault" />
    <Button label="Cancel" class="p-button-text button-dialog" @click="closeDialog"/>
  </template>
  </Dialog>
</template>

<script>
import axios from "axios";
import {mapGetters} from "vuex";
import PasswordInputField from "../customComponents/PasswordInputField";
import {createVerifierAndSalt, SRPClientSession, SRPParameters, SRPRoutines} from "tssrp6a";
import {decryptJsonObject, encryptJsonObject, generateMasterKey} from "@/store/Store";
import {createHash, pbkdf2Sync} from "crypto";

export default {
  name: "VaultSync",

  components: {PasswordInputField},

  props: {
    show: Boolean,
  },

  data() {
    return {
      masterPass: null,
      email: '',
      display: this.show,
      passwordIncorrect: false,
    }
  },

  watch: {
    show: function () {
      this.display = this.show
    }
  },

  methods: {
    closeDialog() {
      this.masterPass = null;
      this.email = '';
      this.display = false;
      this.$emit("closeDialog");
    },

    assignData() {
      this.$store.commit('signInUser', {email: this.email, passWord: this.masterPass});
    },

    async pullFromVault(){
      //1. challenge
      console.log("Attempting to Pull from the vault...");
      const userInfo = this.getUserInfo(this.getSignedInUserId);
      const client = new SRPClientSession(new SRPRoutines(new SRPParameters()));
      const step1 = await client.step1(userInfo.email, this.masterPass);
      console.log("passw: " + this.masterPass)

      const reqBody = {
        email: userInfo.email
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
              email: userInfo.email,
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
                    email: userInfo.email,
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

                        const masterKey = generateMasterKey(this.masterPass, resp.data.data.user_salt);
                        const unencryptedUserData = decryptJsonObject(masterKey, encryptedObj);
                        const payload = {
                          userData : unencryptedUserData
                        }
                        this.$store.commit('setUserDetails', payload);
                        this.$toast.add({
                          severity: 'success',
                          summary: 'Success',
                          detail: "Successfully Pulled From Vault",
                          life: 2500
                        });
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
              detail: error.response.data,
              life: 3000
            });
            console.log(error);
          })
    },
    async pushToVault(){
      //1. challenge
      console.log("Attempting to Push to the vault...");
      const userInfo = this.getUserInfo(this.getSignedInUserId);
      const client = new SRPClientSession(new SRPRoutines(new SRPParameters()));
      const step1 = await client.step1(userInfo.email, this.masterPass);
      console.log("passw: " + this.masterPass)

      const reqBody = {
        email: userInfo.email
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
              email: userInfo.email,
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
                  //verify authenticity of server
                  try {
                    const step3 = await step2.step3(BigInt(resp.data.vM2));
                  } catch (e){
                    console.log(e);
                  }
                  //Authentication Details
                  const password = this.masterPass;
                  const user = await this.getUser(this.getSignedInUserId);
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
                    email: userInfo.email,
                    A: clientA,
                    verificationMessage1: clientM1,
                    user_data: encryptedInfo.data,
                    fingerprint: dataFingerprint,
                    user_iv: encryptedInfo.iv,
                    user_authtag: encryptedInfo.authTag,
                    user_salt: userSalt
                  };

                  let reqBody = JSON.stringify(reqObj, (key, value) =>
                      typeof value === 'bigint'
                          ? value.toString()
                          : value
                  );

                  axios.post("https://datasleuthvault.nw.r.appspot.com/vault/push", reqBody,
                      {headers: {"Content-Type": "application/json"}})
                      .then((resp) => {
                        console.log(resp.data.data);
                        this.$toast.add({
                          severity: 'success',
                          summary: 'Success',
                          detail: "Successfully Pushed To Vault",
                          life: 2500
                        });
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
              detail: error.response.data,
              life: 3000
            });
            console.log(error);
          })
    }
  },

  computed: {
    ...mapGetters ([
      'getUserInfo',
      'getUserBackends',
      'getSignedInUserId',
      'getSignedIn',
        'getUser'
    ])
  },
}
</script>

<style scoped>
  .p-field {
    margin-top: 1rem;
  }

  input {
    width: 100%
  }

  .p-button {
    border: none;
  }

  .button-dialog {
    float: right;
  }
</style>