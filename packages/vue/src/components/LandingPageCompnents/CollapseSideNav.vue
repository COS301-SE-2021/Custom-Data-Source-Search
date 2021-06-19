<template>
    <el-menu fill-height default-active="1" class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose" :collapse="isCollapse" :router="true">
<!--      Each menu item routes to necessary view. Settings is temporarily disabled as it does not route to any view as of yet.-->
        <el-menu-item index="1" route="/TestLandingPage">
          <i class="el-icon-search" ></i>
        </el-menu-item>
        <el-menu-item index="2" route="/ViewDataSource">
          <i class="el-icon-folder" ></i>
        </el-menu-item>
        <el-menu-item index="3" disabled>
            <i class="el-icon-setting"></i>
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