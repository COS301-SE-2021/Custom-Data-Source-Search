<template >
  <div class="page">
    <Toast position="bottom-left"/>
    <div class="heading-and-info">
      <h1 class="header">Who's Sleuthing?</h1>
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
      <span style="font-style: italic">Tip: {{tips[randomId]}}</span>
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
      randomId: null,
      items: [
        {label: 'Remove', icon: 'pi pi-trash', command: () => {
            // event.originalEvent: Browser event
            // event.item: Menuitem instance
            this.displayDeleteCheck = !this.displayDeleteCheck;
          }},
        {label: 'Sign Out', icon: 'pi pi-sign-out', command: () => {
            this.displaySignOutCheck = !this.displaySignOutCheck;
          }}
      ],
      tips: [
        "Want to fuzzy search? Place ~ at the end of your search!",
        "Click on a search result to view the file contents in DataSleuth",
        "Dividers can be dragged left and right to resize panels"
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
    getRandomNumber(min,max){
      return Math.floor(Math.random()*(max-min+1)+min);
    },
    // startLocalBackend(){
    //   console.log("Starting Backend");
    //
    //   //log Current Working Directory
    //   console.log(process.cwd());
    //
    //   //Windows .bat files require a spawned shell to be ran
    //   //Implementation differs between Windows and Linux
    //   if(process.platform === "win32"){
    //
    //     let spawn = require("child_process").spawn;
    //
    //     this.execProcess = spawn("cmd.exe", ["/c", "sleuthstart.bat"],
    //         {cwd : process.cwd() + "\\resources\\res\\local_backend\\dataSleuthWindows\\bin" });
    //
    //     this.execProcess.stdout.on("data", (data) => {
    //       console.log(data.toString());
    //
    //       //On confirmation of server running
    //       if(data.toString().includes("Listening on port 3001")){
    //         this.$toast.add({
    //           severity: 'success',
    //           summary: 'Success',
    //           detail: "You can now search files on your Computer.",
    //           life: 3000});
    //
    //       }
    //     });
    //
    //     this.execProcess.stderr.on("data", (data) => {
    //       console.log(data.toString());
    //     });
    //
    //     this.execProcess.on("exit", (code) => {
    //       console.log("Exec Child exits with: " + code);
    //
    //       this.$toast.add({
    //         severity: 'success',
    //         summary: 'Success',
    //         detail: "The Local Backend has been stopped.",
    //         life: 3000});
    //
    //     });
    //
    //     //Linux and macOS implementation
    //   }else {
    //
    //     const {exec} = require("child_process");
    //
    //     this.execProcess = exec("bash sleuthstart.sh", {cwd : process.cwd() + "\\resources\\res\\local_backend\\dataSleuthLinux\\bin"}
    //         , (error, stdout, stderr) => {
    //
    //       if (error) {
    //         console.log(`error: ${error.message}`);
    //
    //         return;
    //       }
    //       if (stderr) {
    //         console.log(`stderr: ${stderr}`);
    //
    //         return;
    //       }
    //
    //       if (stdout) {
    //         console.log(`stdout: ${stdout}`);
    //
    //         if(stdout.includes("Listening on port 3001")){
    //
    //           this.$toast.add({
    //             severity: 'success',
    //             summary: 'Success',
    //             detail: "You can now search files on your Computer.",
    //             life: 3000});
    //
    //         }
    //       }
    //
    //     })
    //
    //   }
    // },
    // stopLocalBackend(){
    //
    //   const kill = require('kill-port');
    //
    //   console.log("Stopping Local Backend");
    //
    //   //log Current Working Directory
    //   console.log(process.cwd());
    //
    //   //Windows .bat files require a spawned shell to be ran
    //   //Implementation differs between Windows and Linux
    //   if(process.platform === "win32"){
    //
    //     let spawn = require("child_process").spawn;
    //
    //     this.stopProcess = spawn("cmd.exe", ["/c", "sleuthstop.bat"],
    //         {cwd : process.cwd() + "\\resources\\res\\local_backend\\dataSleuthWindows\\bin" });
    //
    //     this.stopProcess.stdout.on("data", (data) => {
    //       console.log(data.toString());
    //     });
    //
    //     this.stopProcess.stderr.on("data", (data) => {
    //       console.log(data.toString());
    //     });
    //
    //     this.stopProcess.on("exit", (code) => {
    //
    //       console.log("Shutdown Script Finishes");
    //
    //       kill(3001).then( () => {
    //
    //         console.log("Port has been killed");
    //         console.log("Exit child exits with : " + code);
    //       })
    //
    //     });
    //
    //   }else {
    //
    //     const {exec} = require("child_process");
    //
    //     this.stopProcess = exec("bash sleuthstop.sh", {cwd : process.cwd() + "\\resources\\res\\local_backend\\dataSleuthLinux\\bin"}
    //         , (error, stdout, stderr) => {
    //
    //           if (error) {
    //             console.log(`error: ${error.message}`);
    //             return;
    //           }
    //           if (stderr) {
    //             console.log(`stderr: ${stderr}`);
    //             return;
    //           }
    //           console.log(`stdout: ${stdout}`);
    //
    //           console.log("Shutdown Script Finishes");
    //
    //           kill(3001).then( () => {
    //
    //             console.log("Port has been killed");
    //             console.log("Exit child exits with : " + code);
    //           })
    //         })
    //
    //   }
    //
    // }

  },
  mounted () {
    this.isSignedIn = this.$store.getters.getSignedIn;
    this.randomId = this.getRandomNumber(0, this.tips.length-1);
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

</style>