<template>
    <el-container>
       <h1> {{ msg }}</h1>
    </el-container>
</template>

<script>
    export default {
        props: {
            msg: String
        },
        data() {
            return {}
        },
        methods: {
        }
    };
</script>

<style>
    .el-header,
    .el-footer {
        background-color: #474747;
        color: floralwhite;
        text-align: center;
        line-height: 60px;
    }

    .el-aside {
        background-color: #D3DCE6;
        color: #333;
        text-align: center;
        line-height: 200px;
    }

    .el-main {
        background-color:  #474747;
        color: whitesmoke;
        text-align: center;
        line-height: 160px;
    }

    body > .el-container {
        margin-bottom: 40px;
    }

    .el-container:nth-child(5) .el-aside,
    .el-container:nth-child(6) .el-aside {
        line-height: 260px;
    }

    .el-container:nth-child(7) .el-aside {
        line-height: 320px;
    }
    .el-carousel__item h3 {
        color: #475669;
        font-size: 14px;
        opacity: 0.75;
        line-height: 200px;
        margin: 0;
    }

    .el-carousel__item:nth-child(2n) {
        background-color: #99a9bf;
    }

    .el-carousel__item:nth-child(2n+1) {
        background-color: #d3dce6;
    }

    .el-tabs{
        color: floralwhite;
    }
    .el-tabs__item{
        color: floralwhite;
    }
    body {
        background: #2c2c2c;
        color: floralwhite;
        background-size: 400% 400%;
    }
    .el-menu-vertical-demo:not(.el-menu--collapse) {
        width: 200px;
        min-height: 400px;
    }

    #example-icons{
        line-height: 60px;
    }

    .el-dialog{
        z-index: 100;
    }
</style>
