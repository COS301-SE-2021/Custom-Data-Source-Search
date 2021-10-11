<template>
  <div class="backends-box">
    <Toast position="bottom-right"/>
    <div class="backends-heading">
      <span><h1>Backends</h1></span>
      <p class="backends-description">
        Manage Backends
      </p>
    </div>
    <div class="info-div">
      <span><strong>Personal Information</strong></span>
      <div>
        <user-info-card :user-index="getSignedInUserId"/>
      </div>
      <br>
    </div>
    <div class="info-div">
      <div class="backends-subheading">
        <span><strong>Backends</strong></span>
        <Button @click="newBackend" style="float: right" class="p-button p-button-outlined">Add Backend</Button>
      </div>
      <div>
        <AddBackendCard
            v-if="newBackendBool"
            :new-backend="newBackendBool"
            :local="newBackendObject.local"
            :connect="newBackendObject.connect"
            :receive="newBackendObject.receive"
            @save-new-backend="saveNewBackend()"
            :user-index="getSignedInUserId"
        />
        <BackendCard
            v-for="(backend) in getUserBackends(getSignedInUserId)"
            :user-index="getSignedInUserId"
            :backend-index="backend.local.id"
            :local="backend.local"
            :connect="backend.connect"
            :receive="backend.receive"
            :key="backend.local.id"
        />
      </div>
    </div>
    <div class="info-div start-stop">
      <Button
          class="p-button-text start-backend p-button-plain inline"
          label="Start Local Backend"
          icon="pi pi-play"
          @click="startLocalBackend"
      />
      <Button
          class="p-button-text stop-backend p-button-plain inline"
          style="margin-left: 5em"
          label="Stop Local Backend"
          icon="pi pi-times"
          @click="stopLocalBackend"
      />
    </div>
  </div>
  <ReEnterMasterPassword
      :show="displayMasterPwInput"
      :header="'Enter Master Password'"
      :body="'We need to verify that it\'s you before we can add a new backend'"
      :vault="false"
      :user="noUserReq"
      :welcome-page="false"
      @action-to-Occur="newBackend"
  />
</template>

