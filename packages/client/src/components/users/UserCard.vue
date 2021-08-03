<template>

  <div class="user-container p-ripple" v-ripple>
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
  }
}
</script>

<style scoped>

.user-container {
  margin-left: 2vw;
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
  font-size: medium;
  text-align: center;
  color: #e9e9e9;
  margin-top: 2vw;
}

.email-field {
  font-size: small;
  font-size: 0.8em;
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
  border-style: solid;
  border-radius: 100px;
  border-width: 3px;
  border-color: #969696;
  background-color: #2d2d2d;
}

.active {

  border-color: #00d4b4;

}

.name-initial {

  color: #cf4c44;
  font-size: 2.5vw;
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