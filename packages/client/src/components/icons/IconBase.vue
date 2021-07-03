<template>
    <div class="icon-base">
        <svg
                :xmlns="xmlns"
                :title="iconTitle"
                :height="height"
                :width="width"
                :fill="iconColor"
                :viewBox="viewBox"
        >
            <path :d="path1" :fill="path1Fill"/>
            <path :d="path2"/>
        </svg>
    </div>
</template>

<script>
    export default {
        name: "IconBase",
        props: {
            xmlns: {
                type: String,
                default: 'http://www.w3.org/2000/svg'
            },
            iconTitle: {
                type: String,
                default: 'File'
            },
            width: {
                type: [Number, String],
                default: 24
            },
            height: {
                type: [Number, String],
                default: 24
            },
            iconColor: {
                type: String,
                default: 'rgba(255, 255, 255, 0.58)'
            },
            viewBox: {
                type: String,
                default: '0 0 24 24'
            },
            path1: String,
            path1Fill: {
                type: String,
                default: 'none'
            },
            path2: String,
        }
    }
</script>

<style scoped>

.icon-base {
    padding-top: 20px;
    padding-right: 20px;
    border-radius: 10px;
}

</style>