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
  <Button label="Show" icon="pi pi-external-link" @click="openBasic" />
  <Dialog header="Header" v-model:visible="displayBasic" :style="{width: '50vw'}">
    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
      Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
      Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
      cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
    <template #footer>
      <Button label="No" icon="pi pi-times" @click="closeBasic" class="p-button-text"/>
      <Button label="Yes" icon="pi pi-check" @click="closeBasic" autofocus />
    </template>
  </Dialog>
</template>

<script>
export default {
  setup() {
    const displayBasic = ref(false);
    const openBasic = () => {
      displayBasic.value = true;
    };
    const closeBasic = () => {
      displayBasic.value = false;
    };
    return {
      display: false
    }
  },
}
</script>

<style scoped lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  background-color: #121212;
  height: 100%;
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

.p-button {
  margin: 0.3rem .5rem;
  min-width: 10rem;
}

p {
  margin: 0;
}

.confirmation-content {
  display: flex;
  align-items: center;
  justify-content: center;
}

.p-dialog .p-button {
  min-width: 6rem;
}
</style>
