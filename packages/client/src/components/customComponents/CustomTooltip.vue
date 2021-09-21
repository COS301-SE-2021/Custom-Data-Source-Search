<template>
  <div class="tooltip-box">
    <slot/>
    <div class="tooltip">
      <div class="text" v-for="(text, index) in (unconnectedBackendNames)">
        <span>{{text}}</span>
        <Divider v-if="index!==(unconnectedBackendNames).length-1"/>
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

  .tooltip-box:hover .tooltip {
    opacity: 1;
    display: block;
  }

  .tooltip {
    color: rgba(255, 255, 255, 0.87);
    border-radius: 2px;
    width: fit-content;
    padding: 2vh;
    top: -50%;
    left: 120%;
    display: none;
    transition: opacity 0.2s;
    position: absolute;
    z-index: 2;
    background: #303030;
    margin-left: 0.5vw;
    margin-top: 2vh;
    box-shadow: 0 5px 5px -3px rgba(0, 0, 0, 0.2), 0 8px 10px 1px rgba(0, 0, 0, 0.14), 0 3px 14px 2px rgba(0, 0, 0, 0.12);
  }

  .tooltip:after {
    content: "";
    width: 20px;
    height: 20px;
    transform: rotate(-45deg);
    background: #303030;
    position: absolute;
    z-index: -1;
    top: 10px;
    left: 0;
  }

  .text {
    font-size: 15px;
    padding-top: 2px;
    float: left;
  }
</style>