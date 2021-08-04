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
      let valid_word = "[A-Za-z_][\\w\\s\\-:;,.]+";
      let valid_attribute_types = ["class", "d", "fill", "height", "style", "viewBox", "width"];
      let valid_html_tags = ["code", "div", "em", "h1", "h2", "pre", "path", "span", "svg"];
      // special case where strings of code like "<" and "</" and ">" should be allowed through for highlight.js to work
      let highlight_js_valid_html_partial = "\"[<>|\"|\"<\/\""

      let valid_attribute =`(?:\\s(?:${valid_attribute_types.join("|")})=(?:"(?:${valid_word})"|'(?:${valid_word})'))*`;
      let whitelist_production_line = [].push(highlight_js_valid_html_partial)
      for (let i = 0; i < valid_html_tags.length; i++) {
        whitelist_production_line.push(`<${valid_html_tags[i]}${valid_attribute}>|<\/${valid_html_tags[i]}>`)
      }
      let whitelistRegex = new RegExp(whitelist_production_line.join("|"), "g")
      let matches = content.match(whitelistRegex)
      if (this.confirmThatAllOpenedTagsAreClosed(matches)) {
        return this.escapeAllExceptMatches(content, matches);
      } else {
        return "<div><h2>Data from server seems malformed. For your security it will not be displayed.</h2></div>"
      }
    },
    escapeAllExceptMatches(content, matches) {
      let processedString = "";
      for (let i = 0; i < matches.length; i++) {
        let start_index_of_whitelisted_section = content.search(matches[i]);
        processedString += this.escapeHtml(content.substr(0, start_index_of_whitelisted_section)) + matches[i];
        content = content.substr(start_index_of_whitelisted_section + matches[i].length);
      }
      return processedString;
    },
    escapeHtml (string) {
      return string.replace(/[<>]/g, (match) => {
        if (match === "<") {
          return "&lt;";
        } else {
          return "&gt;"
        }
      })
    },
    confirmThatAllOpenedTagsAreClosed(matches) {
      let stack = []
      for (let i = 0; i < matches.length; i++) {
        let tag = matches[i]
        if (tag in ["\"<\"", "\">\"", "\"</\"",]) {
          // tag is the special exception written in for highlight.js
          continue
        }
        if (tag.substr(0, 2) === "</") {
          if (stack.length === 0 || stack.pop() !== this.extractTagName(tag)) {
            return false;
          }
        } else {
          stack.push(this.extractTagName(tag))
        }
      }
      return stack.length === 0;
    },
    extractTagName(tag) {
      return tag.match(/[A-Za-z0-9]+/)[0];
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