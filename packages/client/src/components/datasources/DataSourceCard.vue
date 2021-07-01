<template>
  <div v-if="isNotDeleted" style="float: left; padding-left: 30px;">
    <span> {{ title }} </span>
    <icon-delete @click="deleteDataSource(endpoint, id)"/>
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

</style>