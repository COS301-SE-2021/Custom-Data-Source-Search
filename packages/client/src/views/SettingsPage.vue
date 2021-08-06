<template>
    <div class="settings-box">
        <div class="info-div">
            <span><h1>Settings</h1></span>
        </div>
        <div class="info-div">
            <span><b>Personal Information</b></span>
            <div>
                <user-info-card/>
            </div>
        </div>
        <div class="info-div">
            <div class="settings-subheading">
                <span><b>Backends</b></span>
                <Button @click="newBackend" style="float: right" class="p-button p-button-outlined">Add Backend</Button>
            </div>
            <div>
                <backend-card v-if="newBackendBool" :new-backend="true" :fed-in-backend="newBackendObject" />
                <backend-card v-for="(backend, i) in getUserBackend(1)"
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
                userIndex: 0,
                backendArr: [
                    {
                        name: 'Butterfly',
                        active: true,
                        link: 'www.random.com',
                        passKey: 'a;lseijrf489jeprlgk4n;powe89u'
                    },
                    {
                        name: 'LEGO',
                        active: false,
                        link: 'www.justAnotherExample/LEGO/BACKEND',
                        passKey: 'new84lLKJREpassKD9e7edfjKey'
                    },
                    {
                        name: 'Fluffy',
                        active: true,
                        link: 'www.fulffy&Bubbles/backend/link',
                        passKey: '_Funny_w489wdN_Pass_498Yuw9UE4ER89_Random_4REWGsfg'
                    }
                ]
            }
        },
        name: "SettingsPage",
        methods: {
            updateBackend ( newInfo ) {
                this.testBackend = newInfo;
            },
            newBackend() {
                this.newBackendBool = !this.newBackendBool;
                console.log ( "Backend array size: " + this.$store.getters.getUserBackendSize('0'));
                console.log ("New backend bool value: " + this.newBackendBool);
                // console.log("This is the user's backends: " + this.$store.state.users[this.testBackend.userIndex].backends[this.testBackend.backendIndex]);
            }
        },
        computed: {
            getUserBackend () {
                console.log(this.$store.getters.getUserBackend(0));
                return this.$store.getters.getUserBackend;
            }
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