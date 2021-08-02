<template>
    <div class="backend-info-card">
        <div class="backend-info-sum">
            <em class="pi pi-circle-on" />
            <span>LEGO</span>
            <InputSwitch v-model="checked"/>
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
                checked: false
            }
        }
    }
</script>

<style scoped>

    .backend-info-card {
        padding: 5px;
    }

    .backend-info-sum {
    }

    .pi-circle-on {
        color: #41B3B2;
    }


</style>