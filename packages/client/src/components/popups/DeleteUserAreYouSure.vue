<template>
  <Dialog
      header="Confirm Deletion"
      :visible="display"
      :draggable="false"
      :closable="false"
      :dismissable-mask="true"
      :modal="true"
      @hide="hide"
  >
    <div class="process-request-body" v-if="firstQuestion">
      <div class="p-dialog-content p-confirm-popup-message-moderator">
        <i class="pi pi-exclamation-triangle em-dialog" aria-hidden="true"></i>
        <div>
          <span>Are you sure you want to delete "{{user.name}}"?</span>
          <br><br>
          <span>This user may not have a vault backup of their information. If you delete their local account, they may have to re-register to gain access to all their data sources.</span>
        </div>
      </div>
      <div class="button-holders">
        <Button  @click="closePopUp" class="p-button-text p-button-plain">Cancel</Button>
        <Button id="confirm-user-deletion-btn" @click="hasVault" class="p-button-danger">Delete</Button>
      </div>
    </div>
    <div class="process-request-body" v-else>
      <div class="p-dialog-content">
        <span>{{user.name}} has remote access to their account.</span>
        <br><br>
        <span>Do you want to remove only the LOCAL INSTANCE of their account, or ALL INSTANCES?</span>

        <br>
      </div>
      <div class="radio-button-holders">

        <div>
          <RadioButton name="deleteVault" id="deleteLocal" value="deleteLocal" v-model="deleteVault"/>
          <label for="deleteLocal"> LOCAL account only</label>
        </div>
        <div>
          <RadioButton name="deleteVault" id="deleteVault" value="deleteVault" v-model="deleteVault"/>
          <label for="deleteVault"> ALL instances of account</label>
        </div>
        <div class="password-field" v-if="deleteVault === 'deleteVault'">
            <span class="p-float-label">
               <PasswordInputField
                   id="password"
                   style="width: 100%"
                   @keyup.enter="doChecks"
                   v-model="masterPass"
                   :toggle-mask="true"
                   :feedback="false"
               />
              <label for="password">Password</label>
            </span>
          <div v-if="passwordIncorrect" class="error-message">
            <span class="error-message">Incorrect password.</span>
          </div>
        </div>
        <br>
        <div style="text-align: center">
          <strong>(You will require internet connection in order for this to be processed)</strong>
        </div>
        <div style="text-align: center">
          <Button
              id="confirm-user-deletion-btn-vault"
              class="p-button-danger these-buttons"
              :disabled="deleteVault !== 'deleteLocal'"
              @click="deleteUser">
            Delete
          </Button>
          <Button class="p-button-text these-buttons" @click="closePopUp">Cancel</Button>
        </div>
      </div>
    </div>
  </Dialog>
</template>

<script>
import {SRPClientSession, SRPParameters, SRPRoutines} from "tssrp6a";
import axios from "axios";
import {decryptJsonObject, encryptJsonObject, generateMasterKey} from "@/store/Store";
import {pbkdf2Sync} from "crypto";
import PasswordInputField from "../customComponents/PasswordInputField";

export default {
        name: "DeleteUserAreYouSure",
        components: {PasswordInputField},
        props: {
          show: Boolean,
          firstQuestionFedIn: Boolean,
          deleteVaultFedIn: {
              type: String,
              default: null
          },
          user: {
              id: Number,
              name: String,
              hasVault: Boolean
          }
        },
        data() {
          return {
            display: this.show,
            firstQuestion: true,
            deleteVault: null,
            deleteLocal: null,
            masterPass: null,
            passwordIncorrect: false
          }
        },
        mounted() {
          this.firstQuestion = this.firstQuestionFedIn;
          this.deleteVault = this.deleteVaultFedIn;
        },
        methods: {
          closePopUp() {
              this.display = false;
              this.firstQuestion = true;
          },
          hasVault() {
              if (this.user.hasVault) {
                  this.firstQuestion = false;
              } else {
                  this.deleteUser();
              }
          },
          async deleteUser() {
            this.$store.commit("deleteUserFromLocalList", {user: this.user, deleteVault: this.deleteVault});
            this.$emit("clearCurrentUser");
            this.closePopUp();
          },
          hide(){
            this.$emit('display-popup');
            this.display = false;
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


  .p-dialog-content {
    max-width: 40em;
  }

  .button-holders {
    float: right;
  }

  Button {
    max-width: fit-content;
    margin-left: 1em;
    margin-right: 1em;
  }

  .radio-button-holders {
    display: grid;
    grid-row-gap: 0.5em;
    padding: 0 24px 0 24px;
  }

  .p-confirm-popup-message-moderator {
    display: grid;
    grid-template-columns: 1fr 12fr;
  }

  .em-dialog {
    font-size: xx-large;
  }

  .these-buttons {
    float: right;
  }

  .p-button-text {
    color: grey;
  }

  input {
    width: 100%;
  }

  .error-message {
    color: #EF9A9A;
    text-align: center;
  }

  .password-field{
    margin-top: 10px;
  }
</style>