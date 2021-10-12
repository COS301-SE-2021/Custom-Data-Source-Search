<template>
  <div class="main-container">
    <div class="user-detail-container">
      <div id="name">
        <strong>Hi, {{ getUserInfo(getSignedInUserId).name }}!</strong>
        <div class="fade"></div>
      </div>
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
    <div class="fontsize-options">
      <span>Text Size: </span>
      <span id="Small" class="font-button" @click="fontsize('Small')">Aa</span>
      <span id="Regular" class="font-button" @click="fontsize('Regular')">Aa</span>
      <span id="Large" class="font-button" @click="fontsize('Large')">Aa</span>
      <Divider/>
    </div>
    <div class="footer-buttons">
      <Button
          icon="pi pi-users"
          label="Switch User"
          class="p-button-text p-button-plain switch-user"
          @click="switchUser"
      />
      <Button
          id="sign-out-btn"
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
      ]),
      state(){
        return this.$store.getters.getFontSize;
      }
    },

    watch: {
      state(newState){
        let btns = document.getElementsByClassName("font-button");
        for (let i = 0; i < btns.length; i++) {
          let current = document.getElementsByClassName("chosen");
          if(current.length!==0){
            current[0].className =current[0].className.replace(" chosen", "");
          }
        }
        document.getElementById(newState).className += " chosen";
      }
    },

    mounted() {
      let s = this.$store.getters.getFontSize;
      document.getElementById(s).className += " chosen";
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
      },

      fontsize(s){
        this.$store.commit('alterFontSize', s);
      }
    }
}
</script>

<style scoped>
  .main-container, .p-button-text{
    font-size: 16px !important;
  }

  .pi-users, .pi-sign-out{
    font-size: 1em !important;
  }

  .p-button-text{
    font-size: 1em !important;
  }

  .p-button{
    padding: 0.714em 1em !important;
  }

  .user-detail-container{
    margin-left: 25px;
    margin-bottom: 35px;
  }

  .fontsize-options{
    margin-left: 25px;
  }

  #name{
    margin-bottom: 8px;
    font-size: 20px;
    overflow:hidden;
    position: relative;
  }

  .fade{
    position:absolute;
    top:0; bottom:0; right:0;
    width:100%;
    background:#262626;
    animation: showHide 3s ease-in forwards;
    animation-iteration-count: 1;
  }

  .backends-container{
    margin-left: 25px;
  }

  .p-inputswitch{
    float: right;
    margin-right: 30px;
  }

  .p-component{
    font-size: 1em !important;
  }

  .sign-out{
    float: right;
    margin-right: 10px;
  }

  .switch-user{
    margin-left: 10px;
  }

  #Small, #Regular, #Large{
    padding: 10px !important;
  }

  #Small:hover, #Regular:hover, #Large:hover{
    background: transparent;
    cursor: pointer;
  }

  #Small{
    font-size: 13px !important;
    margin-left: 50px;
  }

  #Large{
    font-size: 20px !important;
  }

  .chosen{
    color: #41B3B2;
  }

  @keyframes showHide {
    0% {width: 100%}
    40% {width: 0}
    60% {width: 0}
    100% {width: 0%}
  }

  @media only screen and (max-width: 900px) {
    .sign-out{
      margin-left: 10px;
      float: left;
    }
  }
</style>