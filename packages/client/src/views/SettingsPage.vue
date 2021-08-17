<template>
    <div class="settings-box">
        <div class="info-div">
            <span><h1>Settings</h1></span>
        </div>
        <div class="info-div">
            <span><strong>Personal Information</strong></span>
            <div>
                <user-info-card :user-index="getSignedInUserId"/>
            </div>
            <div>

            </div>
        </div>
        <div class="info-div">
            <div class="settings-subheading">
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
                <backend-card
                        v-for="(backend) in getUserBackend(getSignedInUserId)"
                        :user-index="getSignedInUserId"
                        :backend-index="backend.local.id"
                        :local = backend.local
                        :connect = backend.connect
                        :receive = backend.receive
                        :key="backend.local.id"
                />
            </div>
        </div>
    </div>
   <ReEnterMasterPassword
           :show="displayMasterPwInput"
           @new-backend="newBackend"
   />
</template>

<script>
    import BackendCard from "../components/settingsInfo/backendCard";
    import UserInfoCard from "../components/settingsInfo/userInfoCard";
    import {mapGetters} from "vuex";
    import AddBackendCard from "../components/settingsInfo/AddBackendCard";
    import ReEnterMasterPassword from "../components/popups/ReEnterMasterPassword";

    export default {
        components: {
            ReEnterMasterPassword,
            AddBackendCard,
            UserInfoCard,
            BackendCard
        },
        data () {
            return {
                displayMasterPwInput: false,
                newBackendBool: false,
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
        name: "SettingsPage",
        beforeMount() {
            if (this.$store.getters.getNewAppStatus) {
                this.$router.push('/');
            }
        },
        methods: {
            showMasterPwInput(){
                this.displayMasterPwInput = !this.displayMasterPwInput
            },
            newBackend() {
                if (this.$store.getters.getMasterKey != null) {
                    this.newBackendBool = !this.newBackendBool;
                    console.log ("Was there a master key?");
                }
                else {
                    this.showMasterPwInput();
                }
            },
            saveNewBackend() {
                this.newBackendBool = false;
            },

        },
        computed: {
            ...mapGetters ([
                'getUserBackend',
                'getSignedInUserId'
             ])
        }
    }
</script>

<style scoped>

    .settings-box {
        padding-left: 1%;
        height: 100vh;
    }

    .info-div {
        padding: 20px;
    }

    .settings-subheading {
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

</style>