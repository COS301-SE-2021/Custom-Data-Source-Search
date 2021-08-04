<template>
  <div class="user-container p-ripple" v-ripple @click="addUser">
    <div class="image-container">

      <div class="image-ring">
        <i class="pi pi-plus add-icon" style="fontSize: 2.2vw"></i>
      </div>

    </div>
    <h1 class="name-field"> Add User </h1>

  </div>
</template>

<script>
export default {
  name: "AddUserCard",
  methods : {
    addUser(){
      this.$router.push('Register');
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
  border-radius: 7px ;
  border-style: solid;
  border-width: 2px;
  border-color: rgba(158,41,34,0);

  padding-top: 2vw;

  background-color: #2c2c2c;
  box-shadow: 0 2px 1px -1px rgba(0,0,0,.2), 0 1px 1px 0 rgba(0,0,0,.14), 0 1px 3px 0 rgba(0,0,0,.12);

}

.user-container:hover{
  border-style: dashed;
  border-width: 2px;
  border-color: #787878;
  cursor: pointer;
}

.name-field {
  font-size: 1vw;
  text-align: center;
  color: #e9e9e9;
  margin-top: 2vw;
}


.image-container {
  margin: auto;
  width: 4.6vw;
  height: 4.6vw;

}

.image-ring {
  width: 100%;
  height: 100%;
  border-style: dashed;
  border-radius: 100px;
  border-width: 3px;
  border-color: #969696;
  background-color: #2d2d2d;

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

.add-icon {
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