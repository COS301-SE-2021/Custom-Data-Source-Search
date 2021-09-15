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
               @keyup.enter="assignData"
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
    <Button type="button" icon="pi pi-arrow-up" class="p-button button-dialog" label="Push" />
    <Button label="Cancel" class="p-button-text button-dialog" @click="closeDialog"/>
  </template>
  </Dialog>
</template>

<script>
import axios from "axios";
import {mapGetters} from "vuex";
import {SRPClientSession, SRPParameters, SRPRoutines} from "tssrp6a";
import PasswordInputField from "../primeComponents/PasswordInputField";

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
      axios.post("http://localhost:3002/vault/challenge", reqBody,
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

            axios.post("http://localhost:3002/vault/authenticate", reqBody,
                {headers: {"Content-Type": "application/json"}})
                .then(async (resp) => {

                  console.log(resp.data);

                  //verify server
                  try {
                    const step3 = await step2.step3(data.vM2);
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

                  axios.post("http://localhost:3002/vault/pull", reqBody,
                      {headers: {"Content-Type": "application/json"}})
                      .then((resp) => {
                        console.log(resp.data.data);
                      })
                      .catch((error) => {
                        this.$toast.add({
                          severity: 'error',
                          summary: 'Error',
                          detail: error,
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
      'getSignedIn'
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