<template>
<!--    <el-radio-group v-model="isCollapse" style="text-align: left;">-->
<!--        <el-radio-button :label="false">expand</el-radio-button>-->
<!--        <el-radio-button :label="true">collapse</el-radio-button>-->
<!--    </el-radio-group>-->
    <el-menu default-active="2" class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose" :collapse="isCollapse">
        <el-submenu index="1">
            <template #title>
                <i class="el-icon-download"></i>
<!--                <span>Navigator One</span>-->
            </template>
            <el-menu-item-group>
                <template #title><span>Group One</span></template>
                <el-menu-item index="1-1">item one</el-menu-item>
                <el-menu-item index="1-2">item two</el-menu-item>
            </el-menu-item-group>
            <el-menu-item-group title="Group Two">
                <el-menu-item index="1-3">item three</el-menu-item>
            </el-menu-item-group>
            <el-submenu index="1-4">
                <template #title><span>item four</span></template>
                <el-menu-item index="1-4-1">item one</el-menu-item>
            </el-submenu>
        </el-submenu>
        <el-menu-item index="2">
            <i class="el-icon-menu"></i>
<!--            <template #title>Navigator Two</template>-->
        </el-menu-item>
        <el-menu-item index="3" disabled>
            <i class="el-icon-document"></i>
<!--            <template #title>Navigator Three</template>-->
        </el-menu-item>
        <el-menu-item index="4">
            <i class="el-icon-setting"></i>
<!--            <template #title>Navigator Four</template>-->
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