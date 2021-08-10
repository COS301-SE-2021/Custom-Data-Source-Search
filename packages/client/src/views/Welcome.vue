<template >
  <div class="page">
    <div class="heading-and-info">
      <h1 class="header">Who's Sleuthing ?</h1>
      <p class="description"> Select the user you would like to sign in as</p>
    </div>
    <div class="user-select" >
      <UserCard v-for="(user, i) in users" :key="i" :userDetails="user" ></UserCard>

      <AddUserCard></AddUserCard>
    </div>

    <div class="lower">
      <Button class="p-button-text start-backend" label="Start Local Backend" icon="pi pi-home" @click="startLocalBackend" />
    </div>

  </div>


</template>

<script>
import UserCard from "@/components/users/UserCard";
import AddUserCard from "@/components/users/AddUserCard";
const electron = require('@electron/remote');
export default {
  name: "Welcome",
  components: {AddUserCard, UserCard},
  data () {
    return {
      isSignedIn: true,
      users : [
        {name : "Josh", email: "joshwalkerdev@gmail.com", isActive: true},
        {name : "Lauren", email: "lauren@gmail.com", isActive: false},
        {name : "Marike", email: "marike@gmail.com", isActive: true}
      ]
    }

  },
  methods: {
    startLocalBackend(){

      const {exec} = require("child_process");

      console.log("Executing command");

      //log Current Working Directory
      console.log(process.cwd())

      //Windows .bat files require a spawned shell to be ran
      //Implementation differs between Windows and Linux
      if(process.platform === "win32"){

        let spawn = require("child_process").spawn;

        let bat = spawn("cmd.exe", ["/c", "sleuthstart.bat"],
            {cwd : process.cwd() + "\\resources\\res\\local_backend\\dataSleuthWindows\\bin" })

        bat.stdout.on("data", (data) => {
          console.log(data.toString());
        });

        bat.stderr.on("data", (data) => {
          console.log(data.toString());
        });

        bat.on("exit", (code) => {
          console.log(code);
        });

      }else {

        exec("bash sleuthstart.sh", {cwd : process.cwd() + "\\resources\\res\\local_backend\\dataSleuthLinux\\bin"}
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
        })

      }


      /*
      exec("cd resources/res/local_backend/dataSleuthWindows/bin", (error, stdout, stderr) => {
        if (error) {
          console.log(`error: ${error.message}`);
          return;
        }
        if (stderr) {
          console.log(`stderr: ${stderr}`);
          return;
        }
        console.log(`stdout: ${stdout}`);
      })

*/

      /*
      exec("cd", (error, stdout, stderr) => {
        if (error) {
          console.log(`error: ${error.message}`);
          return;
        }
        if (stderr) {
          console.log(`stderr: ${stderr}`);
          return;
        }
        console.log(`stdout: ${stdout}`);
      })

      /*
      exec("start sleuthstart.bat", (error, stdout, stderr) => {
        if (error) {
          console.log(`error: ${error.message}`);
          return;
        }
        if (stderr) {
          console.log(`stderr: ${stderr}`);
          return;
        }
        console.log(`stdout: ${stdout}`);
      })


       */


    }

  },
  mounted(){
    this.isSignedIn = this.$store.getters.getSignedIn;
  }
}
</script>

<style scoped>

.page {
  width: 100%;
  height: 100%;
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