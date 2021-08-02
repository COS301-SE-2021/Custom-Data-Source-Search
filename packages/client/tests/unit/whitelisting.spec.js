import SearchResultCard from "@/components/results/SearchResultCard";

describe("whitelistStrip function", () => {
    it("Should return small correct string unchanged", () => {
        let content = "<div><h1>Hello</h1><h2>World</h2><div style='color: red'></div></div>"
        console.log(SearchResultCard.methods.whitelistStrip(content))
    })
})