<template>
  <div class="search-bar">
    <el-input placeholder="Please input" v-model="input1" type="primary">
      <template #append>
        <el-button type="primary" icon="el-icon-search" ></el-button>
      </template>
    </el-input>
  </div>

</template>

<script>
import { defineComponent, ref } from 'vue'
export default defineComponent ({
  setup() {
    return {
      input1: ref(''),
    }
  }
})
</script>

<style>
.search-bar{
  margin-top: 50px;
}
</style>