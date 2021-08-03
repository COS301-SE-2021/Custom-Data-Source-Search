<template>
    <div class="user-information">
        <div>
            User Name:
        </div>
        <div style="text-align: right">
            {{ userName }}
        </div>
        <div>
            Master Email:
        </div>
        <div style="text-align: right">
            {{ masterEmail}}
        </div>
    </div>
</template>

<script>
    export default {
        name: "UserInfoCard",
        data () {
            return {
                testUser: {
                    userName: 'Marike',
                    userEmail: 'example@funsail.co.za'
                },
                testLocalStorage: {
                  userName: '',
                  userEmail: ''
                },
                userName: 'x',
                masterEmail: 'y'
            }
        },
        mounted () {
            localStorage.setItem('user', JSON.stringify(this.testUser));
            this.testLocalStorage = JSON.parse(localStorage.getItem('user'));
            this.userName = this.testLocalStorage.userName;
            this.masterEmail = this.testLocalStorage.userEmail;
        }
    }
</script>

<style scoped>
    .user-information {
        max-width: 500px;
        margin-top: 0.5%;
        font-size: small;
        display: grid;
        grid-template-columns: 1fr 1fr;
        grid-template-rows: 1fr 1fr;
        row-gap: 30%;
    }

    .user-information div {
            border-bottom: solid rgba(128, 128, 128, 0.28) 1px;
    }
</style>