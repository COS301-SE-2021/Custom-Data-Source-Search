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
            <span><b>Backends</b></span>
            <div>
                <backend-card  :backend="testBackend"/>
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
                testBackend: {
                    active: true,
                    name: 'LEGO',
                //    color: 'Green',
                    link: 'www.linktoLegoBackend/156WqezhgHf',
                    passKey: '3w498thedfijvn234t098weyhf92iu4nt8y'
                }
            }
        },
        name: "SettingsPage"
    }
</script>

<style scoped>

    .settings-box {
        padding-left: 1%;
    }

    .info-div {
        padding: 20px;
    }

</style>