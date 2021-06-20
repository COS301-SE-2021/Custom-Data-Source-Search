<template>
  <div>
    <DesignExamples :msg="msg"/>
  </div>
</template>

<script>
// @ is an alias to /src
import TestComponent from '@/components/TestComponent.vue'
import DesignExamples from "../components/DesignExamples";

export default {
  name: 'Test',
  components: {
    DesignExamples,
    TestComponent
  },
  data(){
    return {
        msg: "This is an example of design using Element Plus :)"
      }
    }
}
</script>