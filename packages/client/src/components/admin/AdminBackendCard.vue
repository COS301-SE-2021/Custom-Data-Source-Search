<template>
  <div class="backend-container p-ripple" v-ripple @click="showBackendManager">
    <div class="backend-header">

      <div class="color-circle" :style="backendColourStyle" ></div>
      <h2 class="name"> {{ backend.local.name }}</h2>
    </div>

    <Divider class="header-divider" align="left">

    </Divider>

    <h4 class="url"> {{ backend.connect.link }} </h4>


  </div>
</template>

<script>

  export default {
  name: "AdminBackendCard",
  props: {
    backend: {
      local: {
        id: Number,
        name: String,
        color: String,
        active: Boolean
      },
      connect: {
        associatedEmail: String,
        link: String,
        passKey: String
      },
      receive: {
        admin: Boolean,
        connected: Boolean
      }
    }
  },
  computed: {
    backendColourStyle() {
      return "background-color: " +  this.backend.local.color
          }
  },
  methods: {
    showBackendManager(){
      this.$router.push(
        {
          name: 'BackendManager',
          params: {
            backendID : this.backend.local.id,
            link: this.backend.connect.link,
            jwtCache: this.backend.connect.keys.jwtCache
          }
      });
    }
  }
}
</script>

<style scoped>

.color-circle {
  width: 20px;
  height : 20px;
  border-radius: 20px;
  display: inline-block;

}

.backend-container {
  margin-top: 1em;
  margin-bottom: 1em;
  width: 25rem;
  height: 7rem;
  border-radius: 7px ;
  border-style: solid;
  border-width: 1px;
  border-color: rgba(158,41,34,0);
  padding-top: 0.5em;
  background-color: #2c2c2c;
  box-shadow: 0 2px 1px -1px rgba(0,0,0,.2), 0 1px 1px 0 rgba(0,0,0,.14), 0 1px 3px 0 rgba(0,0,0,.12);

}

.backend-container:hover{
  border-style: solid;
  border-width: 1px;
  border-color: #787878;
  cursor: pointer;
}


.backend-header {
  width : 25em;
  height : 2.4em;
  margin-top : 0;
  margin-left: 15px;
  overflow: hidden;
  text-align: left;
}

.name {
  display: inline-block;
  margin: 0 0 0 0.4em;
  font-weight: normal;
  color: #f5f5f5;
}

.url {
  font-weight: lighter;
  color: #c8c8c8;
  font-size: 0.9em;

}

.header-divider {
  margin-top: 0.2em;
  margin-bottom: 0.3em;
}


</style>