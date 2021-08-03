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
                <backend-card/>
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
                checked: false
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