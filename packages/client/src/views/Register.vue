<template>
    <div class="registration-grid">
        <div class="registration-box">
            <div style="font-size: xx-large; padding-top: 10%">
                REGISTER
            </div>
            <InputText tpye="text" v-model="userName" label="Name" placeholder="Name" />
            <InputText type="text" v-model="masterEmail" label="Email" placeholder="Email" />
            <Password placeholder="Password"/>
            <input v-model="masterPassword" label="MasterPass" class="input" placeholder="Master Password" type="password" />
            <input v-model="masterPassCheck" label="RepeatMasterPass" class="input" placeholder="Repeat Password" type="password" />
            <div id="checkboxBox">
                <input type="checkbox" id="checkbox" v-model="keepSignedIn">
                <label for="checkbox">Remember me</label>
            </div>
            <div style="text-align: left">
               <span>Already have an account?</span>
                <br><br>
                <a style="hover: #94D8CE"><u>Sign in</u></a>
            </div>
            <div>
                <button @click="loadValues"/>
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
    import Password from '../components/primeComponents/PasswordInputField';
    import InputText from 'primevue/inputtext';
    export default {
        name: "Register",
        components: {
          Password,
            InputText
        },
        data () {
            return {
                userName: '',
                keepSignedIn: true,
                masterEmail: '',
                masterPassword: '',
                masterPassCheck: ''
            }
        },
        methods: {
            loadValues() {
                console.log(this.userName),
                console.log(this.masterEmail),
                console.log(this.masterPassword),
                console.log(this.masterPassCheck),
                console.log(this.keepSignedIn)
            }
        }
    }
</script>

<style scoped>

    .registration-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        height: 100%;
        padding-left: 10%;
        padding-right: 10%;
    }

    .registration-grid div {
        text-align: center;
        vertical-align: center;
    }

    .registration-box {
        display: grid;
        grid-template-rows: 2fr 1fr 1fr 1fr 1fr 1fr 1fr 3fr;
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

    input #checkbox{
        width: 10px;
    }

    input::placeholder {
        color: #575757;
        font-weight: bold;
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