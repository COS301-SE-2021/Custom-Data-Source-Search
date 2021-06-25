<template>
  <div v-if="isNotDeleted">
    <span> {{ title }} </span>
    <button @click="deleteDataSource(endpoint, id)"><icon-delete/></button>
  </div>
</template>

<script>
import axios from "axios";
import IconDelete from "../icons/IconDelete";
export default {
  name: "DataSourceCard",
  components: {IconDelete},
  data() {
    return {
      isNotDeleted: true
    }
  },
  props: {
    title: String,
    id: String,
    endpoint: String,
  },
  methods: {
    deleteDataSource(endpoint, id) {
      if (confirm("Do you want to delete this datasource")) {
        this.isNotDeleted = false
        axios.delete(endpoint, {"data": {"id": id}}).then(
            () => {alert("Deleted")}
        ).catch(
            () => {alert("Could Not Delete!")}
        )
      }
    }
  }
}

</script>

<style scoped>



div {
  padding: 15px;
  border-top-style: solid;
  border-top-width: 1px;
  border-top-color: #555555;
}



</style>