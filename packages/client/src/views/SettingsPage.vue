<template>
    <div class="settings-box">
        <div class="info-div">
            <span><h1>Settings</h1></span>
        </div>
        <div class="info-div">
            <span><b>Personal Information</b></span>
            <div>
                //User information
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
    export default {
        components: {
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

    b {

    }


    .info-div {
        padding: 20px;
    }

</style>