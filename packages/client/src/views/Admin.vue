<template>
  <div class="page">
    <div class="admin-header">
      <h1 class="admin-heading"> User Administration</h1>
      <p class="admin-description"> Select a backend to manage users for.</p>
    </div>
    <div v-for="(backend) in getUserRemoteBackends" class="admin-select" >
      <AdminBackendCard
          v-if="datasourceAdminStatus(backend.local.id)!=='viewer' && datasourceAdminStatus(backend.local.id)!=='editor'"
          :backend="backend"
      />
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
    display: grid;
    grid-template-rows: 1fr 3fr 1fr;
  }

  .admin-header {
    grid-row-start: 1;
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
    grid-row-start: 2;
    display: flex;
    flex-direction: column;
    justify-content: center;
    flex-wrap: wrap;
    padding-top: 1vw;
    align-content: center;
  }

</style>