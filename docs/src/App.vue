<template>
  <div id="app">
    {{message}}
  </div>
</template>

<script>
export default {
  name: "App.vue",

  data(){
    return{
      message: "Hello World",
    };
  },
};
</script>

<style scoped>
#app{
  font-size: 18px;
  font-family: 'Roboto', sans-serif;
  color: blue;
}
</style>