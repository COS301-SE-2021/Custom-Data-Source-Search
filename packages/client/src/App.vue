<template>
<div class="grid-app">
  <div id="grid-div-1">
    <Sidebar v-model:visible="visibleLeft" id="Sidebar" >
      <router-link title="Search" class="icon" to="/"><icon-search /></router-link>
      <router-link title="Data Sources" class="icon" to="/datasources"><icon-storage/></router-link>
    </Sidebar>
  </div>
  <div id="grid-div-2">
    <router-view/>
  </div>
</div>
</template>

<style lang="scss">

html,
body,
#app {
  height: 100%;
  margin: 0;
  padding: 0;
  background-color: #242424;
  color: rgba(255, 255, 255, 0.58);
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
}

input {
  height: 28px;
  font-size: 1em;
  background-color: #929292;
  padding: 3px 3px 3px 10px;
  border-radius: 8px;
  border: none;
}

input::placeholder {
  color: black;
}

#Sidebar {
  max-width: 30px
}

.header{
  padding: 30px;
  border: solid;
  border: #3b3b3b;
  max-height: 80px
}

.grid-app {
  display: grid;
  grid-template-columns: 1fr 30fr;
  height: 100%;
}

#grid-div-1 {
  padding-top: 20px;
  background-color: #212121;
}

#grid-div-2 {
  border: 1px none #212121;
  border-right-style: solid;
  border-left-style: solid;
  height: 100%;
}

#nav {
  padding: 30px;
  text-align: left;

  a {
    font-weight: bold;
    color: rgba(255, 255, 255, 0.58);

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}

.icon {
  padding: 10px;
}

button {
  background-color: #26C6DA;
  border: none;
  border-radius: 12px;
  padding: 10px;
}
</style>

<script>
import IconSearch from "./components/icons/IconSearch";
import IconStorage from "./components/icons/IconStorage";
export default {
  components: {
    IconStorage,
    IconSearch
  },
  data() {
    return{
      name: "Data Sleuth"
    }
  }
}
</script>
