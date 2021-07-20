<template>
  <Dialog header="Sign In" v-model:visible="display" :draggable="false" :closable="true" :dismissable-mask="true">

    <div class="p-field p-grid">
      <label for="firstname" class="p-col-fixed" style="width:100px">Email Address</label>
      <div class="p-col">
        <InputText id="firstname" type="text" />
      </div>
    </div>
    <div class="p-field p-grid">
      <label for="password" class="p-col-fixed" style="width:100px">Password</label>
      <div class="p-col">
        <Password id="password" v-model="value" :toggle-mask="true" :feedback="false"/>
      </div>
    </div>

    <div class="p-field p-grid">
    <Button type="button" label="Submit" />
    </div>


  </Dialog>
</template>

<script>
export default {
  name: "SignIn",
  props: {
    show: Boolean,
  },
  data() {
    return {
      value: null,
      display: this.show
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

.p-field {
  margin : 9px;
}

</style>