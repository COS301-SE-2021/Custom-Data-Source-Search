<template>
    <div class="tooltip-box">
        <slot />
        <div
                class="tooltip"
        >
      <div class="text" v-for="text in unconnectedBackendNames">
         <span>{{ text }}</span>
      </div>
        </div>
    </div>
</template>

<script>
    import {mapGetters} from 'vuex';
    export default {
        name: 'CustomTooltip',
        props: {
            text: {
                type: Array,
                required: true
            }
        },
        computed: {
            ...mapGetters([
                'unconnectedBackendNames'
            ])
        }
    };
</script>

<style scoped>
    .tooltip-box {
        position: relative;
        display: inline-block;
    }

    .tooltip-box:hover .tooltip{
        opacity: 1;
    }

    .tooltip {
        color: #000000;
        text-align: center;
        border-radius: 2px;

        width: fit-content;
        padding: 1.5vh;
        top: 100%;
        left: 110%;
        margin-left: -60px;

        opacity: 0;
        transition: opacity 1s;

        position: absolute;
        z-index: 1;

        background: rgba(121, 179, 177, 0.47);
    }

    span {
        height: fit-content;
        padding-top: 2px;
    }
</style>