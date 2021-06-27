<template>

  <div v-if="isNotDeleted">
    <span style="float: left;"> {{ title }} </span>
    <button @click="deleteDataSource(endpoint, id)" label="Confirm"><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#777777"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M16 9v10H8V9h8m-1.5-6h-5l-1 1H5v2h14V4h-3.5l-1-1zM18 7H6v12c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7z"/></svg></button>
  </div>
</template>

<script>
import axios from "axios";
export default {
  name: "DataSourceCard",
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
      // if ($confirm("Do you want to delete this datasource")) {
      //   this.isNotDeleted = false
      //   axios.delete(endpoint, {"data": {"id": id}}).then(
      //       () => {alert("Deleted")}
      //   ).catch(
      //       () => {alert("Could Not Delete!")}
      //   )
      // }
      this.$confirm.require({
        message: 'Are you sure you want to delete this data source?',
        header: 'Confirmation',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          this.isNotDeleted = false
          axios.delete(endpoint, {"data": {"id": id}}).then(
              () => this.$toast.add({severity: 'success', summary: 'Success', detail: 'Deleted successfully!', life: 3000})
          ).catch(
              () => this.$toast.add({severity: 'error', summary: 'Error', detail: 'Could not delete.', life: 3000})
          )
        },
        reject: () => {
          //callback to execute when user rejects the action
        }
      });
    }

  }
}

</script>

<style scoped>

button {
  background: transparent;
  border: none;
  float: right;
  cursor: pointer;
}

div {
  padding: 25px;
}

button:hover{
  color: #ba181b;
}

</style>