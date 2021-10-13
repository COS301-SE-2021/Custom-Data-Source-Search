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
        <ScrollPanel id="main-scroll" style="max-width: 600px; height: 50vh;">
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
        </ScrollPanel>
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
  
  @media only screen and (max-height: 605px) {
    #main-scroll{
      height: 40vh !important;
    }
  }

  @media only screen and (max-height: 480px) {
    #main-scroll{
      height: 30vh !important;
    }
  }
</style>