<template>
  <div class="result-card">
    <div class="card-icon">
      <span v-html="icon"></span>
    </div>
    <div>
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
      let whitelist = new RegExp(
          [ `(<div${valid_attribute}>|<\/div>|`,
            `<h1${valid_attribute}>|<\/h1>|`,
            `<h2${valid_attribute}>|<\/h2>|`,
            `<svg${valid_attribute}>|<\/svg>|`,
            `<span${valid_attribute}>|<\/span>|`,
            `<code${valid_attribute}>|<\/code>|`,
            `<pre${valid_attribute}>|<\/pre>|`,
            `<p${valid_attribute}>|<\/p>|`,
            `<path${valid_attribute}>|<\/path>)`
          ].join(''),
          "g"
      )
      let matches = content.match(whitelist)
      if (this.confirmThatAllOpenedTagsAreClosed(matches)) {
        return this.escapeAllExceptMatches(content, matches);
      } else {
        return "<div><h2>Data from server seems malformed. For your security it will not be displayed.</h2></div>"
      }
    },
    escapeAllExceptMatches(content, matches) {
      let processedString = "";
      for (let i = 0; i < matches.length; i++) {
        console.log(content)
        let start_index_of_whitelisted_section = content.search(matches[i]);
        processedString += this.escapeHtml(content.substr(0, start_index_of_whitelisted_section)) + matches[i];
        content = content.substr(start_index_of_whitelisted_section + matches[i].length);
      }
      return processedString;
    },
    // Warning: This does not escape ' or " ensure it is only used to insert escaped code BETWEEN html tags, not INSIDE
    escapeHtml (string) {
      let pre = document.createElement('pre');
      let text = document.createTextNode(string);
      pre.appendChild(text);
      return pre.innerHTML;
    },
    extractTagName(tag) {
      return tag.match(/[A-Za-z0-9]+/)[0];
    },
    confirmThatAllOpenedTagsAreClosed(matches) {
      let stack = []
      for (let i = 0; i < matches.length; i++) {
        let tag = matches[i]
        if (tag.substr(0, 2) === "</") {
          if (stack.length === 0 || stack.pop() !== this.extractTagName(tag)) {
            return false;
          }
        } else {
          stack.push(this.extractTagName(tag))
        }
      }
      return stack.length === 0;
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