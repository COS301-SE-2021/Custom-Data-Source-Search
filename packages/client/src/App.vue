<template>
    <div class="grid-app" v-if="this.$store.getters.getSignedIn">
      <div id="grid-div-1" >
        <div id="sidebar">
            <router-link title="Search" class="icon" to="/search"><i class="pi pi-search" style="font-size:1.5rem" aria-hidden="true"/></router-link>
            <router-link title="Data Sources" class="icon" to="/datasources"><i class="pi pi-list" style="font-size:1.5rem" aria-hidden="true"/></router-link>
            <router-link title="Admin" class="icon" to="/admin"><em class="pi pi-th-large" style="font-size:1.5rem"  /></router-link>
            <router-link title="Settings" class="icon" to="/settings"><i class="pi pi-cog" style="font-size:1.5rem" aria-hidden="true"/></router-link>
            <!--            <i id="profile" class="pi pi-user" style="font-size:1.5rem" aria-hidden="true" @click="toggle"/>-->
            <div class="icon-container" title="User" @click="toggle">
                <div class="image-ring-main" >
                    <h3 class="name-initial-main">{{ getUserInfo(getSignedInUserId).name.charAt(0).toUpperCase() }}</h3>
                </div>
            </div>
            <div class="unconnected-backend-warning">
                <CustomTooltip :text="unconnectedBackendNames">
                    <em
                            v-if="unconnectedBackendBool"
                            id="expiration-indicator"
                            class="pi pi-info-circle p-text-secondary"
                            @click="showAskMasterPw"
                    ></em>
                </CustomTooltip>
            </div>
            <ReEnterMasterPassword
                    :show="displayMasterPwInput"
                    @action-to-Occur="showAskMasterPw"
            />
        </div>
      </div>
        <div id="grid-div-2">
            <OverlayPanel ref="op" appendTo="body" :showCloseIcon="false" id="overlay_panel" style="width: 350px" :breakpoints="{'900px': '40vw'}">
                <ProfileDropdown/>
            </OverlayPanel>
            <router-view/>
      </div>
    </div>
    <router-view v-else/>
</template>

<style lang="scss">

html,
body,
#app {
  height: 100%;
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
  position: fixed;
  display: grid;
  grid-template-columns: 1fr 30fr;
  grid-template-rows: 0;
  height: 100%;
}

#grid-div-1 {
  padding-top: 20px;
  background-color: #1e1e1e;
  grid-row-start: 2;
  height: 100%;
}

#grid-div-2 {
  border: 1px none #212121;
  border-right-style: solid;
  border-left-style: solid;
  height: 100%;
  grid-row-start: 2;
}

.icon {
  padding: 10px;
}

button {
  border: none;
  border-radius: 12px;
  padding: 10px;
}

.pi-search, .pi-list, .pi-user, .pi-cog, .pi-th-large, .unconnected-backend-warning{
  color: grey;
  padding: 20px 10px 10px;
}

/*.pi-cog{*/
/*  position: fixed;*/
/*  bottom: 0;*/
/*}*/

.pi-search:hover,.pi-list:hover, .pi-cog:hover, .pi-user:hover, .pi-th-large:hover {
  color: #41B3B2;
}

.pi-angle-down{
  vertical-align: middle;
}

.p-overlaypanel:after {
  content: "";
  width: 20px;
  height: 20px;
  transform: rotate(-45deg);
  background: #262626;
  position: absolute;
  z-index: -1;
  top: 350px;
  left: 20px;
}

#profile{
  position: fixed;
  margin-left: -53px;
  cursor: pointer;
  bottom: 5%;
}

.image-ring-main {
    width: 40px;
    max-height: 40%;
    padding-top: 0.5em;
    padding-bottom: 0.5em;
    background:
            linear-gradient(#232323, #1a1a1a) padding-box,
            linear-gradient(to right bottom, rgba(128, 128, 128, 0.7), rgba(168, 168, 168, 0.71)) border-box;
    border-radius: 50em;
    border: 2.8px solid transparent;
}

.image-ring-main:hover {
    background:
            linear-gradient(#232323, #1a1a1a) padding-box,
            linear-gradient(to right bottom, #2bd6c8, #3b6693) border-box;

}

.name-initial-main {
    color: grey;
    font-size: 20px;
    font-weight: normal;
    margin: auto;
    width: 100%;
    height: 100%;
    text-align: center;
    line-height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
}

.icon-container {
    position: fixed;
    text-align: left;
    max-width: 30px;
    max-height: 30px;
    padding-left: 0.7em;
    bottom: 2em;
    cursor: pointer;
    padding-bottom: 0.8vh;
    margin-right: 1%;
}


#expiration-indicator {
    font-size: 2rem;
    color: #d69b2c;
    position: relative;
    display: inline-block;
    margin-left: 0.4rem;
    margin-top : auto;
    margin-bottom : 0.3rem;
}

</style>

<script>
    import OverlayPanel from 'primevue/overlaypanel';
    import ProfileDropdown from "@/components/landing/ProfileDropdown";
    import {mapGetters} from "vuex";
    import ReEnterMasterPassword from "./components/popups/ReEnterMasterPassword";
    import CustomTooltip from "./components/primeComponents/CustomTooltip";

    export default {
  components: {
      CustomTooltip,
      ReEnterMasterPassword,
      OverlayPanel,
      ProfileDropdown
  },
  data() {
    return {
      name: "Data Sleuth",
      displayMasterPwInput: false,
    }
  },
    computed: {
        ...mapGetters ([
            'getUserInfo',
            'getUserBackends',
            'getSignedInUserId',
            'unconnectedBackendNames',
            'unconnectedBackendBool',
            'unconnectedBackendNo'
        ])
    },
    beforeCreate() {
        this.$store.commit('initialiseStore');
    },
    methods: {
        showAskMasterPw() {
            console.log (JSON.stringify(this.$store.getters.getMasterKeyObject));
            if(this.$store.getters.getMasterKeyObject === null) {
                this.openMasterPwInput();
            } else {
                if (this.$store.getters.unconnectedBackendBool) {
                    this.$toast.add({severity: 'info', summary: 'Server-side Error', detail: "Please contact your server owner to resolve the issue."});
                }
            }
        },
         toggle(event) {
            this.$refs.op.toggle(event);
        },
        openMasterPwInput() {
                this.displayMasterPwInput = !this.displayMasterPwInput;
        }
  }
}
</script>
