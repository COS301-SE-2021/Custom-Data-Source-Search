<template>
  <Dialog
      header={{header}}
      v-model:visible="display"
      :draggable="true"
      :closable="true"
      :dismissable-mask="true"
      :modal="true"
      @hide="closeDialog"
  >
    {{body}}
    <div class="p-field p-grid">
      <div class="p-col">
        <span class="p-float-label">
           <PasswordInputField
              id="password"
              style="width: 100%"
              @keyup.enter="doChecks"
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
      <Button label="Cancel" class="p-button-text" @click="closeDialog"/>
      <Button label="Submit" autofocus @click="doChecks"/>
    </template>
  </Dialog>
</template>

<script>
    import PasswordInputField from "../primeComponents/PasswordInputField";

    export default {
        name: "ReEnterMasterPassword",

        components: {PasswordInputField},

        props: {
            show: Boolean,
            user: Object,
            welcomePage: Boolean,
            unconnectedBackendIcon: Boolean,
            vault: Boolean,
            body: String
        },

        data() {
            return {
                masterPass: null,
                display: this.show,
                passwordIncorrect: false,
            }
        },

        methods: {
            doChecks() {
                if (this.welcomePage) {
                    this.storeAUser();
                } else if (this.unconnectedBackendIcon) {
                    this.updateBackendLogin();
                } else if (this.vault) {
                    this.storeThisUser();
                } else {
                    this.storeThisUser();
                }
                this.passwordIncorrectCheck();
            },
            updateBackendLogin () {
                this.storeThisUser();
                for (let backend of this.$store.getters.unconnectedBackendObjects) {
                    console.log(JSON.stringify(backend))
                    this.$store.dispatch('backendLogin', backend.local);
                }
                console.log(this.$store.getters.unconnectedBackendBool);
            },
            storeAUser() {
                if (this.masterPass === null) {
                    this.passwordIncorrect = true;
                    return;
                }
                this.$store.commit('signInAUser', {
                    masterPassword: this.masterPass,
                    userID: this.user.id
                })
            },
            storeThisUser() {
                if (this.masterPass === null) {
                    this.passwordIncorrect = true;
                    return;
                }
                this.$store.commit('signInThisUser', {masterPassword: this.masterPass});
            },
            passwordIncorrectCheck() {
                if (this.$store.getters.getMasterKey != null) {
                    this.passwordIncorrect = false;
                    this.masterPass = '';
                    this.$emit("actionToOccur");
                    this.closeDialog();
                } else {
                    this.passwordIncorrect = true;
                    this.masterPass = null;
                }
            },
            closeDialog() {
                this.display = false;
                this.masterPass = null;
                this.$emit("closeDialog");
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
    margin-top: 3vh;
  }

  input {
    width: 100%
  }

  .error-message {
    color: #EF9A9A;
    text-align: center;
  }
</style>