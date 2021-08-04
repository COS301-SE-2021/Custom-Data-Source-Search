import SearchResultCard from "@/components/results/SearchResultCard";

describe("whitelistStrip function", () => {
    it("Should return small correct string unchanged", () => {
        let content = "<div><h1>Hello</h1><h2>Wor<ld</h2><div style='color: red'></div></div>"
        let result = SearchResultCard.methods.whitelistStrip(content)
        expect(result).toEqual("<div><h1>Hello</h1><h2>Wor&lt;ld</h2><div style='color: red'></div></div>")
    })
    it("Should not return a malformed html string", () => {
        let content = "<div onclick=\"alert(this)\"><h1>Hello</h1><h2>World</h2><div style='color: red'></div></div>"
        let striped = SearchResultCard.methods.whitelistStrip(content)
        expect(striped).toEqual("<div><h2>Data from server seems malformed. For your security it will not be displayed.</h2></div>")
    })
    it("Should allow whitelisted highlight.js snippets through", () => {
        let content = "<span class=\"hljs-tag\">&lt;/<span class=\"hljs-name\">li</span>&gt;</span>"
    })
})
