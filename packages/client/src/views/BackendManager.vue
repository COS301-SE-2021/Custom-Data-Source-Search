<template>
  <div class="management-page">

    <h1 class="backend-name">{{backend.name}}</h1>


    <Toolbar class="backend-toolbar">
      <Button label="New" icon="pi pi-plus" class="p-mr-2" />
      <Button label="Upload" icon="pi pi-upload" class="p-button-success" />
      <i class="pi pi-bars p-toolbar-separator p-mr-2" />
      <SplitButton label="Save" icon="pi pi-check" :model="items" class="p-button-warning"></SplitButton>
    </Toolbar>

  </div>



</template>

<script>
import {mapGetters} from "vuex";

export default {
  name: "BackendManager.vue",
  data() {
    return {
      backend: null
    }
  },
  props: {
    backendID : Number,
  },
  computed: {
    ...mapGetters([
      'getUserBackend',
      'getSignedInUserId',
    ])
  },
  beforeMount() {
    console.log(this.backendID)
    this.backend = this.getUserBackend(this.getSignedInUserId)[this.backendID]
    console.log(this.backend.name)
  }
}
</script>

<style scoped>

.management-page {

  width: 100%;
  height: 100%;
  display: grid;
  grid-template-rows: 2fr 8fr 1fr;
  grid-template-columns: 1fr 9fr;

}

.backend-name {
  text-align: center;
  color: #ededed;

  grid-row-start : 1;
  grid-column-start: 2;
}

.backend-toolbar {


  grid-row-start : 3;
  grid-column-start: 2;

}

</style>