<template>
    <div class="backend-info-card">
        <Toast position="top-right"/>
        <div class="backend-info-sum">
            <div class="minimised-backend-info" >
                <div style="cursor: pointer" @click="change">
                  <span v-if="backendIndex===0">
                    <em v-if="localActive"  :style="connectedStyle" class="pi pi-circle-on" />
                    <em v-else class="pi pi-circle-off" />
                  </span>
                  <span v-else>
                    <em v-if="!connect.needsLogin"  :style="connectedStyle" class="pi pi-circle-on" />
                    <em v-if="connect.needsLogin" class="pi pi-circle-off" />
                  </span>
                    <span> {{local.name}} </span>
                    <span
                        v-if="receive.admin"
                        style="float: right; padding-top: 3px"
                    >
                        {{getUserAdminStatus(backendIndex)}}
                    </span>
                </div>
                <div>
                    <InputSwitch id="inputswitch" style="float: right; margin-top: 3px"  v-model="local.active"/>
                </div>
            </div>
                <div class="expanded-backend-info" v-if="expand" :style="localBackendStyle" >
                <div><em>Email: </em></div>
                <div> {{ connect.associatedEmail }} </div>
                  <div v-if="localBackendBool"></div>
                <div><em>Link: </em></div>
                <div> {{connect.link}} </div>
                <div></div>
                <div v-if="!localBackendBool" >
                    <Button
                        label="Delete"
                        class="p-button-text p-button-danger confirmation-button"
                        @click="showBackendDeleteCheck"
                    />
                    <Button
                        label="Edit"
                        class="p-button-text p-button-plain confirmation-button"
                        @click="editBackend"
                    />
                </div>
                  <Accordion id="cli-info-accordion" v-if="localBackendBool">
                    <AccordionTab v-for="tab in tabs" :key="tab.title" :header="tab.title">
                      <p>{{tab.content}}</p>
                    </AccordionTab>
                  </Accordion>
                  <Button
                      v-if="backendIndex === 0 && !localActive && !startingLocal"
                      id="start-local-backend"
                      class="p-button-text p-button-plain"
                      label="Start"
                      icon="pi pi-play"
                      @click="startLocalBackend"
                  />
                  <Button
                      v-else-if="backendIndex === 0 && !localActive && startingLocal"
                      id="starting-local-backend"
                      class="p-button-text p-button-plain"
                      label="Starting..."
                      icon="pi pi-spin pi-spinner"
                      @click="startLocalBackend"
                  />
                  <Button
                      v-else-if="backendIndex === 0 && localActive && !stoppingLocal"
                      id="stop-local-backend"
                      class="p-button-text p-button-plain"
                      label="Stop"
                      icon="pi pi-times"
                      @click="stopLocalBackend"
                  />
                  <Button
                      v-else-if="backendIndex === 0 && localActive && stoppingLocal"
                      id="stopping-local-backend"
                      class="p-button-text p-button-plain"
                      label="Stopping..."
                      icon="pi pi-spin pi-spinner"
                      @click="stopLocalBackend"
                  />
            </div>
            <div class="edit-backend-info expanded-backend-info" v-if="editBackendBool">
                <div><em>Name: </em></div>
                <input-text v-model="tempBackendInfo.name" @keyup.enter="saveChanges"/>
                <div><em>Email: </em></div>
                <div>{{tempBackendInfo.associatedEmail}}</div>
                <div><em>Link: </em></div>
                <div>{{tempBackendInfo.link}}</div>
                <div></div>
                <div>
                    <Button
                        type="button"
                        style="float: right"
                        @click="saveChanges"
                        class="p-button-text"
                    >
                        Save
                    </Button>
                    <Button
                        label="Cancel"
                        @click="cancelChanges"
                        style="float: right"
                        class="p-button-text p-button-plain"
                    />

                </div>
            </div>
        </div>
    </div>
    <BackendDeleteCheck
            :show="displayBackendDeleteCheck"
            @display-popup="showBackendDeleteCheck"
            :backend="local"
            @delete-backend="deleteBackend"
    />
</template>

