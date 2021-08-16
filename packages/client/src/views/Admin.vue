<template>

  <div class="page">

    <div class="admin-header">

      <h1 class="admin-heading"> User Administration</h1>
      <p class="admin-description"> Select a backend to manage users for.</p>

    </div>

    <div class="admin-select">

    <AdminBackendCard v-for="(backend, i) in getUserBackend(getSignedInUserId)"
                      :backend="backend"

    />

    </div>

  </div>


</template>

<script>
import AdminBackendCard from "@/components/admin/AdminBackendCard";
import {mapGetters} from "vuex";
import BackendCard from "@/components/settingsInfo/backendCard";
export default {
  name: "Admin",
  data(){
    return{
      displayAdminPopup : false

    }
  },
  components: {BackendCard, AdminBackendCard},
  computed: {
    ...mapGetters([
      'getUserInfo',
      'getUserBackend',
      'getSignedInUserId',
      'getUserAdminStatus'
    ])
  },
  methods: {
    showAdminPopup(){
      this.displayAdminPopup = !this.displayAdminPopup
    },
    showBackendManager(){
      this.$router.push({name: 'BackendManager', params: {} });
    }
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