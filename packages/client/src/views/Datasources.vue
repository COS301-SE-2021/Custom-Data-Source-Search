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
}
</style>