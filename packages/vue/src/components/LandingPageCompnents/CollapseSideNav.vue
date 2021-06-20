<template>
    <el-menu fill-height default-active="1" class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose" :collapse="isCollapse" :router="true">
<!--      Each menu item routes to necessary view. Settings is temporarily disabled as it does not route to any view as of yet.-->
        <el-menu-item index="1" route="/TestLandingPage">
          <em class="el-icon-search" ></em>
        </el-menu-item>
        <el-menu-item index="2" route="/ViewDataSource">
          <em class="el-icon-folder" ></em>
        </el-menu-item>
        <el-menu-item index="3" route="/AddDataSource">
          <em class="el-icon-folder-add"></em>
        </el-menu-item>
        <el-menu-item index="4" disabled>
            <em class="el-icon-setting"></em>
        </el-menu-item>
    </el-menu>
</template>

<script>
    export default {
        data() {
            return {
                isCollapse: true
            };
        },
        methods: {
            handleOpen(key, keyPath) {
                console.log(key, keyPath);
            },
            handleClose(key, keyPath) {
                console.log(key, keyPath);
            }
        }
    }
</script>

<style>


</style>