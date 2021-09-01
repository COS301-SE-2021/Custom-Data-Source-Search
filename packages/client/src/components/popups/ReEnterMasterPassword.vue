<template>
  <Dialog
      header={{header}}
      v-model:visible="display"
      :draggable="true"
      :closable="true"
      :dismissable-mask="true"
      :modal="true"
      @hide="$emit('display-popup'); masterPass = null"
  >
    {{body}}
    <div class="p-field p-grid">
      <label for="password" class="p-col-fixed" style="width:100px">Password</label>
      <div class="p-col">
        <PasswordInputField
            id="password"
            style="width: 100%"
            @keyup.enter="assignData"
            v-model="masterPass"
            :toggle-mask="true"
            :feedback="false"
        />
        <div v-if="passwordIncorrect" class="error-message">
          <span class="error-message">Incorrect password.</span>
        </div>
      </div>
    </div>
    <template #footer>
      <Button label="Cancel" class="p-button-text" @click="closeDialog"/>
      <Button label="Submit" autofocus @click="submit"/>
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
      submit(){
        if(this.vault){
          console.log("Signed in this user");
          this.$store.commit('signInThisUser', {masterPassword: this.masterPass});
          if (this.$store.getters.getMasterKey != null) {
            this.passwordIncorrect = false;
            this.masterPass = '';
            this.$emit("actionToOccur");
            this.display = false;
          } else {
            this.passwordIncorrect = true;
            this.masterPass = null;
          }
          this.$emit("syncVault");
        }
        else{
          this.assignData();
        }
      },

      assignData() {
        if (this.masterPass === null || this.masterPass === '') {
          this.passwordIncorrect = true;
          this.masterPass = null;
          return;
        }
        if (this.welcomePage) {
          this.$store.commit('signInAUser', {
              masterPassword: this.masterPass,
              userID: this.user.id
          })
        } else if (this.unconnectedBackendIcon) {
          console.log("Signed in this user");
          this.$store.commit('signInThisUser', {masterPassword: this.masterPass});
          for (let backend of this.$store.getters.unconnectedBackendObjects) {
              this.$store.dispatch('backendLogin', backend.local);
          }
        } else {
          this.$store.commit('signInThisUser', {masterPassword: this.masterPass});
        }
        if (this.$store.getters.getMasterKey != null) {
          this.passwordIncorrect = false;
          this.masterPass = '';
          this.$emit("actionToOccur");
          this.display = false;
        } else {
          this.passwordIncorrect = true;
          this.masterPass = null;
        }
      },
      closeDialog() {
        this.display = false;
        this.masterPass = null;
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