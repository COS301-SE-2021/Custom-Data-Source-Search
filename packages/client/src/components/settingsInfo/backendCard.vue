<template>
    <div class="backend-info-card">
        <div class="backend-info-sum">
            <em class="pi pi-circle-on" />
            <span>LEGO</span>
            <InputSwitch id="inputswitch" style="float: right; margin-top: 2px" v-model="checked"/>
            <div class="expanded-backend-info" v-if="expand">
                <div><i>Name: </i></div>
                <div>LEGO</div>
                <div><i>Link: </i></div>
                <div>www.linktoLegoBackend/156WqezhgHf</div>
                <div><i>Pass Key: </i></div>
                <div>•••••••••••••••••••••••••••••••••••</div>
                <div></div>
                <div>
                    <Button @click="loadValues" style="float: right" class="p-button p-button-outlined">Edit </Button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import InputSwitch from 'primevue/inputswitch'
    export default {
        components: {
          InputSwitch
        },
        name: "backendCard",
        data () {
            return {
                checked: false,
                expand: true
            }
        }
    }
</script>

<style scoped>

    .backend-info-card {
        margin-top: 5px;
        padding: 5px;
        border: solid 1px #363636;
        border-radius: 5px;
        max-width: 500px;
    }

    .expanded-backend-info {
        background-color: rgba(189, 189, 189, 0.05);
        border-radius: 5px;
        margin-top: 4px;
        padding-top: 4px;
        padding-left: 4px;
        display: grid;
        grid-template-columns: 1fr 3fr;
        grid-template-rows: 1fr 1fr 1fr 1fr;
    }

    .expanded-backend-info div {
        max-height: 50px;
    }

    .pi-circle-on {
        color: #41B3B2;
        padding-top: 2px;
        padding-left: 2px;
        padding-bottom: 2px;
    }

    Button {
        float: right;
        max-height: 30px;
        text-align: center;
        margin-right: 2%;
        margin-bottom: 2%;
        max-width: 30px;
    }

    span {
        padding-left: 15px;
    }

    span:hover {
        cursor: pointer;
    }



</style>