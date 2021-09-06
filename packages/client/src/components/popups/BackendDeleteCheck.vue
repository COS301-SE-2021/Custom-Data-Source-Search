<template>
  <Dialog
      header="Confirm Deletion"
      :visible="display"
      :draggable="false"
      :closable="true"
      :dismissable-mask="true"
      :modal="true"
      @hide="$emit('display-popup')"
  >
    <div class="process-request-body p-confirm-popup-message-moderator">
      <em class="pi pi-exclamation-triangle em-dialog"></em>
      <div class="p-dialog-content">
        <span>It is a tedious process to insert the key.</span>
        <br>
        <span> Are you sure there is no more use in {{backend.name}}?</span>
      </div>
    </div>
    <div class="button-holders">
      <Button @click="closePopUp" class="p-button-text p-button-plain">Cancel</Button>
      <Button @click="deleteBackend" class="p-button-danger">Delete</Button>
    </div>
  </Dialog>
</template>

<script>
    export default {
        name: "BackendDeleteCheck",

        props: {
            show: Boolean,
            backend: {
                name: String,
            }
        },

        data() {
            return {
                display: this.show,
            }
        },

        methods: {
            closePopUp() {
                this.display = false;
            },
            deleteBackend() {
                this.$store.commit("deleteBackendFromLocalList", {user: this.user, deleteVault: this.deleteVault});
                this.$emit("deleteBackend");
                this.closePopUp();
            }
        },

        watch: {
            show: function () {
                this.display = this.show
            }
        }
    }
</script>

<style scoped>

  /*.p-dialog-content {*/
  /*  max-width: 40em;*/
  /*}*/

  span {
    max-width: 1vw;
    overflow-wrap: normal;
  }

  .button-holders {
    float: right;
  }

  Button {
    max-width: fit-content;
    margin-left: 1em;
    margin-right: 1em;
  }

  .em-dialog {
    font-size: xx-large;
  }

  .p-confirm-popup-message-moderator {
    display: grid;
    grid-template-columns: 1fr 12fr;
  }
</style>