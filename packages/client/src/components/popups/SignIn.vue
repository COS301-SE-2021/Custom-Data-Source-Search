<template>
  <Dialog header="Sign In" v-model:visible="display" :draggable="false" :closable="true">

    <div class="p-field p-grid">
      <label for="firstname" class="p-col-fixed" style="width:100px">Email Address</label>
      <div class="p-col">
        <InputText id="firstname" type="text" />
      </div>
    </div>
    <div class="p-field p-grid">
      <label for="lastname" class="p-col-fixed" style="width:100px">Password</label>
      <div class="p-col">
        <InputText id="lastname" type="text" />
      </div>
    </div>

    <Button type="button" label="Submit" />


  </Dialog>
</template>

<script>
export default {
  name: "SignIn",
  props: ['show'],
  data() {
    return {
      display: this.show
    }
  }
}
</script>

<style scoped>

.p-field {
  margin : 9px;
}

</style>