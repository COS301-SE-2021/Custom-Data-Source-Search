<template>
  <div class="page">
    <div class="admin-header">
      <h1 class="admin-heading"> User Administration</h1>
      <p class="admin-description"> Select a backend to manage users for.</p>
    </div>
    <div class="container">
      <div v-for="(backend) in getUserRemoteBackends" class="admin-select" >
        <AdminBackendCard
            v-if="datasourceAdminStatus(backend.local.id)!=='viewer' && datasourceAdminStatus(backend.local.id)!=='editoFr'"
            :backend="backend"
        />
      </div>
    </div>
  </div>
</template>

<script>
  import AdminBackendCard from "@/components/admin/AdminBackendCard";
  import {mapGetters} from "vuex";
  import BackendCard from "@/components/backends/BackendCard";

  export default {
    name: "Admin",

    components: {BackendCard, AdminBackendCard},

    data() {
      return {
        displayAdminPopup: false
      }
    },

    computed: {
      ...mapGetters([
        'getUserInfo',
        'getUserBackends',
        'getSignedInUserId',
        'getUserAdminStatus',
        'getUserRemoteBackends'
      ])
    },

    methods: {
      showAdminPopup() {
        this.displayAdminPopup = !this.displayAdminPopup
      },
      showBackendManager() {
        this.$router.push({name: 'BackendManager', params: {}});
      },
      datasourceAdminStatus(source) {
          return this.$store.getters.getUserAdminStatus(source);
      },
    }
  }
</script>

<style scoped>

  .page {
    width: 100%;
    height: 100%;
  }

  .admin-heading {
    text-align: center;
    color: #ededed;
  }

  .admin-description {
    text-align: center;
    color: #ededed;
  }

  .admin-select {
    display: inline-block;
    flex-direction: column;
    flex-wrap: wrap;
    padding-top: 1vw;
    align-content: center;
    margin-right: 5vw;
  }

  .container{
    margin-top: 10vh;
    margin-left: 5%;
    text-align: center;
  }
</style>