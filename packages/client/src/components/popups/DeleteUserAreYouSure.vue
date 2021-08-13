<template>
    <Dialog
            header="Delete User?"
            v-model:visible="display"
            :draggable="false"
            :closable="true"
            :dismissable-mask="true"
            :modal="true"
            @hide="$emit('display-popup')"
    >
    <div class="p-dialog-content">
        <span>Are you sure you want to delete {{user.name}}?</span>
        <br><br>
        <span>This user may not have a browser backup of their information. If you delete their local account, they may have to re-register to gain access to all their data sources.</span>
    </div>
      <div class="button-holders">
          <Button>Delete</Button>
          <Button @click="cancelDeletion">Cancel</Button>
      </div>

    </Dialog>
</template>

<script>
    export default {
        name: "DeleteUserAreYouSure",
        props: {
            show: Boolean,
            user: {
                id: Number,
                name: String
            }
        },
        data() {
            return {
                masterPass: null,
                display: this.show,
                email: ''
            }
        },
        methods: {
            cancelDeletion () {
                this.display = false;
            }
        },
        watch:{
            show: function(){
                this.display = this.show
            }
        }
    }
</script>

<style scoped>


    .p-dialog-content {
        max-width: 40em;
    }

    span {
        max-width: 1vw;
        overflow-wrap: normal;
    }

    .button-holders {
        display: flex;
        justify-content: center;
    }

    Button {
        margin-left: 1em;
        margin-right: 1em;
    }


</style>