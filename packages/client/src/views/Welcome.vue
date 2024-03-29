<template>
  <ConfirmDialog/>
  <div class="page">
    <Toast position="bottom-right"/>
    <div class="heading-and-info">
      <h1 class="header">Who's Sleuthing?</h1>
      <p class="description">
        Select the user you would like to sign in as
      </p>
    </div>
    <div class="user-select">
      <UserCard
          v-for="(user, i) in getArrUserInfo"
          v-if="!getNewAppStatus"
          :key="i"
          :userDetails="user"
          @contextmenu="onUserCardRightClick"
          @mousedown.right="updateSelectedUser(user)"
          @click="updateSelectedUser(user)"
          @show-sign-in="showReEnterMasterPass"
      />
      <ContextMenu
          ref="deleteOption"
          :model="items"
      />
      <AddUserCard id="add-user-card"/>
    </div>
    <span id="tips-span">Tip: {{tips[0]}}</span>
    <DeleteUserAreYouSure
        :show="displayDeleteCheck"
        :user="selectedUser"
        :delete-vault-fed-in="null"
        :first-question-fed-in="true"
        @display-popup="showPopup"
        @close="cleanPopUp"
        @clear-current-user="clearCurrentUser"
    />
    <ReEnterMasterPassword
        :show="displayMasterPwInput"
        :user="selectedUser"
        :welcomePage="true"
        :header="'Enter Master Password'"
        :body="'Get back to Sleuthin\' all your favourite backends!'"
        :vault="false"
        @action-to-Occur="signInThisUser"
    />
  </div>
</template>

<script>
  import UserCard from "../components/users/UserCard";
  import AddUserCard from "../components/users/AddUserCard";
  import DeleteUserAreYouSure from "../components/popups/DeleteUserAreYouSure";
  import SignOutCheck from "../components/popups/SignOutCheck";
  import SignIn from "../components/popups/SignIn";
  import ReEnterMasterPassword from "../components/popups/ReEnterMasterPassword";
  import {mapGetters} from "vuex";
  import _ from 'lodash';

  export default {
    name: "Welcome",

    components: {
      ReEnterMasterPassword,
      SignIn,
      SignOutCheck,
      DeleteUserAreYouSure,
      AddUserCard,
      UserCard
    },

    data() {
      return {
        displayMasterPwInput: false,
        displaySignIn: false,
        displayDeleteCheck: false,
        displaySignOutCheck: false,
        isSignedIn: true,
        execProcess: null,
        stopProcess: null,
        removeBoolean: false,
        selectedUser: null,
        deleteVaultFedIn: null,
        firstQuestionFedIn: true,
        randomId: null,
        items: [{
          label: 'Remove',
          icon: 'pi pi-trash',
          command: () => {
            this.displayDeleteCheck = !this.displayDeleteCheck;
          }
        },
          {
            label: 'Sign Out',
            icon: 'pi pi-sign-out',
            command: () => {
              this.$confirm.require({
                message: "Are you sure you want to sign out, " + this.selectedUser.name + "?",
                header: 'Confirmation',
                icon: 'pi pi-exclamation-triangle',
                acceptClass: "p-button-danger",
                rejectClass: "p-button-text p-button-plain",
                accept: () => {
                  this.$store.commit('signOutUser', {userID: this.selectedUser.id});
                  this.$router.push('/');
                }
              })
            }
          }
        ],
        tips: [
          "Want to fuzzy search? Place ~ at the end of your search!",
          "Click on a search result to view the file contents in DataSleuth",
          "Dividers can be dragged left and right to resize panels"
        ]
      }
    },

    computed: {
      ...mapGetters([
        'getArrUserInfo',
        'getNewAppStatus'
      ])
    },

    beforeMount() {
      if (this.$store.getters.getSignedIn) {
        this.$router.push('Search');
      }
    },

    mounted() {
      this.isSignedIn = this.$store.getters.getSignedIn;
      this.shuffleArray();
    },

    methods: {
      showReEnterMasterPass() {
        this.displayMasterPwInput = !this.displayMasterPwInput;
      },

      signInThisUser() {
        this.$router.push('Search');
        this.$store.commit('setSignedIn', true);
      },

      showSignIn() {
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

      showPopup() {
        this.displayDeleteCheck = !this.displayDeleteCheck;
      },

      updateSelectedUser(user) {
        this.selectedUser = user;
      },

      onUserCardRightClick(event) {
        this.$refs.deleteOption.show(event);
      },
      shuffleArray() {
        this.tips = _.shuffle(this.tips)
      },
    }
  }
</script>

<style scoped>
  .page {
    width: 100%;
    height: 100vh;
    display: grid;
    grid-template-columns: 1fr 4fr 1fr;
    grid-template-rows: 1fr 3fr 1fr 2fr;
    background-image: url('../assets/backgrounds/Background_resize_vector.svg');
    background-repeat: no-repeat;
    background-size: cover;
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

  #tips-span {
    font-style: italic;
    grid-row-start: 3;
    grid-column-start: 2;
    display: flex;
    flex-direction: row;
    justify-content: center;
    flex-wrap: wrap;
    padding-top: 2vh;
  }
</style>