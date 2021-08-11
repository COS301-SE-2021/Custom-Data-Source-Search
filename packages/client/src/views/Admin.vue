<template>

  <div class="page">

    <div class="admin-header">

      <h1 class="admin-heading"> User Administration</h1>
      <p class="admin-description"> Select a backend to manage users for.</p>




    </div>

    <div class="admin-select">

    <AdminBackendCard v-for="(backend, i) in getUserBackend(getSignedInUserId)"
                      :backend="backend"
                      @click="showAdminPopup"

    />

    </div>

    <UserViewPopup :show="displayAdminPopup" @display-admin-popup></UserViewPopup>


  </div>


</template>

<script>
import AdminBackendCard from "@/components/admin/AdminBackendCard";
import {mapGetters} from "vuex";
import BackendCard from "@/components/settingsInfo/backendCard";
import UserViewPopup from "@/components/admin/UserViewPopup";
export default {
  name: "Admin",
  data(){
    return{
      displayAdminPopup : false

    }
  },
  components: {UserViewPopup, BackendCard, AdminBackendCard},
  computed: {
    ...mapGetters([
      'getUserInfo',
      'getUserBackend',
      'getSignedInUserId'
    ])
  },
  methods: {
    showPopup(){
      this.displaySignIn = !this.displaySignIn
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