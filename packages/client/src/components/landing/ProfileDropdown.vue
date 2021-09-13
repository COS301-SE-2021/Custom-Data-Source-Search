<template>
  <div class="main-container">
    <div class="user-detail-container">
      <div id="name"><strong>Hi, {{ getUserInfo(getSignedInUserId).name }}!</strong></div>
      <div id="email">{{ getUserInfo(getSignedInUserId).email }}</div>
    </div>
    <div class="backends-container">
      <div class="backend"
           v-for="(backend) in getUserBackends(getSignedInUserId)"
           :key="backend.local.id"
      >
        <span>{{backend.local.name}}</span>
        <InputSwitch v-model="backend.local.active"/>
        <Divider/>
      </div>
    </div>
    <div class="footer-buttons">
      <Button
          icon="pi pi-users"
          label="Switch User"
          class="p-button-text p-button-plain switch-user"
          @click="switchUser"
      />
      <Button
          icon="pi pi-sign-out"
          label="Sign Out"
          class="p-button-text p-button-plain sign-out"
          @click="signOut"
      />
    </div>
  </div>
  <SignOutCheck
          :show="displaySignOutCheck"
          @display-popup="showSignOutCheck"
          :user="getUserInfo(getSignedInUserId)"
  />
</template>

<script>
  import {mapGetters} from "vuex";
  import SignOutCheck from "../popups/SignOutCheck";

  export default {
  name: "ProfileDropdown",
    components: {SignOutCheck},
    data(){
    return{
      displaySignOutCheck: false
    }
  },
    computed: {
    ...mapGetters ([
            'getUserInfo',
            'getUserBackends',
            'getSignedInUserId'
    ])
  },
  methods:{
    showSignOutCheck() {
      this.displaySignOutCheck = !this.displaySignOutCheck;
    },
    signOut(){
      this.showSignOutCheck();
    },
    switchUser() {
      this.$store.commit('setSignedIn', false);
      this.$router.push('/');
    }
  }
}
</script>

<style scoped>
  .user-detail-container{
    margin-left: 25px;
    margin-bottom: 50px;
  }

  #name{
    margin-bottom: 8px;
    font-size: 20px;
  }

  .backends-container{
    margin-left: 25px;
  }

  .p-inputswitch{
    float: right;
    margin-right: 30px;
  }

  .sign-out{
    float: right;
    margin-right: 10px;
  }

  .switch-user{
    margin-left: 10px;
  }

  @media only screen and (max-width: 900px) {
    .sign-out{
      margin-left: 10px;
      float: left;
    }
  }
</style>