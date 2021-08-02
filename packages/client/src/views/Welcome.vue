<template >
  <div class="page">
    <div class="heading-and-info">
      <h1 class="header">Who's Sleuthin' ?</h1>
      <p class="description"> Select the user you would like to sign in as</p>
    </div>

  </div>


</template>

<script>
export default {
  name: "Welcome"
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
  color: #e9e9e9;
}

.description {
  text-align: center;
  color: #e9e9e9;
}

</style>