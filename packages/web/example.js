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
            this.queryServer(this.query)
        },
        queryServer(query) {
            let serverQuery = `http://localhost:3001/textdatasources/search/string/${query}`;
            $.get(
                serverQuery,
                (data) => {
                    this.result = data;
                }
            );
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