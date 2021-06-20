<template>
  <AddDataSourceElement></AddDataSourceElement>
</template>

<script>
// @ is an alias to /src
import AddDataSourceElement from "../components/AddDataSourceElement";

export default {
  name: 'Test',
  components: {
    AddDataSourceElement,
  },
  data(){
    return {
      msg: "Trying out landing page design"
    }
  }
}
</script>