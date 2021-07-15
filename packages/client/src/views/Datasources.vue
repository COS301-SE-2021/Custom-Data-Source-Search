<template>
  <div>
    <h2>
      Data Sources
    </h2>
  </div>
 <div class="options">
   <div>
     Filter by:
     <Dropdown v-model="selectedBackend" :options="backends" optionLabel="name" :filter="true" placeholder="Backend" :showClear="true">
            <template #value="slotProps">
                <div v-if="slotProps.value">
                    <div>{{slotProps.value.name}}</div>
                </div>
                <span v-else>
                    {{slotProps.placeholder}}
                </span>
            </template>
            <template #option="slotProps">
                <div>
                    <div>{{slotProps.option.name}}</div>
                </div>
            </template>
        </Dropdown>
     <Dropdown v-model="selectedType" :options="types" optionLabel="name" :filter="true" placeholder="Data Type" :showClear="true">
       <template #value="slotProps">
         <div v-if="slotProps.value">
           <div>{{slotProps.value.name}}</div>
         </div>
         <span v-else>
                    {{slotProps.placeholder}}
                </span>
       </template>
       <template #option="slotProps">
         <div>
           <div>{{slotProps.option.name}}</div>
         </div>
       </template>
     </Dropdown>
     <Dropdown v-model="selectedTag1" :options="tags" optionLabel="name" :filter="true" placeholder="Tag #1" :showClear="true">
       <template #value="slotProps">
         <div v-if="slotProps.value">
           <div>{{slotProps.value.name}}</div>
         </div>
         <span v-else>
                    {{slotProps.placeholder}}
                </span>
       </template>
       <template #option="slotProps">
         <div>
           <div>{{slotProps.option.name}}</div>
         </div>
       </template>
     </Dropdown>
     <Dropdown v-model="selectedTag2" :options="tags" optionLabel="name" :filter="true" placeholder="Tag #2" :showClear="true">
       <template #value="slotProps">
         <div v-if="slotProps.value">
           <div>{{slotProps.value.name}}</div>
         </div>
         <span v-else>
                    {{slotProps.placeholder}}
                </span>
       </template>
       <template #option="slotProps">
         <div>
           <div>{{slotProps.option.name}}</div>
         </div>
       </template>
     </Dropdown>
   </div>
 </div>
  <ScrollPanel style="width: 95%; height: 200px; margin-top: 5%; margin-bottom: 50px;">
    <div class="source-list">
      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
      Vitae et leo duis ut diam.
      Ultricies mi quis hendrerit dolor magna eget est lorem. Amet consectetur adipiscing elit ut.
      Nam libero justo laoreet sit amet. Pharetra massa massa ultricies mi quis hendrerit dolor magna.
      Est ultricies integer quis auctor elit sed vulputate. Consequat ac felis donec et. Tellus orci ac auctor augue mauris.
      Semper feugiat nibh sed pulvinar proin gravida hendrerit lectus a. Tincidunt arcu non sodales neque sodales.
      Metus aliquam eleifend mi in nulla posuere sollicitudin aliquam ultrices. Sodales ut etiam sit amet nisl purus.
      Cursus sit amet dictum sit amet. Tristique senectus et netus et malesuada fames ac turpis egestas.
      Et tortor consequat id porta nibh venenatis cras sed. Diam maecenas ultricies mi eget mauris.
      Eget egestas purus viverra accumsan in nisl nisi. Suscipit adipiscing bibendum est ultricies integer.
      Mattis aliquam faucibus purus in massa tempor nec.
      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
      Vitae et leo duis ut diam.
      Ultricies mi quis hendrerit dolor magna eget est lorem. Amet consectetur adipiscing elit ut.
      Nam libero justo laoreet sit amet. Pharetra massa massa ultricies mi quis hendrerit dolor magna.
      Est ultricies integer quis auctor elit sed vulputate. Consequat ac felis donec et. Tellus orci ac auctor augue mauris.
      Semper feugiat nibh sed pulvinar proin gravida hendrerit lectus a. Tincidunt arcu non sodales neque sodales.
      Metus aliquam eleifend mi in nulla posuere sollicitudin aliquam ultrices. Sodales ut etiam sit amet nisl purus.
      Cursus sit amet dictum sit amet. Tristique senectus et netus et malesuada fames ac turpis egestas.
      Et tortor consequat id porta nibh venenatis cras sed. Diam maecenas ultricies mi eget mauris.
      Eget egestas purus viverra accumsan in nisl nisi. Suscipit adipiscing bibendum est ultricies integer.
      Mattis aliquam faucibus purus in massa tempor nec.
      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
      Vitae et leo duis ut diam.
      Ultricies mi quis hendrerit dolor magna eget est lorem. Amet consectetur adipiscing elit ut.
      Nam libero justo laoreet sit amet. Pharetra massa massa ultricies mi quis hendrerit dolor magna.
      Est ultricies integer quis auctor elit sed vulputate. Consequat ac felis donec et. Tellus orci ac auctor augue mauris.
      Semper feugiat nibh sed pulvinar proin gravida hendrerit lectus a. Tincidunt arcu non sodales neque sodales.
      Metus aliquam eleifend mi in nulla posuere sollicitudin aliquam ultrices. Sodales ut etiam sit amet nisl purus.
      Cursus sit amet dictum sit amet. Tristique senectus et netus et malesuada fames ac turpis egestas.
      Et tortor consequat id porta nibh venenatis cras sed. Diam maecenas ultricies mi eget mauris.
      Eget egestas purus viverra accumsan in nisl nisi. Suscipit adipiscing bibendum est ultricies integer.
      Mattis aliquam faucibus purus in massa tempor nec.
    </div>
  </ScrollPanel>
  <Button label="Add Data Source" class="p-button-text"/>
</template>

<script>
export default {
  name: "Datasources.vue",
  data(){
    return{
      selectedBackend: null,
      selectedType: null,
      selectedTag1: null,
      selectedTag2: null,
      backends:[
        {name: 'backend1'},
        {name: 'backend2'},
        {name: 'backend3'}
      ],
      types: [
        {name: 'text'},
        {name: 'webpage'},
        {name: 'repository'}
      ],
      tags: [
        {name: 'blue'},
        {name: 'red'},
        {name: 'green'}
      ]
    }
  }
}
</script>

<style scoped>

h2{
  margin: 20px 20px 20px 100px;
}

.p-dropdown {
  background-color: #242424;
  width: 14rem;
  margin-left: 5%;
  height: 40px;
}

.options{
  margin-left: 5%;
  margin-top: 2%;
}

.p-button-text{
  float: right;
  margin-right: 3%;
}

.source-list{
  margin-left: 10%;
  margin-right: 10%;
}
</style>