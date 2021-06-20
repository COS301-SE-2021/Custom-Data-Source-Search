<template>
  <ViewDataSourceElement></ViewDataSourceElement>
</template>

<script>
// @ is an alias to /src
import ViewDataSourceElement from "../components/ViewDataSourceElement";

export default {
  name: 'Test',
  components: {
    ViewDataSourceElement,
  },
  data(){
    return {
      msg: "Trying out landing page design"
    }
  }
}
</script>