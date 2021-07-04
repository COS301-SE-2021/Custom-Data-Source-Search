<template>
  <div class="data-source-card-grid" v-if="isNotDeleted">
    <div class="data-source-card-grid-div-1">
      <span style="float: left"> {{ title }} </span>
    </div>
    <div>
      <icon-delete class="delete-datasource" @click="deleteDataSource(endpoint, id)"/>
    </div>
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
            () => this.$toast.add({severity: 'success', summary: 'Deleted', detail: "Source deleted", life: 3000})
        ).catch(
            () => this.$toast.add({severity: 'error', summary: 'Error', detail: "Could not delete source", life: 3000})
        )
      }
    }
  }
}

</script>

<style scoped>

.delete-datasource {
  float: right;
}

.data-source-card-grid {
  margin-top: 10px;
  min-width: 100%;
  display: grid;
  grid-template-columns: 9fr 1fr;
  max-width: 100%;
  max-height: 80px;
  padding-left: 30px;
}

.data-source-card-grid-div-1 {
  float: left;
  padding-top: 10px;
  padding-right: 10px;
  overflow: hidden;
}

</style>