<template>
  <div class="grid-app" v-if="this.$store.getters.getSignedIn">
    <div id="grid-div-1">
      <div id="sidebar" class="nav">
        <router-link
            title="Search"
            to="/search"
            id="SearchIcon"
            class="pi pi-search icon"
            style="font-size:1.5rem"
            aria-hidden="true"
        />
        <router-link
            title="Data Sources"
            to="/datasources"
            id="DataSourcesIcon"
            class="pi pi-list icon"
            style="font-size:1.5rem"
            aria-hidden="true"
        />
        <router-link
            title="Backends"
            to="/backends"
            id="BackendIcon"
            class="pi pi-th-large icon"
            style="font-size:1.5rem"
            aria-hidden="true"
        />
        <router-link
            title="Admin"
            to="/admin"
            id="AdminIcon"
            v-if="getIsUserAdmin"
            class="pi pi-sitemap"
            style="font-size:1.5rem"
            @click="showJWTObject"
          />
        <div v-if="!sync" title="Sync Vault" class="refresh-container icon" @click="showVaultSyncDialog">
          <i
              class="fas fa-sync-alt"
              style="font-size:1.2rem"
              aria-hidden="true"
          />
        </div>
        <div v-else title="Syncing..." class="refresh-container icon">
          <i
              class="fas fa-sync-alt fa-spin"
              style="font-size:1.2rem"
              aria-hidden="true"
          />
        </div>
        <div class="icon-container" title="User" @click="toggle">
          <div class="image-ring-main">
            <h3 class="name-initial-main">
              {{ getUserInfo(getSignedInUserId).name.charAt(0).toUpperCase() }}
            </h3>
          </div>
        </div>
        <div class="unconnected-backend-warning">
          <CustomTooltip :text="unconnectedBackendNames">
            <em
                v-if="unconnectedBackendBool"
                id="expiration-indicator"
                class="pi pi-info-circle p-text-secondary"
                @click="showAskMasterPw"
            />
          </CustomTooltip>
        </div>
        <ReEnterMasterPassword
            :show="displayPasswordDialog"
            :unconnected-backend-icon="true"
            :header="'Enter Master Password'"
            :body="'Continue Sleuthin\' all your favourite backends!'"
            :vault="false"
            @action-to-Occur="showAskMasterPw"
            @close-dialog="closeDialog"
        />
        <ReEnterMasterPassword
            :show="displayVaultDialog"
            :unconnected-backend-icon="true"
            :header="'Sync Your Vault'"
            :body="'Enter your master password to continue with sync'"
            :vault="true"
            @action-to-Occur="showAskMasterPw"
            @sync-vault="toggleSync"
            @close-dialog="closeDialog"
        />
      </div>
    </div>
    <div id="grid-div-2">
      <OverlayPanel
          id="overlay_panel"
          ref="op"
          appendTo="body"
          :showCloseIcon="false"
          style="width: 350px"
      >
        <ProfileDropdown/>
      </OverlayPanel>
      <router-view/>
    </div>
  </div>
  <router-view v-else/>
</template>

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
    ProfileDropdown,
  },

  data() {
    return {
      name: "Data Sleuth",
      displayPasswordDialog: false,
      displayVaultDialog: false,
      sync: false,
      activePage: ['SearchIcon', 'DataSourcesIcon', 'BackendIcon', 'AdminIcon'],
      activePageNum: null,
      adminStatus: false
    }
  },

    computed: {
        ...mapGetters ([
            'getUserInfo',
            'getUserBackends',
            'getSignedInUserId',
            'unconnectedBackendNames',
            'unconnectedBackendBool',
            'unconnectedBackendNo',
            'getIsUserAdmin'
        ])
    },

    beforeCreate() {
        this.$store.commit('initialiseStore');
    },

    methods: {
      showJWTObject() {
        console.log("Is user an admin?" + this.$store.getters.getIsUserAdmin());
      },

      showAskMasterPw(){
        if(this.$store.getters.getMasterKey === null){
          this.showPasswordDialog();
        }
      },

      toggle(event){
        this.$refs.op.toggle(event);
      },

      showPasswordDialog(){
        this.displayPasswordDialog = !this.displayPasswordDialog;
      },

      showVaultSyncDialog(){
        this.displayVaultDialog = !this.displayVaultDialog
      },

      toggleSync(){
        this.sync = !this.sync;
      },

      closeDialog(){
        this.displayPasswordDialog = false;
        this.displayVaultDialog = false;
      }
    }
  }
</script>

<style lang="scss">
  html,
  body,
  #app {
    height: 100%;
    overflow: hidden;
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

  button {
    border: none;
    border-radius: 12px;
    padding: 10px;
  }

  .header {
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

  a:-webkit-any-link {
    text-decoration: none;
    padding-left: 0.7em
  }

  .icon {
    padding: 10px;
  }

  .pi-search, .pi-list, .pi-user, .pi-cog, .pi-th-large, .pi-sitemap{
    color: grey;
    padding: 20px 10px 10px;
  }

  .unconnected-backend-warning{
    text-align: center;
    padding: 10px 10px 10px;
  }

  .pi-search:hover, .pi-list:hover, .pi-cog:hover, .pi-user:hover, .pi-th-large:hover, .pi-sitemap:hover {
    color: #41B3B2;
  }

  a.router-link-active {
    color: #41B3B2;
  }

  .pi-angle-down {
    vertical-align: middle;
  }

  .p-overlaypanel:after {
    content: "";
    width: 20px;
    height: 20px;
    //transform: rotate(-45deg);
    background: #262626;
    position: absolute;
    z-index: -1;
    top: 0;
    left: 20px;
  }

  .image-ring-main {
    width: 40px;
    max-height: 40%;
    padding-top: 0.5em;
    padding-bottom: 0.5em;
    background: linear-gradient(#232323, #1a1a1a) padding-box,
    linear-gradient(to right bottom, #2bd6c8, #3b6693) border-box;
    border-radius: 50em;
    border: 2.9px solid transparent;
  }

  .image-ring-main:hover {
    background: linear-gradient(#232323, #1a1a1a) padding-box,
    linear-gradient(to right bottom, #2bd6c8, #3b6693) border-box;
  }

  .name-initial-main {
    color: rgba(204, 204, 204, 0.97);
    font-size: 20px;
    font-weight: bold;
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
    padding-left: 0.5em;
    bottom: 2em;
    cursor: pointer;
    padding-bottom: 0.8vh;
    margin-right: 1%;
  }

  .refresh-container {
    position: fixed;
    padding-left: 1.1em;
    bottom: 90px;
    cursor: pointer;
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

  #expiration-indicator {
    font-size: 1.5rem;
    color: #FFF59D;
    position: relative;
    display: inline-block;
    margin-top : 0.5rem;
    margin-bottom : 0.3rem;
  }

  #profile {
    position: fixed;
    margin-left: -53px;
    cursor: pointer;
    bottom: 5%;
  }

  #overlay_panel {
    margin-left: 0.5%;
  }

  #sidebar {
    width: 3.5em;
  }

  .pi-info-circle {
    cursor: pointer;
  }
</style>
