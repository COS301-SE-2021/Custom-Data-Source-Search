<template>
    <div class="user-information">
        <div>
            User Name:
        </div>
        <div style="text-align: right">
            {{ getUserInfo(userIndex).name }}
        </div>
        <div>
            Master Email:
        </div>
        <div style="text-align: right">
            {{ getUserInfo(userIndex).email }}
        </div>
    </div>
</template>

<script>
    import {mapGetters} from "vuex";
    export default {
        name: "UserInfoCard",
        props: {
          userIndex: {
              type: Number,
              default: null
          }
        },
        computed: {
            ...mapGetters ([
                'getUserInfo'
            ])
        }
    }
</script>

<style scoped>
    .user-information {
        max-width: 600px;
        margin-top: 0.5%;
        display: grid;
        grid-template-columns: 1fr 1fr;
        grid-template-rows: 1fr 1fr;
        row-gap: 30%;
    }

    .user-information div {
            border-bottom: solid rgba(128, 128, 128, 0.28) 1px;
    }
</style>