<template>
  <div class="search-bar">
    <el-input placeholder="Search..." v-model="query" type="primary">
      <template #append>
        <el-button @click="search" icon="el-icon-search" ></el-button>
      </template>
    </el-input>
  </div>

</template>

<script>
import { defineComponent, ref } from 'vue'
export default defineComponent ({
  data() {
    return {
      query: "",
      result: [],
      datasource: "",
      datasourceList: []
    }
  },
  setup() {
    return {
      input1: ref(''),
    }
  },
  methods: {
    search() {
      this.result = []
      this.queryServer(this.query)
    },
    queryServer(query) {
      $.get(
          `http://localhost:3001/general/${query}`,
          (data) => {
            if(data.length === undefined) {
              alert("Sorry, nothing could be found...")
            }
            this.result = data;
            this.$emit('myVarChanged', this.result);
          }
      );
    }
  }
})
</script>

<style>
.search-bar{
  margin-top: 50px;
  margin-bottom: 30px;
}

.search-bar .el-input .el-button{
  background: #18B495;
  color: black;
}

</style>