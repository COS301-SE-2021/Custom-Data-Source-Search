<template>

  <div class="user-container">
    <div class="image-container">

      <div class="image-ring">
        <h3 class="name-initial"> N</h3>
      </div>

    </div>
    <h1 class="name-field"> Name </h1>
    <h2 class="email-field"> email@address.com</h2>

  </div>
</template>

<script>
export default {
  name: "AddUser"
}
</script>

<style scoped>

.user-container {

  width: 10vw;
  height: 12vw;
  background-color: #2a2a2a;
  border-radius: 5px ;

}

.name-field {
  font-size: medium;
  text-align: center;
  color: #e9e9e9;
}

.email-field {
  font-size: smaller;
  font-weight: lighter;
  text-align: center;
  color: #e9e9e9;
}

.image-container {
  margin: auto;
  width: 5vw;
  height: 5vw;

}

.image-ring {
  width: 100%;
  height: 100%;
  border-style: solid;
  border-radius: 100px;
  border-width: thick;
  border-color: #00bcd4;
}

.name-initial {

  color: #bd3931;
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