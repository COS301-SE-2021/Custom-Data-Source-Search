<template>
    <div class="duo-split-grid">
        <div class="">
            <span><b>Personal Information</b></span>
        </div>
        <div></div>
    </div>
</template>

<script>
    export default {
        name: "SettingsPage"
    }
</script>

<style scoped>

    .duo-split-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
    }

    b {

    }

</style>