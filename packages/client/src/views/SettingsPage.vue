<template>
    <div class="settings-box">
        <div class="info-div">
            <span><h1>Settings</h1></span>
        </div>
        <div class="info-div">
            <span><b>Personal Information</b></span>
            <div>
                <user-info-card :user-index="userIndex"/>
            </div>
        </div>
        <div class="info-div">
            <div class="settings-subheading">
                <span><b>Backends</b></span>
                <Button @click="newBackend" style="float: right" class="p-button p-button-outlined">Add Backend</Button>
            </div>
            <div>
                <backend-card v-if="newBackendBool" :new-backend="true" :fed-in-backend="newBackendObject" />
                <backend-card v-for="(backend, i) in getUserBackend(userIndex)"
                        @update-backend="updateBackend()"
                        :user-index="userIndex"
                        :fed-in-backend="backend"
                        :key="i"
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
                    name: '',
                    active: false,
                    link: '',
                    passKey: ''
                },
                userIndex: 0
            }
        },
        name: "SettingsPage",
        methods: {
            updateBackend ( newInfo ) {
                this.testBackend = newInfo;
            },
            newBackend() {
                this.newBackendBool = !this.newBackendBool;
                // console.log ( "Backend array size: " + getUserBackendSize(this.userIndex));
                console.log ("New backend bool value: " + this.newBackendBool);
                // console.log("This is the user's backends: " + this.$store.state.users[this.testBackend.userIndex].backends[this.testBackend.backendIndex]);
            }
        },
        computed: {
            getUserBackendSize () {
                return this.$store.getters.getUserBackendSize();
            },
            ...mapGetters ([
                'getUserBackend',
                'getUserBackendSize'
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

    b {
        font-size: larger;
    }

    Button {
        float: right;
        max-height: 30px;
        text-align: center;
        max-width: fit-content;
    }

</style>