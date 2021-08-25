<template >
  <div class="page">
    <Toast position="bottom-left"/>
    <div class="heading-and-info">
      <h1 class="header">Who's Sleuthing ?</h1>
      <p class="description"> Select the user you would like to sign in as</p>
    </div>
    <div class="user-select">
      <UserCard
              v-if="!getNewAppStatus"
              v-for="(user, i) in getArrUserInfo"
              :key="i"
              :userDetails="user"
              @contextmenu="onUserCardRightClick"
              @mousedown.right="updateSelectedUser(user)"
              @click="updateSelectedUser(user)"
              @show-sign-in="showReEnterMasterPass"
      ></UserCard>
      <ContextMenu ref="deleteOption" :model="items"></ContextMenu>
      <AddUserCard></AddUserCard>
    </div>

    <DeleteUserAreYouSure
            :show="displayDeleteCheck"
            @display-popup="showPopup"
            :user="selectedUser"
            :delete-vault-fed-in="null"
            :first-question-fed-in="true"
            @close="cleanPopUp"
            @clear-current-user="clearCurrentUser"
    />
    <SignOutCheck
            :show="displaySignOutCheck"
            @display-popup="showSignOutCheck"
            :user="selectedUser"
    />
    <SignIn
            :show="displaySignIn"
            @show-sign-in="showSignIn"
    />
    <ReEnterMasterPassword
            :show="displayMasterPwInput"
            @action-to-Occur="signInThisUser"
            :user="selectedUser"
            :welcomePage="true"
    />
  </div>
</template>

<script>
  import UserCard from "@/components/users/UserCard";
  import AddUserCard from "@/components/users/AddUserCard";
  import {mapGetters} from "vuex";
  import DeleteUserAreYouSure from "../components/popups/DeleteUserAreYouSure";
  import SignOutCheck from "../components/popups/SignOutCheck";
  import SignIn from "../components/popups/SignIn";
  import ReEnterMasterPassword from "../components/popups/ReEnterMasterPassword";

  const electron = require('@electron/remote');

  export default {
  name: "Welcome",
  components: {ReEnterMasterPassword, SignIn, SignOutCheck, DeleteUserAreYouSure, AddUserCard, UserCard},
  data () {
    return {
      displayMasterPwInput: false,
      displaySignIn: false,
      displayDeleteCheck: false,
      displaySignOutCheck: false,
      isSignedIn: true,
      execProcess : null,
      stopProcess : null,
      removeBoolean: false,
      selectedUser: null,
      deleteVaultFedIn: null,
      firstQuestionFedIn: true,
      items: [
        {label: 'Remove', icon: 'pi pi-trash', command: () => {
            // event.originalEvent: Browser event
            // event.item: Menuitem instance
            this.displayDeleteCheck = !this.displayDeleteCheck;
          }},
        {label: 'Sign Out', icon: 'pi pi-sign-out', command: () => {
            this.displaySignOutCheck = !this.displaySignOutCheck;
          }}
      ]
    }

  },
  methods: {
    showReEnterMasterPass() {
      this.displayMasterPwInput = !this.displayMasterPwInput;
    },
    signInThisUser(){
      this.$router.push('Search');
      this.$store.commit('setSignedIn', true);
    },
    showSignIn(){
      this.displaySignIn = !this.displaySignIn
    },
    clearCurrentUser() {
         this.$store.commit('setSignedInUserID', {userID: null, signedIn: null});
    },
    cleanPopUp() {
      if (this.displayDeleteCheck) {
        this.firstQuestionFedIn = true;
        this.deleteVaultFedIn = true;
      }
    },
    showSignOutCheck() {
      this.displaySignOutCheck = !this.displaySignOutCheck;
    },
    showPopup(){
    this.displayDeleteCheck = !this.displayDeleteCheck
    },
    updateSelectedUser(user) {
      this.selectedUser = user;
    },
    onUserCardRightClick(event) {
      this.$refs.deleteOption.show(event);
    },
  },
  mounted () {
    this.isSignedIn = this.$store.getters.getSignedIn;
  },
  computed: {
    ...mapGetters([
            'getArrUserInfo',
            'getNewAppStatus'
    ])
  }
}
</script>

<style scoped>

.page {
  width: 100%;
  height: 100vh;
  display: grid;
  grid-template-columns: 1fr 4fr 1fr;
  grid-template-rows: 1fr 3fr 1fr;
}

.heading-and-info {
  display: block;
  grid-column-start: 2;
}

.header {
  text-align: center;
  color: #ededed;
}

.description {
  text-align: center;
  color: #ededed;
}

.user-select {
  grid-row-start: 2;
  grid-column-start: 2;
  display: flex;
  flex-direction: row;
  justify-content: center;
  flex-wrap: wrap;
  padding-top: 3vw;
}

</style>