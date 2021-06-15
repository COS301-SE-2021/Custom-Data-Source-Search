<template>
    <div class="test">
        <img alt="DataSleuth Logo" src="../assets/dataSmokerSleuth.jpg" style="width: 500px">
        <TestComponent msg="Testing out my Vue.js App"/>
    </div>
</template>

<script>
// @ is an alias to /src
import TestComponent from '@/components/TestComponent.vue'

    export default {
        name: 'Test',
        components: {
            TestComponent
        }
    }
</script>
