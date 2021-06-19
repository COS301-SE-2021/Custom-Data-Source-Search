<template>
  <div>
    <el-row :gutter="20" style="height: 100%;">
      <el-col :span="2"><div class="grid-content bg-purple"><CollapseSideNav></CollapseSideNav></div></el-col>
      <el-col :span="12"><div class="grid-content bg-purple">
        <SearchBar></SearchBar>
        <SearchResult></SearchResult>
      </div></el-col>
    </el-row>

  </div>

</template>

<script>
    import CollapseSideNav from "./LandingPageCompnents/CollapseSideNav";
    import SearchBar from "./LandingPageCompnents/SearchBar";
    import SearchResult from "./LandingPageCompnents/SearchResult"
    export default {
        props: {
            msg: String
        },
        data() {
            return {}
        },
        components: {
          SearchResult,
          SearchBar,
            CollapseSideNav
        }
    };
</script>

<style>

</style>