<script>
  import BackendCard from "../components/backends/BackendCard";
  import UserInfoCard from "../components/backends/BackendPageUserInfo";
  import {mapGetters} from "vuex";
  import AddBackendCard from "../components/backends/BackendCardAdd";
  import ReEnterMasterPassword from "../components/popups/ReEnterMasterPassword";

  export default {
        name: "SettingsPage",

        components: {
            ReEnterMasterPassword,
            AddBackendCard,
            UserInfoCard,
            BackendCard
        },

        data() {
            return {
                noUserReq: null,
                displayMasterPwInput: false,
                newBackendBool: false,
                startIcon: 'pi pi-play',
                stopIcon: 'pi pi-times',
                spinnerIcon: 'pi pi-spin pi-spinner',

                newBackendObject: {

                    local: {
                        name: 'New Backend',
                        active: false,
                    },

                    connect: {
                        keys: {
                            secretPair: null,
                            sessionKey: null,
                            refreshKey: null
                        },
                        link: '',
                        associatedEmail: ''
                    },

                    receive: {
                        admin: false,
                        connected: false
                    }
                },
            }
        },

        computed: {
            ...mapGetters([
                'getUserBackends',
                'getSignedInUserId',
            ])
        },

        beforeMount() {
            if (this.$store.getters.getNewAppStatus) {
                this.$router.push('/');
            }
        },

        methods: {
            showMasterPwInput() {
                this.displayMasterPwInput = !this.displayMasterPwInput;
            },
            newBackend() {
                if (this.$store.getters.getMasterKey != null) {
                    this.newBackendBool = !this.newBackendBool;
                } else {
                    this.showMasterPwInput();
                }
            },
            saveNewBackend() {
                this.newBackendBool = false;
            },
            startLocalBackend() {
                console.log("Starting Backend");
                //log Current Working Directory
                console.log(process.cwd());
                //Windows .bat files require a spawned shell to be ran
                //Implementation differs between Windows and Linux
                if (process.platform === "win32") {
                    let spawn = require("child_process").spawn;
                    //
                    this.execProcess = spawn("cmd.exe", ["/c", "sleuthstart.bat"], {
                      cwd: process.cwd() + "\\resources\\res\\local_backend\\dataSleuthWindows\\bin"
                    });
                    this.execProcess.on('error', (err) => {
                        if (err.toString().includes("Error: spawn cmd.exe")) {
                            this.$toast.add({
                                severity: 'error',
                                summary: 'Error',
                                detail: "Could not start local backend",
                                life: 3000
                            })
                        }
                    });

                    //
                    this.execProcess.stdout.on("data", (data) => {
                        console.log(data.toString());
                        //On confirmation of server running
                        if (data.toString().includes("Listening on port 3001")) {
                            this.$toast.add({
                                severity: 'success',
                                summary: 'Success',
                                detail: "You can now search files on your Computer.",
                                life: 3000
                            });
                        }
                    });

                    //
                    this.execProcess.stderr.on("data", (data) => {
                        console.log(data.toString());
                    });
                    this.execProcess.on("exit", (code) => {
                        console.log("Exec Child exits with: " + code);
                        this.$toast.add({
                            severity: 'success',
                            summary: 'Success',
                            detail: "The Local Backend has been stopped.",
                            life: 3000
                        });
                    });
                    //Linux and macOS implementation
                } else {
                    const {exec} = require("child_process");
                    this.execProcess = exec("bash sleuthstart.sh", {cwd: process.cwd() + "\\resources\\res\\local_backend\\dataSleuthLinux\\bin"}
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
                                if (stdout.includes("Listening on port 3001")) {
                                    this.$toast.add({
                                        severity: 'success',
                                        summary: 'Success',
                                        detail: "You can now search files on your Computer.",
                                        life: 3000
                                    });
                                }
                            }
                        })
                }
            },
            stopLocalBackend() {
                const kill = require('kill-port');
                console.log("Stopping Local Backend");
                //log Current Working Directory
                console.log(process.cwd());
                //Windows .bat files require a spawned shell to be ran
                //Implementation differs between Windows and Linux
                if (process.platform === "win32") {
                    let spawn = require("child_process").spawn;

                    this.stopProcess = spawn("cmd.exe", ["/c", "sleuthstop.bat"],
                        {cwd: process.cwd() + "\\resources\\res\\local_backend\\dataSleuthWindows\\bin"});
                    this.stopProcess.stdout.on("data", (data) => {
                        console.log(data.toString());
                    });

                    this.stopProcess.on('error', (err) => {
                        if (err.toString().includes("Error: spawn cmd.exe")) {
                            this.$toast.add({
                              severity: 'error',
                              summary: 'Error',
                              detail: "Could not stop local backend",
                              life: 3000
                            })
                        }
                    });

                    this.stopProcess.stderr.on("data", (data) => {
                        console.log(data.toString());
                    });

                    this.stopProcess.on("exit", (code) => {
                        console.log("Shutdown Script Finishes");
                        kill(3001).then(() => {
                            console.log("Port has been killed");
                            console.log("Exit child exits with : " + code);
                        })
                    });
                } else {
                    const {exec} = require("child_process");
                    this.stopProcess = exec("bash sleuthstop.sh", {
                        cwd: process.cwd() + "\\resources\\res\\local_backend\\dataSleuthLinux\\bin"
                            }
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
                                kill(3001).then(() => {
                                    console.log("Port has been killed");
                                    console.log("Exit child exits with : " + code);
                                })
                            })
                }
            }
        }
    }

</script>

<style scoped>

  .backends-box {
    padding-left: 1%;
    height: 100vh;
  }

  .backends-heading {
    text-align: center;
    color: #ededed;
  }

  .backends-description {
    text-align: center;
    color: #ededed;
  }

  .info-div {
    padding: 20px;
  }

  .backends-subheading {
    max-width: 600px;
    padding-bottom: 20px;
  }

  strong {
    font-size: larger;
  }

  Button {
    float: right;
    max-height: 30px;
    text-align: center;
    max-width: fit-content;
  }

  .inline {
    margin-left: 2em !important;
  }

  .start-stop {
    width: 100%;
    position: fixed;
    margin-left: 40px;
  }

  .inline {
    float: left;
    margin-left: 10%;
  }
</style>