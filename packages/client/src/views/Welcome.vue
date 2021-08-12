<template >
  <div class="page">
    <Toast position="bottom-left"/>
    <div class="heading-and-info">
      <h1 class="header">Who's Sleuthing ?</h1>
      <p class="description"> Select the user you would like to sign in as</p>
    </div>
    <div class="user-select" >
      <UserCard
              v-for="(user, i) in getArrUserInfo"
              :key="i"
              :userDetails="user"
      ></UserCard>
      <AddUserCard></AddUserCard>
    </div>

    <div class="lower">
      <Button class="p-button-text start-backend p-button-plain" label="Start Local Backend" icon="pi pi-play" @click="startLocalBackend" />
      <Button class="p-button-text stop-backend p-button-plain" label="Stop Local Backend" icon="pi pi-times" @click="stopLocalBackend" />

    </div>

  </div>


</template>

<script>
import UserCard from "@/components/users/UserCard";
import AddUserCard from "@/components/users/AddUserCard";
const electron = require('@electron/remote');
import {mapGetters} from "vuex";

export default {
  name: "Welcome",
  components: {AddUserCard, UserCard},
  data () {
    return {
      isSignedIn: true,
      execProcess : null,
      stopProcess : null
    }

  },
  methods: {
    startLocalBackend(){
      console.log("Starting Backend");

      //log Current Working Directory
      console.log(process.cwd());

      //Windows .bat files require a spawned shell to be ran
      //Implementation differs between Windows and Linux
      if(process.platform === "win32"){

        let spawn = require("child_process").spawn;

        this.execProcess = spawn("cmd.exe", ["/c", "sleuthstart.bat"],
            {cwd : process.cwd() + "\\resources\\res\\local_backend\\dataSleuthWindows\\bin" });

        this.execProcess.stdout.on("data", (data) => {
          console.log(data.toString());

          //On confirmation of server running
          if(data.toString().includes("Listening on port 3001")){
            this.$toast.add({
              severity: 'success',
              summary: 'Success',
              detail: "You can now search files on your Computer.",
              life: 3000});

          }
        });

        this.execProcess.stderr.on("data", (data) => {
          console.log(data.toString());
        });

        this.execProcess.on("exit", (code) => {
          console.log("Exec Child exits with: " + code);

          this.$toast.add({
            severity: 'success',
            summary: 'Success',
            detail: "The Local Backend has been stopped.",
            life: 3000});

        });

        //Linux and macOS implementation
      }else {

        const {exec} = require("child_process");

        this.execProcess = exec("bash sleuthstart.sh", {cwd : process.cwd() + "\\resources\\res\\local_backend\\dataSleuthLinux\\bin"}
            , (error, stdout, stderr) => {

          if (error) {
            console.log(`error: ${error.message}`);

            return;
          }
          if (stderr) {
            console.log(`stderr: ${stderr}`);

            return;
          }

          if (stdout) {
            console.log(`stdout: ${stdout}`);

            if(stdout.includes("Listening on port 3001")){

              this.$toast.add({
                severity: 'success',
                summary: 'Success',
                detail: "You can now search files on your Computer.",
                life: 3000});

            }
          }

        })

      }
    },
    stopLocalBackend(){

      const kill = require('kill-port');

      console.log("Stopping Local Backend");

      //log Current Working Directory
      console.log(process.cwd());

      //Windows .bat files require a spawned shell to be ran
      //Implementation differs between Windows and Linux
      if(process.platform === "win32"){

        let spawn = require("child_process").spawn;

        this.stopProcess = spawn("cmd.exe", ["/c", "sleuthstop.bat"],
            {cwd : process.cwd() + "\\resources\\res\\local_backend\\dataSleuthWindows\\bin" });

        this.stopProcess.stdout.on("data", (data) => {
          console.log(data.toString());
        });

        this.stopProcess.stderr.on("data", (data) => {
          console.log(data.toString());
        });

        this.stopProcess.on("exit", (code) => {

          console.log("Shutdown Script Finishes");

          kill(3001).then( () => {

            console.log("Port has been killed");
            console.log("Exit child exits with : " + code);
          })

        });

      }else {

        const {exec} = require("child_process");

        this.stopProcess = exec("bash sleuthstop.sh", {cwd : process.cwd() + "\\resources\\res\\local_backend\\dataSleuthLinux\\bin"}
            , (error, stdout, stderr) => {

              if (error) {
                console.log(`error: ${error.message}`);
                return;
              }
              if (stderr) {
                console.log(`stderr: ${stderr}`);
                return;
              }
              console.log(`stdout: ${stdout}`);

              console.log("Shutdown Script Finishes");

              kill(3001).then( () => {

                console.log("Port has been killed");
                console.log("Exit child exits with : " + code);
              })
            })

      }

    }

  },
  mounted () {
    this.isSignedIn = this.$store.getters.getSignedIn;
  },
  computed: {
    ...mapGetters([
            'getArrUserInfo'
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

.lower {

  grid-row-start: 3;
  grid-column-start: 2;
  text-align: center;

}

.start-backend {

  margin: 5vh auto auto;
}

</style>