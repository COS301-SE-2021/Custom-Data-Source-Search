<template>
<div class="grid-app">
  <div id="nav">
    <router-link title="Search" class="icon" to="/"><icon-search/></router-link>

    <router-link title="Data Sources" class="icon" to="/datasources"><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#26C6DA"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M2 20h20v-4H2v4zm2-3h2v2H4v-2zM2 4v4h20V4H2zm4 3H4V5h2v2zm-4 7h20v-4H2v4zm2-3h2v2H4v-2z"/></svg></router-link>
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
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
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

</style>
<script>
import IconSearch from "./components/icons/IconSearch";
export default {
  components: {IconSearch}
}
</script>