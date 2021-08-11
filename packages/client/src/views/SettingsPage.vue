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
        </div>
        <div class="info-div">
            <div class="settings-subheading">
                <span><strong>Backends</strong></span>
                <Button @click="newBackend" style="float: right" class="p-button p-button-outlined">Add Backend</Button>
            </div>
            <div>
                <backend-card
                        v-if="newBackendBool"
                        :new-backend="newBackendBool"
                        :fed-in-backend="newBackendObject"
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
</template>

<script>
    import BackendCard from "../components/settingsInfo/backendCard";
    import UserInfoCard from "../components/settingsInfo/userInfoCard";
    import {mapGetters} from "vuex";

    export default {
        components: {
            UserInfoCard,
            BackendCard
        },
        data () {
            return {
                newBackendBool: false,
                newBackendObject: {
                    local: {
                        name: 'New Backend',
                        active: false
                    },
                    connected: {
                        link: '',
                        passKey: ''
                    },
                    receive: {
                        admin: false,
                        connected: false
                    }
                },
            }
        },
        name: "SettingsPage",
        methods: {
            newBackend() {
                this.newBackendBool = !this.newBackendBool;
                console.log ("New backend bool value: " + this.newBackendBool);
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