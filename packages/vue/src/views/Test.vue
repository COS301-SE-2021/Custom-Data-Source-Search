<template>
    <div class="test">
        <img alt="DataSleuth Logo" src="../assets/dataSmokerSleuth.jpg" style="width: 500px">
        <HelloWorld msg="Testing out my Vue.js App"/>
    </div>
</template>

<script>
    // @ is an alias to /src
    import HelloWorld from '@/components/HelloWorld.vue'

    export default {
        name: 'Home',
        components: {
            HelloWorld
        }
    }
</script>
