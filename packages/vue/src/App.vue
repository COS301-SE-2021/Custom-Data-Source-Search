<template>
  <div id="nav">
    <router-link to="/">Home</router-link> |
    <router-link to="/about">About</router-link> |
    <router-link to="/test">TEST</router-link> |
    <router-link to="/todoApp">Todo App</router-link> |
    <router-link to="/design">Design</router-link> |
    <router-link to="/testLandingPage">Test Landing Page</router-link>
  </div>

  <router-view/>

</template>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  background-color: #121212;
}

#nav {
  padding: 10px;
  background-color: #212121;
  text-align: left;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
