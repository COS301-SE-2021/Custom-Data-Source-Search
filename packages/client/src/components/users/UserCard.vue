<template>

  <div class="user-container p-ripple" v-ripple @click="signIn">
    <div class="image-container">

      <div class="image-ring " v-bind:class="{ active: userDetails.isActive }">
        <h3 class="name-initial"> {{ userDetails.name.charAt(0).toUpperCase() }}</h3>
      </div>

    </div>
    <h1 class="name-field"> {{ userDetails.name }} </h1>
    <h2 class="email-field"> {{userDetails.email }}</h2>

  </div>
</template>

<script>
export default {
  name: "UserCard",
  props: {
    userDetails: Object
  },
  methods: {
    signIn() {
      console.log("ayyyyyyyyyy")
      this.$router.push('Search');
      this.$store.commit("setSignedIn", true)
    }
  }
}
</script>

<style scoped>

.user-container {
  margin-left: 1vw;
  margin-right: 1vw;
  width: 10vw;
  height: 12vw;
  border-radius: 5px ;
  border-style: solid;
  border-width: 2px;
  border-color: rgba(158,41,34,0);

  padding-top: 2vw;

  background-color: #2c2c2c;
  box-shadow: 0 2px 1px -1px rgba(0,0,0,.2), 0 1px 1px 0 rgba(0,0,0,.14), 0 1px 3px 0 rgba(0,0,0,.12);

}

.user-container:hover{
  border-style: solid;
  border-width: 2px;
  border-color: #787878;
  cursor: pointer;
}

.name-field {
  font-size: 1vw;
  text-align: center;
  color: #e9e9e9;
  margin-top: 1.2vw;
}

.email-field {
  font-size: 0.7vw;
  font-weight: lighter;
  text-align: center;
  color: #e9e9e9;
}

.image-container {
  margin: auto;
  width: 4.6vw;
  height: 4.6vw;


}

.image-ring {
  width: 100%;
  height: 100%;
  background:
      linear-gradient(#2d2d2d, #2d2d2d) padding-box,
      linear-gradient(to right bottom, #747474, #505050) border-box;
  border-radius: 50em;
  border: 4px solid transparent;
}

.active {

  background:
      linear-gradient(#2d2d2d, #2d2d2d) padding-box,
      linear-gradient(to right bottom, #2bc8d6, #3b5c93) border-box;
  border-radius: 50em;
  border: 4px solid transparent;
}

.name-initial {

  color: #ffffff;
  font-size: 2.3vw;
  margin: auto;
  width: 100%;
  height: 100%;
  text-align: center;
  line-height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

</style>