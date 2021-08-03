<template>
    <div class="user-information">
        <div>
            User Name:
        </div>
        <div>
            {{ userName }}
        </div>
        <div>
            Master Email:
        </div>
        <div>
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
        margin-top: 0.5%;
        font-size: small;
        display: grid;
        grid-template-columns: 1fr 1fr;
        grid-template-rows: 1fr 1fr;
        row-gap: 20%;
    }
</style>