<script>
    import InputSwitch from 'primevue/inputswitch';
    import {mapGetters} from 'vuex';
    import BackendDeleteCheck from "../popups/BackendDeleteCheck";

    export default {
        name: "backendCard",
        components: {
            BackendDeleteCheck,
            InputSwitch
        },
        data () {
            return {
              tabs: [
                {title: 'Title 1', content: 'Content 1'},
              ],
                localActive: false,
                startingLocal: false,
                stoppingLocal: false,
                localBackendBool: false,
                displayBackendDeleteCheck: false,
                tempNameNo: 0,
                checked: false,
                editBackendBool: false,
                expand: false,
                newBackendT: null,
                tempBackendInfo: {
                    id: null,
                    name: '',
                    active: false,

                    link: '',
                    passKey: '',
                    associatedEmail: '',

                    admin: null
                }
            }
        },
        computed: {
            ...mapGetters([
                'getSignedInUserId',
                'getUserAdminStatus'
            ]),
            connectedStyle () {
                return 'color: rgba(197, 225, 165, 0.68)';
            },
            localBackendStyle () {
                if (this.localBackendBool) {
                    return "grid-row-gap: 10px"
                }
            }
        },
        props: {
          userIndex: {
              type: Number,
              default: null
          },
          backendIndex: {
              type: Number,
              default: null
          },
          newBackend: {
              type: Boolean,
              default: false
          },

          local: {
              id: Number,
              name: String,
              active: Boolean,
              color: String
          },
          connect: {
              associatedEmail: String,
              link: String,
              passKey: String,
              needsLogin: Boolean
          },
          receive: {
              admin: Boolean,
              connected: Boolean
          }
        },
        mounted() {
            this.setTempVars();

            if (this.newBackend) {
                this.editBackendBool = true;
                this.expand = false;
            }
        },

        methods: {
          showBackendDeleteCheck() {
              this.displayBackendDeleteCheck = !this.displayBackendDeleteCheck;
          },

          //View changes
          change() {
            if (!this.newBackend) {
                this.expand = !this.expand;
                if (this.editBackendBool) {
                    this.editBackendBool = false;
                    this.expand = false;
                }
            }
          },
          editBackend() {
              this.setTempVars();
              this.expand = !this.expand;
              this.editBackendBool = !this.editBackendBool;
          },
          saveChanges() {
              this.expand = true;
              this.editBackendBool = false;

              //Operations changing store
              if(this.newBackend) {

                  this.$store.commit("addBackend", {
                      userIndex: this.userIndex,
                      name: this.tempBackendInfo.name,
                      link: this.tempBackendInfo.link,
                      passKey: this.tempBackendInfo.passKey,
                      associatedEmail: this.tempBackendInfo.associatedEmail,
                      active: this.tempBackendInfo.active,
                  });

                  this.$emit('saveNewBackend');
              }
              else {
                  this.$store.commit("editBackend", {
                      userIndex: this.userIndex,
                      backendIndex: this.backendIndex,
                      name: this.tempBackendInfo.name,
                      link: this.tempBackendInfo.link,
                      passKey: this.tempBackendInfo.passKey,
                      associatedEmail: this.tempBackendInfo.associatedEmail,
                      admin: this.tempBackendInfo.admin,
                      active: this.tempBackendInfo.active
                  });
              }
              this.setTempVars();
          },
          cancelChanges() {
              this.expand = true;
              this.editBackendBool = false;
              if (this.newBackend) {
                  this.$emit('saveNewBackend');
              }
          },

          deleteBackend() {
              this.expand = false;
              this.editBackendBool = false;
              this.$store.commit("deleteBackend", this.backendIndex);
              this.setTempVars();

          },
          connectToBackend() {
              this.tempBackendInfo.admin = true;
              this.saveChanges();
              this.tempNameNo = this.tempNameNo + 1;
          },

          setTempVars() {
              if (!this.newBackend) {
                  this.tempBackendInfo.name = this.local.name;
              }
              if (this.local.name === 'Local') {
                  this.localBackendBool = true;
              }
              this.tempBackendInfo.id = this.local.id;
              this.tempBackendInfo.active = this.local.active;

              this.tempBackendInfo.associatedEmail = this.connect.associatedEmail;
              this.tempBackendInfo.link = this.connect.link;
              this.tempBackendInfo.sessionKey = this.connect.keys.sessionKey;

             this.tempBackendInfo.admin = this.receive.admin;
             this.newBackendT = this.newBackend;
          },

          stopLocalBackend() {
            this.stoppingLocal = true;
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
              this.stopProcess = exec("bash sleuthstop.sh", {cwd: process.cwd() + "\\resources\\res\\local_backend\\dataSleuthLinux\\bin"}
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
            this.stoppingLocal = false;
          },

          startLocalBackend() {
            this.startingLocal = true;
            console.log("Starting Backend");
            //log Current Working Directory
            console.log(process.cwd());
            //Windows .bat files require a spawned shell to be ran
            //Implementation differs between Windows and Linux
            if (process.platform === "win32") {
              let spawn = require("child_process").spawn;

              this.execProcess = spawn("cmd.exe", ["/c", "sleuthstart.bat"],
                  {cwd: process.cwd() + "\\resources\\res\\local_backend\\dataSleuthWindows\\bin"});

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
            this.startingLocal = false;
          }
        }
    }
</script>

<style scoped>
    .backend-info-card {
        margin-top: 5px;
        padding: 5px;
        border: solid 1px #363636;
        border-radius: 5px;
        max-width: 600px;
    }

    .minimised-backend-info:hover {
      background-color: rgba(255,255,255, 0.07);
    }
    .expanded-backend-info {
        border-radius: 5px;
        margin-top: 1em;
        padding-top: 4px;
        padding-left: 4px;
        padding-bottom: 4px;
        display: grid;
        grid-template-columns: 1fr 3fr;
        grid-template-rows: 1fr 1fr 1fr;
        align-content: baseline;
    }

    .expanded-backend-info div {
        max-height: 180px;
    }

    .pi-circle-on, .pi-circle-off {
        padding-top: 2px;
        padding-bottom: 2px;
    }

    input {
        margin-right: 2%;
        margin-bottom: 1em;
    }

    Button {
        float: right;
        max-height: 30px;
        text-align: center;
        margin-right: 2%;
        margin-top: 1%;
        max-width: fit-content;
    }

    span {
        padding-left: 10px;
    }

    .minimised-backend-info {
        height: 30px;
        padding-top: 4px;
        padding-left: 4px;
        background-color: rgba(189, 189, 189, 0.05);
        display: grid;
        grid-template-columns: 5fr 1fr;
    }

    .confirmation-button {
        float: right;
    }

    #start-local-backend{
      grid-column-start: 3;
      float: right;
      color: rgba(197, 225, 165, 0.68);
    }

    #stop-local-backend{
      grid-column-start: 3;
      float: right;
      color: #EF9A9A;
    }

    #cli-info-accordion{
      grid-column-start: 1;
      grid-column-end: 3;
    }
</style>