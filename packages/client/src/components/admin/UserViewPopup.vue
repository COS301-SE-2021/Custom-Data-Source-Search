<template>

  <Dialog  v-model:visible="display" :dismissable-mask="true" :modal="true"
          :draggable="false" :close-on-escape="true" @hide="$emit('display-admin-popup')">
    <div class="backend-view">
    <h1 class="backend-heading">Admin</h1>
    <DataTable :value="users" :paginator="true" class="p-datatable-customers p-datatable-sm" :rows="10"
      dataKey="id" :rowHover="true" v-model:selection="selectedUsers" v-model:filters="filters" filterDisplay="menu" :loading="loading"
      paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown" :rowsPerPageOptions="[10,25,50]"
      currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
      :globalFilterFields="['name','country.name','representative.name','status']" responsiveLayout="scroll">
      </DataTable>
    </div>
  </Dialog>

</template>

<script>
export default {
  name: "UserViewPopup",
  props: {
    show: Boolean,
  },
  data() {
    return {
      display: this.show,
      users: null,
      selectedUsers: null
    }

  },
  watch:{
    show: function(){
      this.display = this.show
    }
  }
}
</script>

<style scoped>

.backend-view {
  width: 84vw;
  height: 30em;
}

.backend-heading {
  text-align: center;
}

</style>