<template>
    <div class="settings-box">
        <div class="info-div">
            <span><b>Personal Information</b></span>
            <div>
                //User information
            </div>
        </div>
        <div class="info-div">
            <span><b>Backends</b></span>
            <div>
                //v-for all the backends information
            </div>
        </div>
        <InputSwitch v-model="checked" />
    </div>
</template>

<script>
    import InputSwitch from 'primevue/inputswitch'
    export default {
        components: {
            InputSwitch
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
        padding: 5px;
    }

    b {

    }

    .pi-circle-on {
      color: #41B3B2;
    }

    .info-div {
        padding: 5%;
    }

</style>