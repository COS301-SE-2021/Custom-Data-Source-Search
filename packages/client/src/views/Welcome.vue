<template >
  <div class="page">
    <div class="heading-and-info">
      <h1 class="header">Who's Sleuthing ?</h1>
      <p class="description"> Select the user you would like to sign in as</p>
    </div>
    <div class="user-select" >
      <UserCard v-for="(user, i) in users" :key="i" :userDetails="user" ></UserCard>

      <AddUserCard></AddUserCard>
    </div>

  </div>


</template>

<script>
import UserCard from "@/components/users/UserCard";
import AddUserCard from "@/components/users/AddUserCard";
export default {
  name: "Welcome",
  components: {AddUserCard, UserCard},
  data () {
    return {
      isSignedIn: true,
      users : [
        {name : "Josh", email: "joshwalkerdev@gmail.com", isActive: true},
        {name : "Lauren", email: "lauren@gmail.com", isActive: false},
        {name : "Marike", email: "marike@gmail.com", isActive: true}
      ]
    }

  },
  mounted(){
    this.isSignedIn = this.$store.getters.getSignedIn;
  }
}
</script>

<style scoped>

.page {
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-columns: 1fr 4fr 1fr;
  grid-template-rows: 1fr 3fr 1fr;
}

.heading-and-info {

  display: block;

  grid-column-start: 2;

}

.header {
  text-align: center;
  color: #ededed;
}

.description {
  text-align: center;
  color: #ededed;
}

.user-select {
  grid-row-start: 2;
  grid-column-start: 2;
  display: flex;
  flex-direction: row;
  justify-content: center;
  flex-wrap: wrap;
  padding-top: 3vw;


}

</style>