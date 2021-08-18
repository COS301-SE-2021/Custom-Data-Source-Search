<template>
  <div class="main-container">
    <div class="image-container">
      <div class="image-ring">
        <h3 class="name-initial">{{ getUserInfo(getSignedInUserId).name.charAt(0).toUpperCase() }}</h3>
      </div>
    </div>

    <div class="user-detail-container">
      <div id="name"><strong>{{ getUserInfo(getSignedInUserId).name }}</strong></div>
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
      <Button icon="pi pi-users" label="Switch User" class="p-button-text p-button-plain switch-user" @click="switchUser"/>
      <Button icon="pi pi-sign-out" label="Sign Out" class="p-button-text p-button-plain sign-out" @click="signOut"/>
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
      console.log(this.$store.getters.getMasterKey);
      this.$store.commit('setSignedIn', false);
      this.$router.push('/');
    }
  }
}
</script>

<style scoped>

.image-container {
  float: left;
  margin-left: 1vw;
  vertical-align: middle;
  width: 50px;
  height: 50px;
}

.image-ring {
  width: 100%;
  height: 100%;
  background:
      linear-gradient(#2d2d2d, #2d2d2d) padding-box,
      linear-gradient(to right bottom, #2bd6c8, #3b6693) border-box;
  border-radius: 50em;
  border: 3px solid transparent;
}

.name-initial {
  color: #f3f3f3;
  font-size: 25px;
  margin: auto;
  width: 100%;
  height: 100%;
  text-align: center;
  line-height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.user-detail-container{
  margin-left: 90px;
  margin-bottom: 50px;
}

#name{
  margin-bottom: 8px;
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
</style>