<template>
    <div class="grid-app" v-if="this.$store.getters.getSignedIn">
<!--      <div class="nav-bar-top">-->
<!--        <button class="profile-button" @click="toggle">Hi, {{ getUserInfo(getSignedInUserId).name }}! <i class="pi pi-angle-down" aria-hidden="true"></i></button>-->
<!--        <OverlayPanel ref="op" appendTo="body" :showCloseIcon="false" id="overlay_panel" style="width: 350px" :breakpoints="{'960px': '50vw'}">-->
<!--          <ProfileDropdown/>-->
<!--        </OverlayPanel>-->
<!--      </div>-->
      <div id="grid-div-1" >
        <div id="sidebar">
          <router-link title="Search" class="icon" to="/search"><i class="pi pi-search" style="font-size:1.5rem" aria-hidden="true"/></router-link>
          <router-link title="Data Sources" class="icon" to="/datasources"><i class="pi pi-list" style="font-size:1.5rem" aria-hidden="true"/></router-link>
          <router-link title="Welcome" class="icon" to="/"><em class="pi pi-user" style="font-size:1.5rem"  /></router-link>
          <router-link title="Admin" class="icon" to="/admin"><em class="pi pi-user" style="font-size:1.5rem"  /></router-link>
          <router-link title="Settings" class="icon" to="/settings"><i class="pi pi-cog" style="font-size:1.5rem" aria-hidden="true"/></router-link>
        </div>
      </div>
      <div id="grid-div-2">
        <router-view/>
      </div>
    </div>
    <router-view v-else/>
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

#sidebar {
  min-width: 30px;
}

.header{
  padding: 30px;
  border: solid;
  border: #3b3b3b;
  max-height: 80px
}

.grid-app {
  display: grid;
  grid-template-rows: 30fr;
  grid-template-columns: 1fr 30fr;
  height: 100%;
}

#grid-div-1 {
  padding-top: 20px;
  background-color: #1e1e1e;
  grid-row-start: 2;
}

#grid-div-2 {
  border: 1px none #212121;
  border-right-style: solid;
  border-left-style: solid;
  height: 100%;
  grid-row-start: 2;
}

.nav-bar-top{
  grid-column-start: 1;
  grid-column-end: end;
  background-color: #1e1e1e;
}

.icon {
  padding: 10px;
}

button {
  border: none;
  border-radius: 12px;
  padding: 10px;
}

.pi-search, .pi-list, .pi-user, .pi-cog{
  color: grey;
  padding: 20px 10px 10px;
}

.pi-cog{
  position: fixed;
  bottom: 0;
}

.pi-search:hover,.pi-list:hover, .pi-cog:hover {
  color: #41B3B2;
}

.pi-angle-down{
  vertical-align: middle;
}

.profile-button{
  background-color: #1e1e1e;
  border: none;
  color: rgba(255, 255, 255, 0.58);
  float: right;
  margin-right: 2%;
  font-size: 15px;
  transition-duration: 0.4s;
  border-radius: 3px;
}

.profile-button:hover{
  color: white;
  cursor: pointer;
}

.profile-button:focus{
  color: white;
}

.p-overlaypanel:after {
  content: "";
  width: 20px;
  height: 20px;
  transform: rotate(-45deg);
  background: #262626;
  position: absolute;
  z-index: -1;
  top: -10px;
  right: 10px;
}
</style>

<script>
import OverlayPanel from 'primevue/overlaypanel';
import ProfileDropdown from "@/components/landing/ProfileDropdown";
import {mapGetters} from "vuex";

export default {
  components: {
    OverlayPanel,
    ProfileDropdown
  },
  data() {
    return {
      name: "Data Sleuth",
    }
  },
    computed: {
        ...mapGetters ([
            'getUserInfo',
            'getUserBackend',
            'getSignedInUserId'
        ])
    },
  methods: {
    hideNavBar() {
      this.navBar = false;
    },
    toggle(event) {
      this.$refs.op.toggle(event);
    },
  }
}
</script>
