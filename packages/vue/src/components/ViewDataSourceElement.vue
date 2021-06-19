<template>
  <div>
    <el-row :gutter="20" style="height: 100%;">
      <el-col :span="2"><div class="grid-content bg-purple"><CollapseSideNav></CollapseSideNav></div></el-col>
      <el-col :span="12"><div class="grid-content bg-purple">
        <DataSourceList></DataSourceList>
      </div></el-col>

    </el-row>

  </div>

</template>

<script>
import CollapseSideNav from "./LandingPageCompnents/CollapseSideNav";
import DataSourceList from "./ViewDataSourceComponents/DataSourceList";
export default {
  props: {
    msg: String
  },
  data() {
    return { myVar:null }
  },
  methods: {
    updateMyVar(val){
      this.myVar = val;
    }
  },
  components: {
    DataSourceList,
    CollapseSideNav
  }
};
</script>

<style>

</style>