<template>
    <div class="registration-grid">
        <div class="registration-box">
            <div style="font-size: xx-large; padding-top: 10%; color: #f9f6ee">
                REGISTER
            </div>
            <InputText tpye="text" v-model="userName" label="Name" placeholder="Name" />
            <InputText type="text" v-model="masterEmail" label="Email" placeholder="Email" />
            <InputText type="password" v-model="masterPassword" lebel="MasterPass" placeholder=" Master Password"/>
            <InputText type="password" v-model="masterPassCheck" label="RepeatMasterPass"  placeholder="Repeat Password" />
            <Password />
            <div id="checkboxBox">
                <input type="checkbox" id="checkbox" v-model="keepSignedIn">
                <label for="checkbox">Remember me</label>
            </div>
            <div style="text-align: left; vertical-align: center">
               <span>Already have an account? </span> <u>Sign in</u>
                <Button @click="loadValues" icon="pi pi-arrow-circle-right"  class="p-button-lg p-button-outlined" />
            </div>
            <div>

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
    import InputText from 'primevue/inputtext'
    import Password from 'primevue/password'
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
            },
            checkUsers() {
                this.name = 'Toodles'
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
        grid-template-rows: 2fr 1fr 1fr 1fr 1fr 1fr 1fr 4fr;
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
        color: #41B3B2
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

    Button {
      float: right;
    }

    u {
        color: #41B3B2
    }



</style>