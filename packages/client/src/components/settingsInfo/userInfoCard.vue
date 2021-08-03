<template>
    <div class="user-information">
        <div>
            User Name:
        </div>
        <div>
        </div>
        <div>
            Master Email:
        </div>
        <div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "userInfoCard",
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
                userName: '',
                masterEmail: ''
            }
        },
        created() {
            localStorage.setItem('user', JSON.stringify(this.testUser));
            this.testLocalStorage = JSON.parse(localStorage.getItem('user'));
            this.userName = this.testLocalStorage.userName;
            this.userEmail = this.testLocalStorage.userEmail;
        },
        methods: {

        }
    }
</script>

<style scoped>
    .user-information {
        display: grid;
        grid-template-columns: 1fr 1fr;
        grid-template-rows: 1fr 1fr;
    }
</style>