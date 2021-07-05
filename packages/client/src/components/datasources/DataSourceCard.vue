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
      this.$confirm.require({
        message: 'Are you sure you want to delete this data source?',
        header: 'Confirmation',
        icon: 'pi pi-exclamation-triangle',
        acceptClass: "p-button-danger",
        rejectClass: "p-button-text p-button-plain",
        accept: () => {
          axios.delete(endpoint, {"data": {"id": id}}).then(
              () => this.isNotDeleted = false, this.$toast.add({severity: 'success', summary: 'Deleted', detail: "Source deleted", life: 3000})

          ).catch(
              () => this.$toast.add({
                severity: 'error',
                summary: 'Error',
                detail: "Could not delete source",
                life: 3000
              })
          )
        },
        reject: () => {
          //callback to execute when user rejects the action
        }
      })
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