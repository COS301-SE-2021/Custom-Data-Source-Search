<template>
  <div class="grid-app">
    <div id="nav">
      <router-link title="Search" class="icon" to="/"><icon-search/></router-link>
      <router-link title="Data Sources" class="icon" to="/datasources"><icon-storage/></router-link>
    </div>
    <div>
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
  background-color: #2c2c2c;
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

.grid-app {
  display: grid;
  grid-template-rows: 1fr 12fr;
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
  margin-left: 45px;
  padding: 10px;
}
</style>

<script>
import IconSearch from "./components/icons/IconSearch";
import IconStorage from "./components/icons/IconStorage";
export default {
  components: {
    IconStorage,
    IconSearch}
}
</script>
