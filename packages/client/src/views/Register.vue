<template>
    <div class="registration-grid">
        <div class="registration-box">
            <div style="font-size: xx-large; padding-top: 10%">
                REGISTER
            </div>
            <input label="Name" class="input" placeholder="Name" />
            <input label="Email" class="input" placeholder="Email" />
            <input label="MasterPass" class="input" placeholder="Master Password" />
            <input label="RepeatMasterPass" class="input" placeholder="Repeat Password " />
            <div id="checkboxBox">
                <input type="checkbox" id="checkbox" v-model="checked">
                <label for="checkbox">Remember me</label>
            </div>
        </div>
        <div>
            <div class="logo-box">
                <div></div>
                <div id="imageInRegistrationBox"><img  id="imageInRegistration" src="../assets/search_logo.png" height="300" alt=""></div>
             </div>
        </div>
    </div>

</template>

<script>
    export default {
        name: "Register"
    }
</script>

<style scoped>

    .registration-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        height: 100%;
        padding-left: 5%;
        padding-right: 5%;
    }

    .registration-grid div {
        text-align: center;
        vertical-align: center;
    }

    .registration-box {
        display: grid;
        grid-template-rows: 2fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr;
        padding: 30px;
        margin: 4%;
        font-size: larger;
    }

    .logo-box {
        height: 100%;
        display: grid;
        grid-template-rows: 1fr 3fr 1fr;
        vertical-align: center;
    }

    #imageInRegistrationBox {
        text-align: center;
        justify-content: center;
        vertical-align: center;
    }

    #imageInRegistration {
        padding: 10px;
    }

    input::placeholder {
        color: #3d3d3d;
    }

    #checkboxBox {
        text-align: left;

    }

    #checkbox {
        height: 18px;
        width: 18px
    }

    label {
        padding: 2%
    }



</style>