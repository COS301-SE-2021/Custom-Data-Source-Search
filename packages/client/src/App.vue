<template>
  <div class="grid-app">
    <div id="nav">
      <router-link title="Search" class="icon" to="/" style="text-decoration: none;"><Button icon="pi pi-search" class="p-button-rounded p-button-text" /></router-link>
      <router-link title="Data Sources" class="icon" to="/datasources" style="text-decoration: none;"><Button icon="pi pi-book" class="p-button-rounded p-button-text" /></router-link>
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