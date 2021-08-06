<template>
  <div class="main-container">
    <div class="image-container">
      <div class="image-ring">
        <h3 class="name-initial">{{ username.charAt(0).toUpperCase() }}</h3>
      </div>
    </div>

    <div class="user-detail-container">
      <div id="name">{{ username }}</div>
      <div id="email">{{ email }}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ProfileDropdown",
  data(){
    return{
      username: null,
      email: null
    }
  },
  beforeMount() {
    this.username = this.$store.getters.getName;
    this.email = this.$store.getters.getEmail;
  }
}
</script>

<style scoped>

.image-container {
  float: left;
  margin-left: 1vw;
  vertical-align: middle;
  width: 50px;
  height: 50px;
}

.image-ring {
  width: 100%;
  height: 100%;
  background:
      linear-gradient(#2d2d2d, #2d2d2d) padding-box,
      linear-gradient(to right bottom, #2bd6c8, #3b6693) border-box;
  border-radius: 50em;
  border: 3px solid transparent;
}

.name-initial {
  color: #f3f3f3;
  font-size: 25px;
  margin: auto;
  width: 100%;
  height: 100%;
  text-align: center;
  line-height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.user-detail-container{
  margin-left: 90px;
}

#name{
  margin-bottom: 8px;
}
</style>