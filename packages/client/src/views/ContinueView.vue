<template>
  <div class="only-main-div">
    <div>
      <span><strong>Registration successful!</strong></span>
      <br><br>
      <span> Do you want to continue on to configure backends?</span>
      <div class="continue-back-buttons">
        <Button
            @click="goToSettings"
            style="text-align: center; margin-left: 2%"
            class="p-button-lg p-button-outlined"
        >
          Yes
        </Button>
        <Button
            id="gotoSearch"
            @click="goToSearch"
            style="margin-right: 2%"
            class="p-button-lg p-button-outlined"
        >
            No
        </Button>
      </div>
    </div>
  </div>
</template>

<script>
    export default {

        name: "ContinueView",

        beforeMount() {
            if (this.$store.getters.getNewAppStatus || this.$store.getters.getMasterKey === null) {
                this.$router.push('/');
            }
        },

        methods: {
            goToSettings() {
                this.$router.push("Backends");
            },
            goToSearch() {
                this.$router.push('Search');
            }
        }
    }
</script>

<style scoped>

  .only-main-div {
    padding-top: 30vh;
    text-align: center;
    vertical-align: center;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }

  .continue-back-buttons {
    margin: 2vh;
  }

  Button {
    margin: 2vh
  }

  span {
    font-size: larger
  }

  strong {
    font-size: x-large;
  }

</style>