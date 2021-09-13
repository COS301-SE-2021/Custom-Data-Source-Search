<template>
  <Dialog header="Sign In"
          v-model:visible="display"
          :draggable="true "
          :closable="true"
          :dismissable-mask="true"
          :modal="true"
          @hide="closeDialog"
  >
    <div class="p-field p-grid">
      <label for="password" class="p-col-fixed" style="width:100px">Password</label>
      <div class="p-col">
        <Password id="password" v-model="masterPass" :toggle-mask="true" :feedback="false"/>
      </div>
    </div>
    <br>
    <div class="p-field p-grid" style="text-align: center">
      <Button type="button" icon="pi pi-arrow-down" class="p-button button-dialog" label="Pull" @click="pullFromVault" />
      <Button type="button" icon="pi pi-arrow-up" class="p-button button-dialog" label="Push" />
      <Button label="Cancel" class="p-button-text button-dialog" @click="closeDialog"/>
    </div>
  </Dialog>
</template>

<script>
import axios from "axios";
import {mapGetters} from "vuex";
import {SRPClientSession, SRPParameters, SRPRoutines} from "tssrp6a";

export default {
  name: "VaultSync",
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
    },
    async pullFromVault(){
      //1. challenge
      console.log("Attempting to Pull from the vault...");
      const userInfo = this.getUserInfo(this.getSignedInUserId);
      const client = new SRPClientSession(new SRPRoutines(new SRPParameters()));
      const step1 = await client.step1(userInfo.email, this.masterPass);

      const reqBody = {
        email: userInfo.email
      }
      axios.post("http://localhost:3002/vault/challenge", reqBody,
          {headers: {"Content-Type": "application/json"}})
          .then((resp) => {
            //authenticate
            console.log("Salt: " + resp.data.message.salt);
            console.log("B: " + resp.data.message.B);
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
      //2. authenticate
      //3. pull
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