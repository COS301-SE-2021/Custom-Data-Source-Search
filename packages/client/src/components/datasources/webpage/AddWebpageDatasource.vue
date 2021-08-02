<template>
    <div>
      <span>Enter the URL of desired webpage</span>
      <InputText id="input" placeholder="Add WebPage URL..." v-model="dataSourceURI" v-on:keyup.enter="addDataSource"/>
      <!--  Please be aware that the below code is simply the skeleton for tags, this functionality does not work as of yet.-->
      <div>
        <span>Add optional tags</span><br/>
        <span class="p-float-label">
        <InputText id="tagInput1" type="text" v-model="tag1"/>
        <label for="tagInput1">Tag 1</label>
          <ColorPicker v-model="colour1" />
          <Tag id= 'tag1' value="Example" :style="style"></Tag>
      </span>
        <span class="p-float-label">
        <InputText id="tagInput2" type="text" v-model="tag2"/>
        <label for="tagInput2">Tag 2</label>
          <ColorPicker v-model="colour2" />
          <Tag id= 'tag2' value="Example" :style="style"></Tag>
      </span>
      </div>
      <Button icon="pi pi-check" class="p-button-rounded p-button-text" v-on:click="addDataSource()" />
    </div>
</template>

<script>
    import axios from 'axios'
    export default {
        name: "AddDataURI",
        props:{
          backend: String,
          colour: String,

        },
        data() {
            return {
              dataSourceURI: "",
              tag1: null,
              tag2: null,
              colour1: "f4a261",
              colour2: "457b9d",
              type: 'webpage'
            }
        },
        computed: {
          style(){
            return{
              //Colours for the example tags shown in the overlay
              '--colour-1': '#' + (this.colour1),
              '--colour-2': '#' + (this.colour2)
            }
          }
        },
        methods: {
            addDataSource() {
                axios
                    .post("http://localhost:3001/webpagedatasources", {"url": this.dataSourceURI})
                    .then(resp => {
                        this.$toast.add({severity: 'success', summary: 'Success', detail: resp.data.message, life: 3000})
                        this.$emit('addWebpage')
                    })
                    .catch(() => {
                        this.$toast.add({severity: 'error', summary: 'Error', detail: 'Could Not Add Webpage.', life: 3000})
                    })
            }
        }
    }
</script>

<style scoped>

input {
  font-size: 15px;
  font-style: italic;
  height: 5px;
  background-color: #242424;
}

.p-inputtext:enabled:focus {
  border-color: rgba(255, 255, 255, 0.3);
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.3), inset 0 0 0 1px rgba(255, 255, 255, 0.3), inset 0 0 0 1px rgba(255, 255, 255, 0.3), inset 0 0 0 1px rgba(255, 255, 255, 0.3);
}

#input{
  min-width: 100%;
  margin-top: 15px;
  margin-bottom: 15px;
}

.p-button-rounded{
  float: right;
  margin: 7px;
}

.p-float-label{
  margin-top: 15px;
}

.p-colorpicker{
  margin-left: 10px;
}

#tag1{
  background: var(--colour-1);
  margin-left: 20px;
}

#tag2{
  background: var(--colour-2);
  margin-left: 20px;
}


</style>
