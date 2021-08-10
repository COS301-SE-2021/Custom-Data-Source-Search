<template>
<div class="grid-app">
  <div id="grid-div-1">
    <Sidebar id="Sidebar" v-if="navBar">
      <router-link title="Search" class="icon" to="/"><em class="pi pi-search" style="font-size:1.5rem" aria-hidden="true"/></router-link>
      <router-link title="Data Sources" class="icon" to="/datasources"><em class="pi pi-list" style="font-size:1.5rem" aria-hidden="true"/></router-link>
      <router-link title="Register" class="icon" to="/register"><em class="pi pi-user" style="font-size:1.5rem" aria-hiddn="true" v-on:click="hideNavBar"/></router-link>
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
  overflow:hidden;
  margin: 0;
  padding: 0;
  background-color: #242424;
  color: rgba(255, 255, 255, 0.58);
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

input {
  height: 28px;
  font-size: 1em;
  background-color: #929292;
  padding: 3px 3px 3px 10px;
  border-radius: 8px;
  border: none;
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
  padding-top: 50px;
  background-color: #1e1e1e;
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
  border: none;
  border-radius: 12px;
  padding: 10px;
}

.pi-search, .pi-list, .pi-user{
  color: grey;
  padding: 20px 10px 10px;
}

.pi-search:hover,.pi-list:hover{
  color: #41B3B2;
}


</style>

<script>
export default {
  components: {
  },
  data() {
    return{
      name: "Data Sleuth",
      navBar: true
    }
  },
  methods: {
    hideNavBar() {
      this.navBar = false;
    }
  }
}



</script>
