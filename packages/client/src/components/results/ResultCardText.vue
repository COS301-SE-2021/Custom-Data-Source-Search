<template>
    <div class="result-card">
        <div class="card-icon">
            <span id="text" title="File Datasource"><icon-file/></span>
        </div>
        <div style="width:900px;overflow:auto">
          <pre
                  v-for="(line, index) in result.occurrences"
                  :key="index"
          >
            <span v-html="line.occurrenceString"></span> <br>
            <span>------------------------------------</span>
          </pre>
        </div>
        <small> {{ result.source }} </small>
    </div>
</template>

<script>
    import IconFile from "../icons/IconFile";
    export default {
        name: "ResultCardText",
        components: {IconFile},
        props: {
            result: Object
        }
    }
</script>

<style scoped>
    .result-card {
        background-color: rgba(0, 0, 0, 0.2);
        text-align: left;
        max-width: 1000px;
        margin: 10px auto auto;
        border-radius: 10px;
        padding: 10px 20px;
    }
    h1 {
        font-size: 2em;
    }

    h2 {
        font-size: 1.5em;
    }

    p {
        font-size: 1em;
    }

    .card-icon {
        text-align: right;
        float: right;
        padding-bottom: 20px;
    }

</style>