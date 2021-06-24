<template>
  <div id="app">
    <div className="app-container">
      <form @submit.prevent="greet">
        <InputText type="text" v-model="text"/>
<!--        You can change the outlining of buttons by choosing the colour - in this case we choose our secondary colour-->
        <Button type="submit" label="Submit"/>
        <Button icon="pi pi-bell" class="p-button-rounded p-button-warning" />
        <ToggleButton v-model="checked1" onIcon="pi pi-star" offIcon="pi pi-star-o" />
        <h3>{{ message }}</h3>
      </form>
      <Card>
        <template #header>
          Header of a card
        </template>
        <template #title>
          Advanced Card
        </template>
        <template #content>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Inventore sed consequuntur error repudiandae numquam deserunt
          quisquam repellat libero asperiores earum nam nobis, culpa ratione quam perferendis esse, cupiditate neque quas!
        </template>
        <template #footer>
          <Button icon="pi pi-check" label="Save" />
          <Button icon="pi pi-times" label="Cancel" class="p-button-secondary" style="margin-left: .5em" />
        </template>
      </Card>
    </div>
    <Splitter style="height: 300px">
      <SplitterPanel>
        Panel 1
      </SplitterPanel>
      <SplitterPanel>
        <TabView>
          <TabPanel header="Header I">
            Content I
          </TabPanel>
          <TabPanel header="Header II">
            Content II
          </TabPanel>
          <TabPanel header="Header III">
            Content III
          </TabPanel>
        </TabView>
      </SplitterPanel>
    </Splitter>
    <Toast/>

  </div>
</template>

<script>

export default {
  data() {
    return {
      message: null,
      text: null,
      checked1: false
    }
  },
  methods: {
    greet() {
      this.$toast.add({severity: 'success', summary: 'Hello ' + this.text});
      this.message = 'Hello ' + this.text;
    }
  },
}
</script>

<style scoped lang="scss">
html,
body,
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin-top: 60px;
  height: 100%;
}

.app-container {
  text-align: center;
}

body #app .p-button {
  margin-left: .2em;

}

///*Easy to change individual elements*/
button{
  color: black;
}

form {
  margin-top: 2em;
}

/*PrimeVue website gives you the names of the classes that can be styled. You can apply regular css styling here. Super helpful!*/
.p-card{
  color: white;
  background-image: linear-gradient(black, grey);
}
</style>