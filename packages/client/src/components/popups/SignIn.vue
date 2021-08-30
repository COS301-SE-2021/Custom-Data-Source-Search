<template>
  <Dialog header="Sign In"
          v-model:visible="display"
          :draggable="true "
          :closable="true"
          :dismissable-mask="true"
          :modal="true"
          @hide="$emit('display-popup')"
  >
    <div class="p-field p-grid">
      <label for="firstname" class="p-col-fixed" style="width:100px;">Email Address</label>
      <div class="p-col">
        <InputText id="firstname" type="text" v-model="email"/>
      </div>
    </div>
    <div class="p-field p-grid">
      <label for="password" class="p-col-fixed" style="width:100px">Password</label>
      <div class="p-col">
        <Password id="password" v-model="masterPass" :toggle-mask="true" :feedback="false"/>
      </div>
    </div>
    <br>
    <div class="p-field p-grid" style="text-align: center">
      <Button type="button" class="p-button button-dialog" label="Submit" @click="assignData()"/>
      <Button label="Cancel" class="p-button-text button-dialog" @click="closeDialog"/>
    </div>
  </Dialog>
</template>

<script>
    export default {
        name: "SignIn",
        props: {
            show: Boolean,
        },

        data() {
            return {
                masterPass: null,
                email: '',
                display: this.show
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
            },
            assignData() {
                this.$store.commit('signInUser', {email: this.email, passWord: this.masterPass});
                this.display = false;
            }
        }
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