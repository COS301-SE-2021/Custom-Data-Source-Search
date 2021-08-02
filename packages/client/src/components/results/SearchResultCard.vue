<template>
  <div class="result-card">
    <div class="card-icon">
      <span v-html="icon"></span>
    </div>
    <div class="23">
      <h3>{{name}}</h3>
    </div>
    <div>
      <span v-html="this.whitelistStrip(content)"></span>
    </div>
    <div>
      {{source}}
    </div>
  </div>
</template>

<script>
export default {
  name: "SearchResultCard",
  props: {
    icon: String,
    name: String,
    content: String,
    source: String
  },
  methods: {
    whitelistStrip(content) {
      let valid_word = `(?:[A-Za-z_][\\w\\s\\-:;,.()]+)`
      let valid_attribute_type = `(?:class|style|href|xmlns|height|viewBox|width)`
      let valid_attribute =`(?:\\s${valid_attribute_type}=(?:"${valid_word}"|'${valid_word}'))*`
      let regExp = new RegExp(
          [`(<div${valid_attribute}>)|(<\/div>)|`,
            `(<h1${valid_attribute}>)|(<\/h1>)|`,
            `(<h2${valid_attribute}>)|(<\/h2>)|`,
            `(<svg${valid_attribute}>)|(<\/svg>|)|`,
            `(<span${valid_attribute}>)|(<\/span>)|`,
            `(<code${valid_attribute}>)|(<\/code>)|`,
            `(<pre${valid_attribute}>)|(<\/pre>)|`,
            `(<p${valid_attribute}>)|(<\/p>)|`,
            `(<path${valid_attribute}>)|(<\/path>)`].join('')
      )
      console.log(regExp)
      return content.split(regExp)
    }
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
  padding-top: 10px;
  }
</style>