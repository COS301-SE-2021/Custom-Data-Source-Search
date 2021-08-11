import SearchResultCard from "@/components/results/SearchResultCard";

describe("whitelistStrip function", () => {
    it("Should return small correct string unchanged", () => {
        let content = "<div><h1>Hello</h1><h2>Wor<ld</h2><div style='color: red'></div></div>"
        let result = SearchResultCard.methods.whitelistEscape(content)
        expect(result).toEqual("<div><h1>Hello</h1><h2>Wor&lt;ld</h2><div style='color: red'></div></div>")
    })
    it("Should reject a malformed html string with error message", () => {
        let content = "<div onclick=\"alert('hello')\"><h1>Hello</h1><h2>World</h2><div style='color: red'></div></div>"
        let striped = SearchResultCard.methods.whitelistEscape(content)
        expect(striped).toEqual("<div><h2>Data from server seems malformed. For your security it will not be displayed.</h2></div>")
    })
    it("Should accept a correctly formed highlight.js string", () => {
        let content = "<pre class=\"lang-html s-code-block\"><code class=\"hljs language-xml\"><span class=\"hljs-tag\">&lt;<span class=\"hljs-name\">ul</span>&gt;</span>\n" +
            "    <span class=\"hljs-tag\">&lt;<span class=\"hljs-name\">li</span>&gt;</span>List item one<span class=\"hljs-tag\">&lt;/<span class=\"hljs-name\">li</span>&gt;</span>\n" +
            "    <span class=\"hljs-tag\">&lt;<span class=\"hljs-name\">li</span>&gt;</span>List item two with subitems:<span class=\"hljs-tag\">&lt;/<span class=\"hljs-name\">li</span>&gt;</span>\n" +
            "    <span class=\"hljs-tag\">&lt;<span class=\"hljs-name\">ul</span>&gt;</span>\n" +
            "        <span class=\"hljs-tag\">&lt;<span class=\"hljs-name\">li</span>&gt;</span>Subitem 1<span class=\"hljs-tag\">&lt;/<span class=\"hljs-name\">li</span>&gt;</span>\n" +
            "        <span class=\"hljs-tag\">&lt;<span class=\"hljs-name\">li</span>&gt;</span>Subitem 2<span class=\"hljs-tag\">&lt;/<span class=\"hljs-name\">li</span>&gt;</span>\n" +
            "    <span class=\"hljs-tag\">&lt;/<span class=\"hljs-name\">ul</span>&gt;</span>\n" +
            "    <span class=\"hljs-tag\">&lt;<span class=\"hljs-name\">li</span>&gt;</span>Final list item<span class=\"hljs-tag\">&lt;/<span class=\"hljs-name\">li</span>&gt;</span>\n" +
            "<span class=\"hljs-tag\">&lt;/<span class=\"hljs-name\">ul</span>&gt;</span>\n" +
            "</code></pre>";
        let result = SearchResultCard.methods.whitelistEscape(content);
        expect(result).toEqual(content)
    })
    it("Should accept", () => {
        let content = "<pre>\n" +
            "    <span class=\"hljs-title function_\">getAllFileDataSources</span>(<span class=\"hljs-params\"></span>) {\n" +
            "        <span class=\"hljs-keyword\">let</span> [<span style='background-color: #88ffff;color: dimgrey;'>result</span>, err] = fileDataSourceRepository.<span class=\"hljs-title function_\">getAllDataSources</span>();\n" +
            "        <span class=\"hljs-keyword\">if</span> (err) {\n" +
            "            <span class=\"hljs-keyword\">return</span> {\n" +
            "                <span class=\"hljs-string\">&quot;code&quot;</span>: <span class=\"hljs-number\">500</span>,\n" +
            "                <span class=\"hljs-string\">&quot;body&quot;</span>: {</pre>"
        let result = SearchResultCard.methods.whitelistEscape(content)
        expect(result).toEqual(content)
    })
})
