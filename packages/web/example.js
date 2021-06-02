const SearchSystem = {
    data() {
        return {
            query: "",
            result: [],
            datasource: "",
            datasourceList: []
        }
    },
    methods: {
        search() {
            let json = this.queryServer(this.query)
            console.log(json)
            this.result = json
        },
        queryServer(query) {
            console.log(query)
            return [
                {
                    title: "lewis.txt",
                    snippet: "Of all tyrannies, a tyranny sincerely exercised for the good of its victims may be the most oppressive. It would be better to live under robber barons than under omnipotent moral busybodies. The robber baron's cruelty may sometimes sleep, his cupidity may at some point be satiated; but those who torment us for our own good will torment us without end for they do so with the approval of their own conscience."
                },
                {
                    title: "churchill.txt",
                    snippet: "It is not enough that we do our best; sometimes we must do what is required."
                }
            ]
        }
    }
}

Vue.createApp(SearchSystem).mount("#search-system")


const DataSource = {
    data() {
        return {
            datasource: "",
            datasourceList: []
        }
    },
    methods: {
        addDataSource() {
            if (!this.datasourceList.includes(this.datasource)) {
                this.datasourceList.push({info: this.datasource})
            }
        }
    }
}

Vue.createApp(DataSource).mount("#data-sources")